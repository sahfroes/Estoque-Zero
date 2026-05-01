// ============================================================
// ESTADO DA APLICAÇÃO
// ============================================================
let saldoMeta = 100;
let totalGasto = 0;
let itensCarrinho = [];
let streamAtivo = null;
let scannerAtivo = false;
let intervaloCronometro = null;
let ultimoQRDetectado = '';
let bloqueioQR = false; // evita leituras repetidas rápidas

// Banco de produtos simulados (QR code → produto)
// O texto do QR code é mapeado para estes produtos demo
const catalogoProdutos = {
    "LEITE001": { nome: "Leite Integral 1L", preco: 6.50, categoria: "ESSENCIAL" },
    "PAO002":   { nome: "Pão de Forma", preco: 8.90, categoria: "ESSENCIAL" },
    "CAFE003":  { nome: "Café Torrado 500g", preco: 18.00, categoria: "ESSENCIAL" },
    "CHOCO004": { nome: "Chocolate 170g", preco: 12.50, categoria: "LAZER" },
    "SUCO005":  { nome: "Suco de Laranja 1L", preco: 9.90, categoria: "LAZER" },
    "DETERG006":{ nome: "Detergente 500ml", preco: 4.20, categoria: "OUTROS" },
    "ARROZKG":  { nome: "Arroz 5kg", preco: 27.90, categoria: "ESSENCIAL" },
    "FEIJAO1K": { nome: "Feijão Carioca 1kg", preco: 11.50, categoria: "ESSENCIAL" },
    "REFRI2L":  { nome: "Refrigerante 2L", preco: 8.50, categoria: "LAZER" },
    "SABONETE": { nome: "Sabonete Pack 6un", preco: 14.90, categoria: "OUTROS" },
};

// Produto padrão para QR codes desconhecidos (demo)
function produtoAleatorio(qrText) {
    const precos = [3.99, 6.50, 9.90, 12.00, 15.50, 22.00, 7.80];
    const nomes = ["Produto Escaneado", "Item do Mercado", "Alimento Importado", "Bebida Natural"];
    const cats = ["ESSENCIAL", "LAZER", "OUTROS"];
    // Usa hash simples do texto para ser determinístico
    let hash = 0;
    for (let c of qrText) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff;
    return {
        nome: nomes[hash % nomes.length],
        preco: precos[hash % precos.length],
        categoria: cats[hash % cats.length]
    };
}

// ============================================================
// NAVEGAÇÃO
// ============================================================
function navegarPara(idTela) {
    document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
    const destino = document.getElementById(idTela);
    if (destino) {
        setTimeout(() => {
            destino.classList.add('ativa');
            if (idTela === 'tela-grafico') animarBarras();
            else resetarBarras();

            // Desliga câmera ao sair da tela de câmera
            if (idTela !== 'tela-camera') {
                pararScanner();
            }
        }, 50);
    }
}

// ============================================================
// SALDO / META
// ============================================================
function ajustarSaldo(valor) {
    saldoMeta = valor;
    const visor = document.getElementById('visor-saldo');
    visor.style.transform = 'scale(1.08)';
    visor.innerText = `R$ ${valor}`;
    setTimeout(() => visor.style.transform = 'scale(1)', 180);
}

// ============================================================
// INICIAR SCANNER
// ============================================================
function iniciarScanner() {
    // Reset estado
    totalGasto = 0;
    itensCarrinho = [];
    ultimoQRDetectado = '';
    atualizarUI();

    navegarPara('tela-camera');

    setTimeout(() => {
        ligarCamera();
        iniciarCronometro();
    }, 300);
}

// ============================================================
// CÂMERA
// ============================================================
async function ligarCamera() {
    const video = document.getElementById('video-scanner');
    const status = document.getElementById('scanner-status');
    const erroDiv = document.getElementById('erro-camera');
    erroDiv.style.display = 'none';

    // Para stream anterior se houver
    pararStream();

    try {
        status.textContent = '● INICIANDO CÂMERA...';
        status.style.color = '#f1c40f';

        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: { ideal: 'environment' }, // câmera traseira
                width: { ideal: 640 },
                height: { ideal: 480 }
            }
        });

        streamAtivo = stream;
        video.srcObject = stream;

        video.onloadedmetadata = () => {
            video.play();
            status.textContent = '● SCANNER ATIVO';
            status.style.color = '#2ecc71';
            scannerAtivo = true;
            loopQR();
        };

    } catch (err) {
        console.error('Erro câmera:', err);
        erroDiv.style.display = 'flex';
        status.textContent = '● CÂMERA INDISPONÍVEL';
        status.style.color = '#e74c3c';
    }
}

function pararStream() {
    if (streamAtivo) {
        streamAtivo.getTracks().forEach(t => t.stop());
        streamAtivo = null;
    }
    const video = document.getElementById('video-scanner');
    if (video) video.srcObject = null;
}

function pararScanner() {
    scannerAtivo = false;
    pararStream();
    if (intervaloCronometro) {
        clearInterval(intervaloCronometro);
        intervaloCronometro = null;
    }
}

// ============================================================
// LOOP DE LEITURA QR
// ============================================================
function loopQR() {
    if (!scannerAtivo) return;

    const video = document.getElementById('video-scanner');
    const canvas = document.getElementById('canvas-qr');

    if (!video || video.readyState < 2) {
        requestAnimationFrame(loopQR);
        return;
    }

    const w = video.videoWidth;
    const h = video.videoHeight;

    if (w === 0 || h === 0) {
        requestAnimationFrame(loopQR);
        return;
    }

    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h);

    const imageData = ctx.getImageData(0, 0, w, h);

    try {
        const qrCode = jsQR(imageData.data, w, h, {
            inversionAttempts: 'dontInvert'
        });

        if (qrCode && qrCode.data && !bloqueioQR) {
            const texto = qrCode.data.trim();
            if (texto !== ultimoQRDetectado) {
                ultimoQRDetectado = texto;
                processarQR(texto);
            }
        }
    } catch (e) {
        // Ignora erros de parsing
    }

    requestAnimationFrame(loopQR);
}

// ============================================================
// PROCESSAR QR CODE DETECTADO
// ============================================================
function processarQR(texto) {
    // Bloqueia novas leituras por 2.5s
    bloqueioQR = true;
    setTimeout(() => {
        bloqueioQR = false;
        ultimoQRDetectado = '';
    }, 2500);

    // Busca produto no catálogo ou gera um demo
    const produto = catalogoProdutos[texto.toUpperCase()] || produtoAleatorio(texto);

    // Flash visual de sucesso
    const janela = document.querySelector('.janela-ra');
    const flash = document.createElement('div');
    flash.className = 'qr-flash';
    janela.appendChild(flash);
    setTimeout(() => flash.remove(), 500);

    // Vibração (se suportado)
    if (navigator.vibrate) navigator.vibrate([60, 30, 60]);

    // Adiciona ao carrinho
    itensCarrinho.push(produto);
    totalGasto += produto.preco;
    atualizarUI();
    mostrarPopup(produto);
}

// ============================================================
// MOSTRAR POPUP DO PRODUTO
// ============================================================
function mostrarPopup(produto) {
    const popup = document.getElementById('popup-item');
    const label = document.getElementById('scan-label');

    document.getElementById('popup-nome').textContent = produto.nome;
    document.getElementById('popup-cat').textContent = 'CATEGORIA: ' + produto.categoria;
    document.getElementById('popup-preco').textContent = `R$ ${produto.preco.toFixed(2).replace('.', ',')}`;

    popup.style.display = 'block';
    label.style.display = 'none';

    setTimeout(() => {
        popup.style.display = 'none';
        label.style.display = 'block';
    }, 2200);
}

// ============================================================
// ATUALIZAR UI
// ============================================================
function atualizarUI() {
    const total = totalGasto;
    const cor = total > saldoMeta ? '#e74c3c' : '#2ecc71';

    // HUD
    document.getElementById('total-jogo').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    document.getElementById('total-jogo').style.color = cor;

    // Rodapé
    document.getElementById('soma-final').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    document.getElementById('soma-final').style.color = cor;
    document.getElementById('qtd-itens').textContent = itensCarrinho.length;

    // Lista de itens
    const lista = document.getElementById('lista-itens');
    lista.innerHTML = '';
    itensCarrinho.slice(-4).reverse().forEach(item => {
        const linha = document.createElement('div');
        linha.className = 'item-linha';
        linha.innerHTML = `<span class="item-nome">${item.nome}</span><span>R$ ${item.preco.toFixed(2).replace('.', ',')}</span>`;
        lista.appendChild(linha);
    });
}

// ============================================================
// CRONÔMETRO
// ============================================================
function iniciarCronometro() {
    if (intervaloCronometro) clearInterval(intervaloCronometro);
    let tempo = 120;
    const el = document.getElementById('cronometro');

    intervaloCronometro = setInterval(() => {
        if (!document.getElementById('tela-camera').classList.contains('ativa')) {
            clearInterval(intervaloCronometro);
            return;
        }
        tempo--;
        let min = Math.floor(tempo / 60);
        let seg = tempo % 60;
        el.textContent = `⏱️ ${min}:${seg < 10 ? '0' : ''}${seg}`;

        if (tempo <= 30) el.style.color = '#e74c3c';
        else el.style.color = '';

        if (tempo <= 0) {
            clearInterval(intervaloCronometro);
            finalizarCarrinho();
        }
    }, 1000);
}

// ============================================================
// FINALIZAR CARRINHO
// ============================================================
function finalizarCarrinho() {
    pararScanner();

    const economia = Math.max(0, saldoMeta - totalGasto);
    document.getElementById('msg-economia').textContent =
        economia > 0
            ? `Você economizou R$ ${economia.toFixed(2).replace('.', ',')}`
            : `Você ultrapassou em R$ ${Math.abs(saldoMeta - totalGasto).toFixed(2).replace('.', ',')}`;

    document.getElementById('stat-economia').textContent = `R$ ${economia.toFixed(0)}`;
    document.getElementById('stat-itens').textContent = itensCarrinho.length;

    navegarPara('tela-vitoria');
}

// ============================================================
// REINICIAR
// ============================================================
function reiniciar() {
    totalGasto = 0;
    itensCarrinho = [];
    ultimoQRDetectado = '';
    document.getElementById('cronometro').textContent = '⏱️ 02:00';
    document.getElementById('cronometro').style.color = '';
    navegarPara('tela-login');
}

// ============================================================
// GRÁFICO
// ============================================================
function animarBarras() {
    setTimeout(() => {
        document.getElementById('barra-bom').style.height = "85%";
        document.getElementById('barra-alerta').style.height = "48%";
        document.getElementById('barra-mau').style.height = "28%";
    }, 300);
}

function resetarBarras() {
    ['barra-bom','barra-alerta','barra-mau'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.height = '0%';
    });
}

function aoDetectarQRCode(codigoLido) {
    console.log("QR Code detectado:", codigoLido);

    // Envia o código para o seu servidor Node.js
    fetch('/processar-qr', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codigo: codigoLido }) // Envia o texto do QR Code
    })
    .then(response => response.json())
    .then(data => {
        // AQUI o servidor respondeu! 
        // 'data' contém o novo saldo e os dados do gráfico que enviamos no server.js
        console.log("Resposta do servidor:", data);

        // Agora você usa os dados para atualizar sua tela:
        document.getElementById('seu-elemento-de-saldo').innerText = `R$ ${data.restante}`;
        
        // Se você tiver uma função que desenha o gráfico, chame ela aqui:
        // atualizarGrafico(data.dadosGrafico);
        
        alert("Item processado: " + data.nomeProduto);
    })
    .catch(err => console.error("Erro ao falar com o servidor:", err));
}
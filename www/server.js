const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());

// Isso diz ao Node para entregar os arquivos (HTML, CSS, JS) da pasta onde ele está
app.use(express.static(__dirname));

// Rota principal: Entrega o arquivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para o QR Code (o seu script.js vai chamar isso aqui)
app.post('/processar-qr', (req, res) => {
    const { codigo } = req.body;
    console.log("Recebido do celular:", codigo);
    
    // Simulação de resposta
    res.json({ 
        sucesso: true, 
        restante: 85.50, 
        nomeProduto: "Item Escaneado",
        dadosGrafico: [70, 50, 20] 
    });
});

app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});


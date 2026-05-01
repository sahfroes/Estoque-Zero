<div align="center">
  
# 📦 Estoque Zero
**A revolução gamificada do controle financeiro na palma da sua mão.**

[![GitHub license](https://img.shields.io/github/license/SEU-USUARIO/estoque-zero?style=flat-square&color=58a6ff)](https://github.com/SEU-USUARIO/estoque-zero/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Lifecycle: Experimental](https://img.shields.io/badge/Lifecycle-Experimental-orange.svg?style=flat-square)](https://reproducible-builds.org/docs/source-date-epoch/)

</div>

---

### 📑 Sumário
- [🎯 O Desafio](#-o-desafio)
- [✨ Key Features](#-key-features)
- [🛠 Stack Tecnológica](#-stack-tecnológica)
- [🎮 Mecânicas de Jogo](#-mecânicas-de-jogo)
- [📦 Estrutura](#-estrutura)
- [⚠️ Requisitos](#️-requisitos)
- [⚙️ Configuração](#️-configuração)
- [🚀 Melhorias Futuras](#-melhorias-futuras)


---

## 🎯 O Desafio
O **Estoque Zero** nasceu da necessidade de tornar a educação financeira menos burocrática. Através de um ambiente controlado de simulação, o projeto utiliza a câmera do dispositivo para transformar produtos físicos em dados digitais, permitindo que o usuário aprenda a gerenciar seu orçamento enquanto "joga".

> **Status do Projeto:** 🛠️ Em desenvolvimento (Fase de Implementação de UI)

---

## ✨ Key Features
- **Smart Scanning:** Reconhecimento instantâneo via QR Code utilizando WebRTC.
- **Real-time Feedback:** Cálculo imediato de saldo residual e impacto no orçamento.
- **Multi-platform:** Desenvolvido com foco em Web-first, mas preparado para Android via Capacitor.
- **Interactive UI:** Design pensado para ser intuitivo e rápido, focado na experiência do usuário (UX).

---

## 🛠 Stack Tecnológica

| Camada | Tecnologia | Função |
| :--- | :--- | :--- |
| **Interface** | HTML5 / CSS3 / JS | Estrutura e Estilização |
| **Lógica** | JavaScript (ES6+) | Motor de gamificação |
| **Visão** | jsQR / WebRTC | Processamento de imagem da câmera |
| **Mobile** | Capacitor | Bridge para aplicativos nativos |
| **Server** | Node.js / Express | Servidor de arquivos e rotas |

---

## 🎮 Mecânicas de Jogo
O projeto aplica conceitos de **Octalysis** (Gamificação):
1. **Escassez:** O usuário tem um tempo limite para finalizar a compra.
2. **Realização:** Ganho de pontos ao se manter dentro da meta financeira.
3. **Propriedade:** O "carrinho" digital funciona como o inventário do jogador.

---

## ⚠️ Requisitos
Navegador com acesso à câmera
Permissão de câmera ativa
Execução via localhost ou HTTPS


## 🚀 Melhorias Futuras
Integração com banco de dados
Cadastro real de produtos
Sistema de pontuação
Ranking de usuários
Integração com API de preços
Realidade aumentada com objetos 3D

## ⚙️ Configuração 
**Pré-requisitos:**
- Reconhecimento instantâneo via QR Code utilizando WebRTC.Pré-requisitos:
- Node.js instalado (v16 ou superior)
- Navegador com suporte a getUserMedia (Chrome, Firefox, Safari)

**Instalação Rápida:**
-  Clone o repositório: git clone [https://github.com/SEU-USUARIO/estoque-zero.git](https://github.com/SEU-USUARIO/estoque-zero.git)
- Instale as dependências:
Bash ->
npm install
- Execute o ambiente de desenvolvimento:
Bash ->
npm start 

## 📂 Estrutura
```bash
├── 🤖 android          # Builds nativas para dispositivos móveis
├── 🌐 www              # Core da aplicação (Web)
│   ├── assets          # Imagens, fontes e ícones
│   ├── js              # Scripts e lógica do scanner
│   └── index.html      # Ponto de entrada
├── ⚙️ config           # Arquivos de configuração do sistema
└── 📄 server.js        # Entry point do backend


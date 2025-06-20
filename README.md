# Quizterios 🧠

A dynamic quiz game powered by AI that generates unique questions across multiple themes.

## 🇬🇧 English README

### 🎮 About

Quizterios is an interactive quiz game that uses Google's Gemini AI to generate unique questions on various topics. Each
game session provides fresh, AI-generated questions, making every playthrough a new experience.

### ✨ Features

- **AI-Generated Questions**: Powered by Google Gemini API for unique questions every time
- **Multiple Themes**: History, Cinema, Sports, Geography, Pop Culture and Science
- **Persistent Leaderboard**: Scores are saved locally using localStorage
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Real-time Scoring**: Immediate feedback with explanations for each answer
- **Game Over on Wrong Answer**: Challenge mode \- one wrong answer ends the game

### 🚀 Getting Started

#### Prerequisites

- Node.js (v14 or higher)
- A Google Gemini API key

#### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd quizterios
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your Gemini API key:

```
VITE_GEMINI_API_KEY=your_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

#### Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and add it to your `.env` file

### 🎯 How to Play

1. Enter your name on the start screen
2. Click "Começar" (Start) to begin the game
3. Answer multiple-choice questions across various themes
4. Get immediate feedback with explanations
5. Continue until you get a question wrong
6. View your final score and check the leaderboard
7. Try to beat your high score!

### 🛠️ Technologies Used

- **React**: Frontend framework
- **Vite**: Build tool and development server
- **Tailwind CSS**: Styling framework
- **Lucide React**: Icons
- **Google Gemini AI**: Question generation
- **localStorage**: Data persistence

### 📁 Project Structure

```
src/
├── components/
│   └── Quizterios.jsx    # Main game component
├── App.jsx               # App root
└── main.jsx             # Entry point
```

### 🎨 Themes Available

- 📚 **História** - Historical events and figures
- 🎬 **Cinema** - Movies, actors, and film industry
- ⚽ **Esportes** - Sports, athletes, and competitions
- 🌍 **Geografia** - Countries, capitals, and geography
- 🎵 **Cultura Pop** - Music, celebrities, and trends
- 🔬 **Ciência** - Science, technology, and discoveries

### 🏆 Leaderboard

The game features a persistent leaderboard that:

- Stores the top 10 scores locally
- Displays player names, scores, and dates
- Shows rankings with medal icons for top 3 positions
- Allows clearing the leaderboard

---

## 🇧🇷 README em Português (Brasil)

### 🎮 Sobre

Quizterios é um jogo de quiz interativo que usa a IA Gemini do Google para gerar perguntas únicas sobre vários temas.
Cada sessão de jogo oferece perguntas inéditas geradas por IA, tornando cada partida uma nova experiência.

### ✨ Funcionalidades

- **Perguntas Geradas por IA**: Alimentado pela API Google Gemini para perguntas únicas sempre
- **Múltiplos Temas**: História, Cinema, Esportes, Geografia, Cultura Pop, Ciência
- **Ranking Persistente**: Pontuações salvas localmente usando localStorage
- **Design Responsivo**: Interface moderna e bonita que funciona em todos os dispositivos
- **Pontuação em Tempo Real**: Feedback imediato com explicações para cada resposta
- **Game Over ao Errar**: Modo desafio - uma resposta errada termina o jogo

### 🚀 Como Começar

#### Pré-requisitos

- Node.js (v14 ou superior)
- Uma chave da API Google Gemini

#### Instalação

1. Clone o repositório:

```bash
git clone <url-do-seu-repo>
cd quizterios
```

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto e adicione sua chave da API Gemini:

```
VITE_GEMINI_API_KEY=sua_chave_api_aqui
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

#### Obtendo uma Chave da API Gemini

1. Visite o [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Faça login com sua conta Google
3. Crie uma nova chave de API
4. Copie a chave e adicione ao seu arquivo `.env`

### 🎯 Como Jogar

1. Digite seu nome na tela inicial
2. Clique em "Começar" para iniciar o jogo
3. Responda perguntas de múltipla escolha sobre vários temas
4. Receba feedback imediato com explicações
5. Continue até errar uma pergunta
6. Veja sua pontuação final e confira o ranking
7. Tente superar seu recorde!

### 🛠️ Tecnologias Utilizadas

- **React**: Framework frontend
- **Vite**: Ferramenta de build e servidor de desenvolvimento
- **Tailwind CSS**: Framework de estilização
- **Lucide React**: Ícones
- **Google Gemini AI**: Geração de perguntas
- **localStorage**: Persistência de dados

### 📁 Estrutura do Projeto

```
src/
├── components/
│   └── Quizterios.jsx    # Componente principal do jogo
├── App.jsx               # Raiz da aplicação
└── main.jsx             # Ponto de entrada
```

### 🎨 Temas Disponíveis

- 📚 **História** - Eventos históricos e figuras importantes
- 🎬 **Cinema** - Filmes, atores e indústria cinematográfica
- ⚽ **Esportes** - Esportes, atletas e competições
- 🌍 **Geografia** - Países, capitais e geografia
- 🎵 **Cultura Pop** - Música, celebridades e tendências
- 🔬 **Ciência** - Ciência, tecnologia e descobertas

### 🏆 Ranking

O jogo possui um ranking persistente que:

- Armazena as 10 melhores pontuações localmente
- Exibe nomes dos jogadores, pontuações e datas
- Mostra rankings com ícones de medalha para o top 3
- Permite limpar o ranking

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or issues, please open an issue on GitHub.
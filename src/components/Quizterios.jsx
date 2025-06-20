import React, {useState, useEffect} from 'react';
import {GoogleGenAI} from "@google/genai";
import {Brain, ChevronRight, Home, Play, Trophy, User} from 'lucide-react';

const Quizterios = () => {
    const [gameState, setGameState] = useState('start'); // start, playing, gameOver, leaderboard
    const [playerName, setPlayerName] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [score, setScore] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(false);

    const themeArray = ['História', 'Cinema', 'Esportes', 'Geografia', 'Cultura Pop', 'Ciência'];

    const themes = [
        {id: 'historia', name: 'História', icon: '📚', color: 'bg-amber-500'},
        {id: 'cinema', name: 'Cinema', icon: '🎬', color: 'bg-purple-500'},
        {id: 'esportes', name: 'Esportes', icon: '⚽', color: 'bg-green-500'},
        {id: 'geografia', name: 'Geografia', icon: '🌍', color: 'bg-blue-500'},
        {id: 'cultura-pop', name: 'Cultura Pop', icon: '🎵', color: 'bg-pink-500'},
        {id: 'ciencia', name: 'Ciência', icon: '🔬', color: 'bg-indigo-500'}
    ];

    useEffect(() => {
        const savedLeaderboard = localStorage.getItem('quizterios-leaderboard');
        if (savedLeaderboard) {
            try {
                setLeaderboard(JSON.parse(savedLeaderboard));
            } catch (error) {
                console.error('Error loading leaderboard from localStorage:', error);
            }
        }
    }, []);

    const saveLeaderboard = (newLeaderboard) => {
        try {
            localStorage.setItem('quizterios-leaderboard', JSON.stringify(newLeaderboard));
            setLeaderboard(newLeaderboard);
        } catch (error) {
            console.error('Error saving leaderboard to localStorage:', error);
        }
    };

    const generateQuestion = async () => {
        setLoading(true);
        const model = "gemini-2.5-flash";
        const randomTheme = themeArray[Math.floor(Math.random() * themeArray.length)];

        const prompt = `
            Gere uma pergunta faceis e medias de múltipla escolha sobre os seguintes temas:
            Temas: ${randomTheme}

            Formato da resposta:
            Responda estritamente em JSON válido (não envie explicações fora do JSON, nem texto adicional antes ou depois).

            {
              "tema": "${randomTheme}",
              "pergunta": "Texto da pergunta aqui",
              "alternativas": {
                "a": "Texto da alternativa A",
                "b": "Texto da alternativa B",
                "c": "Texto da alternativa C",
                "d": "Texto da alternativa D"
              },
              "resposta_correta": "Letra da resposta correta (exemplo: 'a', 'b', 'c' ou 'd')",
              "explicacao": "Uma breve explicação (máximo 2 frases) dizendo por que essa resposta está correta."
            }
            `;

        try {

            const ai = new GoogleGenAI({apiKey: import.meta.env.VITE_GEMINI_API_KEY});
            const response = await ai.models.generateContent({
                model: model,
                contents: prompt,
            });

            const textResponse = response.text;
            const jsonStartIndex = textResponse.indexOf('{');
            const cleanJsonString = textResponse.substring(jsonStartIndex, textResponse.lastIndexOf('}') + 1).trim();
            const questionData = JSON.parse(cleanJsonString);

            setCurrentQuestion(questionData);
        } catch (error) {
            console.error("Erro ao gerar pergunta com a API Gemini:", error);
        } finally {
            setLoading(false);
        }
    };

    const startGame = async () => {
        if (!playerName.trim()) return;

        setGameState('playing');
        setScore(0);
        setQuestionCount(0);
        setSelectedAnswer(null);
        setShowResult(false);

        await generateQuestion();
    };

    const handleAnswerSelect = (answerLetter) => {
        if (showResult) return;
        setSelectedAnswer(answerLetter);
    };

    const confirmAnswer = () => {
        if (selectedAnswer === null) return;

        const isCorrect = selectedAnswer === currentQuestion.resposta_correta;
        setShowResult(true);

        if (isCorrect) {
            setScore(score + 1);
            setQuestionCount(questionCount + 1);
        } else {
            endGame();
        }
    };

    const nextQuestion = async () => {
        setSelectedAnswer(null);
        setShowResult(false);
        await generateQuestion();
    };

    const endGame = () => {
        const finalScore = selectedAnswer === currentQuestion.resposta_correta ? score + 1 : score;

        const newEntry = {
            name: playerName,
            score: finalScore,
            date: new Date().toLocaleDateString('pt-BR'),
            timestamp: Date.now()
        };

        const updatedLeaderboard = [...leaderboard, newEntry]
            .sort((a, b) => {
                if (b.score !== a.score) {
                    return b.score - a.score;
                }
                return b.timestamp - a.timestamp;
            })
            .slice(0, 10);

        saveLeaderboard(updatedLeaderboard);
        setGameState('gameOver');
    };

    const resetGame = () => {
        setGameState('start');
        setPlayerName('');
        setCurrentQuestion(null);
        setScore(0);
        setQuestionCount(0);
        setSelectedAnswer(null);
        setShowResult(false);
    };

    // const clearLeaderboard = () => {
    //     if (window.confirm('Tem certeza que deseja limpar todo o ranking?')) {
    //         try {
    //             localStorage.removeItem('quizterios-leaderboard');
    //             setLeaderboard([]);
    //         } catch (error) {
    //             console.error('Error clearing leaderboard:', error);
    //         }
    //     }
    // };

    const getAnswerClass = (letter) => {
        if (!showResult) {
            return selectedAnswer === letter
                ? 'bg-blue-100 border-blue-400 text-blue-800'
                : 'bg-white border-gray-200 hover:bg-gray-50';
        }

        if (letter === currentQuestion.resposta_correta) {
            return 'bg-green-100 border-green-400 text-green-800';
        }

        if (selectedAnswer === letter && letter !== currentQuestion.resposta_correta) {
            return 'bg-red-100 border-red-400 text-red-800';
        }

        return 'bg-gray-100 border-gray-200 text-gray-600';
    };

    const getThemeIcon = (themeName) => {
        const theme = themes.find(t => t.name === themeName);
        return theme ? theme.icon : '🧠';
    };

    if (gameState === 'start') {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4">🧠</div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">Quizterios</h1>
                        <p className="text-gray-600">Perguntas únicas criadas por IA</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <User className="inline w-4 h-4 mr-1"/>
                                Seu nome
                            </label>
                            <input
                                type="text"
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Digite seu nome"
                            />
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Brain className="w-5 h-5 text-blue-600"/>
                                <span className="font-medium text-gray-700">Temas do Quiz</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {themes.map((theme) => (
                                    <div key={theme.id} className="text-center">
                                        <div className="text-xl">{theme.icon}</div>
                                        <div className="text-xs text-gray-600">{theme.name}</div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                Perguntas aleatórias de todos os temas
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={startGame}
                                disabled={!playerName.trim()}
                                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                            >
                                <Play className="w-5 h-5"/>
                                Começar
                            </button>

                            <button
                                onClick={() => setGameState('leaderboard')}
                                className="bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-200 transition-all"
                            >
                                <Trophy className="w-5 h-5"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (gameState === 'playing') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-t-3xl p-6 shadow-lg">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="text-3xl">
                                    {currentQuestion ? getThemeIcon(currentQuestion.tema) : '🧠'}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">{playerName}</h2>
                                    <p className="text-gray-600">
                                        {currentQuestion ? currentQuestion.tema : 'Carregando...'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{score}</div>
                                    <div className="text-sm text-gray-600">Pontos</div>
                                </div>
                                <button
                                    onClick={endGame}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                                >
                                    Finalizar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Pergunta */}
                    <div className="bg-white rounded-b-3xl p-8 shadow-lg">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin text-4xl mb-4">🧠</div>
                                <p className="text-gray-600">Gerando pergunta única...</p>
                            </div>
                        ) : currentQuestion ? (
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                                    {currentQuestion.pergunta}
                                </h3>

                                <div className="grid gap-4">
                                    {Object.entries(currentQuestion.alternativas).map(([letter, text]) => (
                                        <button
                                            key={letter}
                                            onClick={() => handleAnswerSelect(letter)}
                                            disabled={showResult}
                                            className={`p-4 border-2 rounded-lg text-left transition-all ${getAnswerClass(letter)}`}
                                        >
                                            <span className="font-medium mr-3">
                                                {letter.toUpperCase()})
                                            </span>
                                            {text}
                                        </button>
                                    ))}
                                </div>

                                {showResult && (
                                    <div className="bg-gray-50 rounded-lg p-6 mt-6">
                                        <div className={`text-lg font-bold mb-3 ${
                                            selectedAnswer === currentQuestion.resposta_correta
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        }`}>
                                            {selectedAnswer === currentQuestion.resposta_correta ? '✅ Correto!' : '❌ Incorreto!'}
                                        </div>
                                        <p className="text-gray-700 mb-4">
                                            <strong>Explicação:</strong> {currentQuestion.explicacao}
                                        </p>

                                        {selectedAnswer === currentQuestion.resposta_correta ? (
                                            <button
                                                onClick={nextQuestion}
                                                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all flex items-center gap-2"
                                            >
                                                Próxima pergunta
                                                <ChevronRight className="w-5 h-5"/>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={endGame}
                                                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all"
                                            >
                                                Ver resultado final
                                            </button>
                                        )}
                                    </div>
                                )}

                                {!showResult && selectedAnswer !== null && (
                                    <button
                                        onClick={confirmAnswer}
                                        className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-all font-medium"
                                    >
                                        Confirmar resposta
                                    </button>
                                )}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        );
    }

    if (gameState === 'gameOver') {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Parabéns!</h2>
                    <p className="text-gray-600 mb-6">Você finalizou o Quizterios</p>

                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-6 mb-6">
                        <div className="text-4xl font-bold mb-2">{score}</div>
                        <div className="text-lg">
                            {score === 1 ? 'Ponto' : 'Pontos'}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={resetGame}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                        >
                            Jogar novamente
                        </button>

                        <button
                            onClick={() => setGameState('leaderboard')}
                            className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                        >
                            <Trophy className="w-5 h-5"/>
                            Ver ranking
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (gameState === 'leaderboard') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-4">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-2xl p-8">
                        <div className="text-center mb-8">
                            <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4"/>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Ranking</h2>
                            <p className="text-gray-600">Os melhores jogadores</p>
                        </div>

                        {leaderboard.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">Nenhuma partida jogada ainda</p>
                                <button
                                    onClick={resetGame}
                                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all"
                                >
                                    Começar primeira partida
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {leaderboard.map((entry, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center justify-between p-4 rounded-lg ${
                                            index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white' :
                                                index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white' :
                                                    index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white' :
                                                        'bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="text-2xl font-bold">
                                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}º`}
                                            </div>
                                            <div>
                                                <div className="font-bold">{entry.name}</div>
                                                <div
                                                    className={`text-sm ${index < 3 ? 'text-white opacity-90' : 'text-gray-600'}`}>
                                                    {entry.date}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-2xl font-bold">
                                            {entry.score}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-8 flex justify-center gap-3">
                            <button
                                onClick={resetGame}
                                className="bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2"
                            >
                                <Home className="w-5 h-5"/>
                                Voltar ao início
                            </button>

                            {/*{leaderboard.length > 0 && (*/}
                            {/*    <button*/}
                            {/*        onClick={clearLeaderboard}*/}
                            {/*        className="bg-red-100 text-red-700 font-medium py-3 px-6 rounded-lg hover:bg-red-200 transition-all"*/}
                            {/*    >*/}
                            {/*        Limpar ranking*/}
                            {/*    </button>*/}
                            {/*)}*/}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default Quizterios;
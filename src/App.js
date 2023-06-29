import './App.css';
import { wordsList } from './data/words';

import { useCallback, useEffect, useState } from 'react';

import StartScreen from './components/startScreen';
import Game from './components/gameScreen';
import GameOver from './components/gameOverScreen';

function App() {

  const stages = [
    { id: 1, name: "start" },
    { id: 2, name: "game" },
    { id: 3, name: "end" },
  ];

  
  const [words] = useState(wordsList);
  const [gameStages, setGameStage] = useState(stages[0].name);
  const [pickedWord, SetPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letter, setLetter] = useState([]);

  const pickWordAndCategory = () => {
    // Pega uma categoria aleatória
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // Pega uma letra aleatória
    const word = words[category][Math.floor(Math.random() * words[category].length)];

    return{ word, category };
  };

  // Inicia o jogo
  const startGame = () => {
    // Pega a palavra e pega a categoria
    const { word, category } = pickWordAndCategory()

    setGameStage(stages[1].name);
  }

  // Faz a verificação da entrada de letras
  const verifyLetter = () => {
    setGameStage(stages[2].name);
  }

  // Reinicia o jogo
  const retry = () => {
    setGameStage(stages[0].name);
  }

  return (
    <div className="App">
    {gameStages === "start" && <StartScreen startGame={startGame} />}
    {gameStages === "game" && <Game verifyLetter={verifyLetter} />}
    {gameStages === "end" && <GameOver retry={retry} />}
    </div>
  );
}

export default App;

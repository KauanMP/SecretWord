import "./App.css";
import { wordsList } from "./data/words";

import { useCallback, useEffect, useState } from "react";

import StartScreen from "./components/startScreen";
import Game from "./components/gameScreen";
import GameOver from "./components/gameOverScreen";

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
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(3);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    // Pega uma categoria aleatória
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // Pega uma letra aleatória
    const word = words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category };
  }, [words]);

  // Inicia o jogo
  const startGame = useCallback(() => {
    // Limpa as letras
    clearLetterStates();

    // Pega a palavra e pega a categoria
    const { word, category } = pickWordAndCategory();

    // Cria um array pra pegar as letras
    let wordLetters = word.split("");

    wordLetters = wordLetters.map((l) => l.toLowerCase());

    console.log(word, category);
    console.log(wordLetters);

    // Define o estado
    SetPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  // Faz a verificação da entrada de letras
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    // checa se a letra foi utilizada
    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return;
    }

    //
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ]);
      setGuesses((actualGuesses) => actualGuesses - 1)
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }
  
  useEffect(() => {
    if (guesses <= 0) {
      // Zera o jogo
      clearLetterStates();
      setGameStage(stages[2].name);
    }
  }, [guesses]);

  // Checa a condição de vitoria
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    // Condição de vitoria
    if (guessedLetters.length === uniqueLetters.length) {
      // Adiciona pontos no placar
      setScore((actualScore) => (actualScore += 100));
  
      // Reinicia o jogo com outra palavra
      startGame();
    }
  }, [guessedLetters, letters, startGame]);

  // Reinicia o jogo
  const retry = () => {
    setScore(0)
    setGuesses(3);
    setGameStage(stages[0].name);
  };

  return (
    <div className="App">
      {gameStages === "start" && <StartScreen startGame={startGame} />}
      {gameStages === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStages === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;

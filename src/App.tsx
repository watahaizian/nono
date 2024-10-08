import React, { useState } from 'react';
import TitleScreen from './components/TitleScreen';
import GameScreen from './components/GameScreen';
import { fetchPuzzles } from './lib/api';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState('title');
  const [puzzleId, setPuzzleId] = useState(0);

  const startGame = async () => {
    try {
      const puzzles = await fetchPuzzles();
      const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
      setPuzzleId(randomPuzzle.id);
      setCurrentScreen('game');
    } catch (error) {
      console.error(error);
      alert('Failed to start the game');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'title':
        return <TitleScreen onStart={startGame} />;
      case 'game':
        return <GameScreen puzzleId={puzzleId} />;
    }
  };

  return <div>{renderScreen()}</div>;
};

export default App;

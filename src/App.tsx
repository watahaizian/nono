import React, { useState } from 'react';
import TitleScreen from './components/TitleScreen';
import GameScreen from './components/GameScreen';
import EditScreen from './components/EditScreen';
import { fetchPuzzles } from './lib/api';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState('title');
  const [puzzleId, setPuzzleId] = useState(0);
  const [puzzleSize, setPuzzleSize] = useState(0);

  const startGame = async () => {
    try {
      const puzzles = await fetchPuzzles();
      const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
      setPuzzleId(randomPuzzle.id);
      setPuzzleSize(randomPuzzle.size);
      setCurrentScreen('game');
    } catch (error) {
      console.error(error);
      alert('Failed to start the game');
    }
  };

  const startEdit = () => {
    setCurrentScreen('edit');
  };

  // タイトルに戻る
  const backToTitle = () => {
    setCurrentScreen('title');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'title':
        return <TitleScreen onStart={startGame} onEdit={startEdit} />;
      case 'game':
        return <GameScreen puzzleId={puzzleId} puzzleSize={puzzleSize} onBack={backToTitle} />;
      case 'edit':
        return <EditScreen onBack={backToTitle} />;
    }
  };

  return <div>{renderScreen()}</div>;
};

export default App;

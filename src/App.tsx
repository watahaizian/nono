import React, { useState } from 'react';
import { puzzles, Puzzle } from './lib/puzzles';
import PuzzleGrid from './components/PuzzleGird';

const App: React.FC = () => {
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle>(puzzles[0]);

  const handlePuzzleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPuzzle = puzzles.find((puzzle) => puzzle.id === event.target.value);
    if (selectedPuzzle) {
      setCurrentPuzzle(selectedPuzzle);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">ノノグラム</h1>
      <select className="border p-2 mb-4" onChange={handlePuzzleChange} defaultValue="">
        <option value="" disabled>
          パズルを選択してください
        </option>
        {puzzles.map((puzzle) => (
          <option key={puzzle.id} value={puzzle.id}>
            {puzzle.name}
          </option>
        ))}
      </select>
      {currentPuzzle && (
        <div>
          <h2 className="text-xl font-semibold mb-2">{currentPuzzle.name}</h2>
          <PuzzleGrid key={currentPuzzle.id} puzzle={currentPuzzle} />
        </div>
      )}
    </div>
  );
};

export default App;

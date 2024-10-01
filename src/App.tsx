import React, { useState } from 'react';
import { puzzles, Puzzle } from './lib/puzzles';
import PuzzleGrid from './components/PuzzleGird';

const App: React.FC = () => {
  const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle | null>(null);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const puzzle = puzzles.find((p) => p.id === event.target.value) || null;
    setSelectedPuzzle(puzzle);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">ノノグラム</h1>
      <select
        className="border p-2 mb-4"
        onChange={handleSelectChange}
        defaultValue=""
      >
        <option value="" disabled>
          パズルを選択してください
        </option>
        {puzzles.map((puzzle) => (
          <option key={puzzle.id} value={puzzle.id}>
            {puzzle.name}
          </option>
        ))}
      </select>
      {selectedPuzzle && (
        <div>
          <h2 className="text-xl font-semibold mb-2">{selectedPuzzle.name}</h2>
          <PuzzleGrid puzzle={selectedPuzzle} />
        </div>
      )}
    </div>
  );
};

export default App;

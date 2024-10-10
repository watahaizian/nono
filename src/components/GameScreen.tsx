import { useState, useEffect } from 'react';
import { fetchCells } from '../lib/api';

interface GameScreenProps {
  puzzleId: number;
  puzzleSize: number;
}

interface cellData {
  id: number;
  puzzle_id: number;
  row: number;
  col: number;
  value: number;
  color: string;
}

const getCellStyle = (row: number, col: number, cell?: cellData) => ({
  backgroundColor: cell?.color || 'white',
  borderTop: row === 0 ? '1px solid gray' : 'none',
  borderLeft: col === 0 ? '1px solid gray' : 'none',
  borderRight: '1px solid gray',
  borderBottom: '1px solid gray',
});

const GameScreen: React.FC<GameScreenProps> = ({ puzzleId, puzzleSize }) => {
  const [cells, setCells] = useState<cellData[]>([]);

  useEffect(() => {
    const fetchCellsData = async () => {
      try {
        const data: cellData[] = await fetchCells(puzzleId);
        setCells(data);
      } catch (error) {
        console.error(error);
        alert('Failed to fetch cells');
      }
    };
    fetchCellsData();
  }, [puzzleId]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-3xl font-bold mb-4">
        ゲームが始まりました！ パズルID: {puzzleId}, サイズ: {puzzleSize}
      </h2>
      <div
        className="grid gap-0"
        style={{
          gridTemplateColumns: `repeat(${puzzleSize}, 1fr)`,
          gridTemplateRows: `repeat(${puzzleSize}, 1fr)`,
        }}
      >
        {Array.from({ length: puzzleSize * puzzleSize }).map((_, index) => {
          const row = Math.floor(index / puzzleSize);
          const col = index % puzzleSize;
          const cell = cells.find((c) => c.row === row && c.col === col);
          return (
            <div
              key={index}
              className="w-8 h-8 flex items-center justify-center"
              style={getCellStyle(row, col, cell)}
            >
              {cell?.value ?? ''}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameScreen;

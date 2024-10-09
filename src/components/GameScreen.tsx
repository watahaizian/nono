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
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <h2 className="text-3xl font-bold">
        ゲームが始まりました！ パズルID: {puzzleId}, サイズ: {puzzleSize}
      </h2>
      <div className="grid">
        {
          // puzzleSize * puzzleSize のセルを表示する
          cells.map((cell) => {
            return (
              <div
                key={cell.id}
                className="w-8 h-8 border border-gray-300"
                style={{ backgroundColor: cell.color }}
              />
            );
          })
        }
      </div>
    </div>
  );
};

export default GameScreen;

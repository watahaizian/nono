import { cellData } from './interface';

export const fetchPuzzles = async () => {
  const response = await fetch(
    'https://nono-api.watahaizian.workers.dev/puzzles'
  );
  if (!response.ok) {
    throw new Error('Failed to fetch puzzles');
  }
  const data = await response.json();
  return data;
};

export const fetchCells = async (puzzleId: number): Promise<cellData[]> => {
  const response = await fetch(
    `https://nono-api.watahaizian.workers.dev/cells/${puzzleId}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch cells');
  }
  const data: cellData[] = await response.json();
  // console.log(data);
  return data;
};

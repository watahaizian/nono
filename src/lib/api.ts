export const fetchPuzzles = async () => {
  const response = await fetch('https://nono-api.watahaizian.workers.dev/puzzles');
  if (!response.ok) {
    throw new Error('Failed to fetch puzzles');
  }
  const data = await response.json();
  console.log(data);
  return data;
}
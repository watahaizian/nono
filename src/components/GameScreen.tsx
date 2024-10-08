interface GameScreenProps {
  puzzleId: number;
}

const GameScreen: React.FC<GameScreenProps> = ({ puzzleId }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <h2 className="text-3xl font-bold">ゲームが始まりました！ パズルID: {puzzleId}</h2>
    </div>
  );
};

export default GameScreen;

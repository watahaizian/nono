import { useState, useEffect } from 'react';
import { fetchCells } from '../lib/api';
import { calculateHints, getCellStyle } from '../lib/utils';
import { cellData, GameScreenProps, hints } from '../lib/interface';

const GameScreen: React.FC<GameScreenProps> = ({
  puzzleId,
  puzzleSize,
  onBack,
}) => {
  const [cells, setCells] = useState<cellData[]>([]);
  const [hints, setHints] = useState<hints | null>(null);
  const [currentCell, setCurrentCell] = useState<(string | null)[][]>(
    Array.from({ length: puzzleSize }, () =>
      Array<string | null>(puzzleSize).fill(null)
    )
  );
  const [playState, setPlayState] = useState<
    'playing' | 'correct' | 'gameover'
  >('playing');
  const [life, setLife] = useState<number>(3);
  const [playType, setPlayType] = useState<'paint' | 'erase'>('paint');
  const [error, setError] = useState<string | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const fetchCellsData = async () => {
      try {
        const data: cellData[] = await fetchCells(puzzleId);
        setCells(data);
        setHints(calculateHints(data, puzzleSize));
      } catch (error) {
        console.error(error);
        setError('セルの取得に失敗しました');
      }
    };
    fetchCellsData();
  }, [puzzleId, puzzleSize]);

  useEffect(() => {
    if (cells.length === 0) return;
    const answer = cells.every((cell) => {
      const row = cell.row_index;
      const col = cell.col_index;
      if (cell.value === 1) {
        return currentCell[row][col] === cell.color;
      } else {
        return (
          currentCell[row][col] === null || currentCell[row][col] === 'wrong'
        );
      }
    });
    setPlayState(answer ? 'correct' : 'playing');
  }, [currentCell, cells]);

  useEffect(() => {
    if (life === 0) {
      setPlayState('gameover');
    }
  }, [life]);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsMouseDown(false);
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (!hints) {
    return <div>Loading...</div>;
  }

  const cellLeftClick = (row: number, col: number) => {
    if (playState !== 'playing') return;
    const cell = cells.find((c) => c.row_index === row && c.col_index === col);
    if (!cell) {
      console.error('Cell not found');
      return;
    }
    if (currentCell[row][col] !== null) return;
    if (playType === 'paint') {
      if (cell.value === 1) {
        setCurrentCell((prev) => {
          const newCell = prev.map((rowArr) => [...rowArr]); // 深いコピー
          const cellData = cells.find(
            (c) => c.row_index === row && c.col_index === col
          );
          if (cellData) {
            newCell[row][col] = cellData.color;
          }
          return newCell;
        });
      } else {
        setCurrentCell((prev) => {
          const newCell = prev.map((rowArr) => [...rowArr]); // 深いコピー
          newCell[row][col] = 'wrong';
          return newCell;
        });
        setLife((prev) => prev - 1);
      }
    } else if (playType === 'erase') {
      if (cell.value === 0) {
        setCurrentCell((prev) => {
          const newCell = prev.map((rowArr) => [...rowArr]); // 深いコピー
          newCell[row][col] = 'wrong';
          return newCell;
        });
      } else {
        setCurrentCell((prev) => {
          const newCell = prev.map((rowArr) => [...rowArr]); // 深いコピー
          const cellData = cells.find(
            (c) => c.row_index === row && c.col_index === col
          );
          if (cellData) {
            newCell[row][col] = cellData.color;
          }
          return newCell;
        });
        setLife((prev) => prev - 1);
      }
    }
  };

  const resetGame = () => {
    setCurrentCell(
      Array.from({ length: puzzleSize }, () => Array(puzzleSize).fill(null))
    );
    setLife(3);
    setPlayState('playing');
  };

  // ヒントの最大数を取得
  const maxRowHints = Math.max(...hints.rowHints.map((h) => h.length));
  const maxColHints = Math.max(...hints.colHints.map((h) => h.length));

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 overflow-auto">
      {error && <div className="text-red-500">{error}</div>}
      <h2 className="text-3xl font-bold mb-4">
        ゲームが始まりました！ パズルID: {puzzleId}, サイズ: {puzzleSize}
      </h2>
      <div className="text-xl mb-4">残機: {life}</div>
      <div
        className="grid gap-0"
        style={{
          gridTemplateColumns: `repeat(${maxRowHints + puzzleSize}, 1fr)`,
          gridTemplateRows: `repeat(${maxColHints + puzzleSize}, 1fr)`,
          height: 'min(70vh, 100vw)',
          width: 'min(70vh, 100vw)',
        }}
      >
        {/* グリッドを構築 */}
        {Array.from({ length: maxColHints + puzzleSize }).map((_, gridRow) =>
          Array.from({ length: maxRowHints + puzzleSize }).map((_, gridCol) => {
            const key = `${gridRow}-${gridCol}`;

            // 左上の空白セル
            if (gridRow < maxColHints && gridCol < maxRowHints) {
              return <div key={key}></div>;
            }

            // 列ヒント（上部）
            if (gridRow < maxColHints && gridCol >= maxRowHints) {
              const colIndex = gridCol - maxRowHints;
              const hintIndex =
                hints.colHints[colIndex].length - (maxColHints - gridRow);
              const hint = hints.colHints[colIndex][hintIndex] || '';
              return (
                <div
                  key={key}
                  className="flex items-center justify-center text-sm"
                >
                  {hint}
                </div>
              );
            }

            // 行ヒント（左側）
            if (gridRow >= maxColHints && gridCol < maxRowHints) {
              const rowIndex = gridRow - maxColHints;
              const hintIndex =
                hints.rowHints[rowIndex].length - (maxRowHints - gridCol);
              const hint = hints.rowHints[rowIndex][hintIndex] || '';
              return (
                <div
                  key={key}
                  className="flex items-center justify-center text-sm"
                >
                  {hint}
                </div>
              );
            }

            // パズルのセル
            if (gridRow >= maxColHints && gridCol >= maxRowHints) {
              const rowIndex = gridRow - maxColHints;
              const colIndex = gridCol - maxRowHints;
              return (
                <div
                  key={key}
                  className="flex items-center justify-center cursor-pointer border border-gray-300"
                  style={{
                    ...getCellStyle(rowIndex, colIndex),
                    backgroundColor:
                      currentCell[rowIndex][colIndex] === null
                        ? 'white'
                        : currentCell[rowIndex][colIndex],
                    minWidth: '20px',
                    minHeight: '20px',
                  }}
                  onClick={() => cellLeftClick(rowIndex, colIndex)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setIsMouseDown(true);
                    cellLeftClick(rowIndex, colIndex);
                  }}
                  onMouseEnter={() => {
                    if (isMouseDown) {
                      cellLeftClick(rowIndex, colIndex);
                    }
                  }}
                  onMouseUp={() => setIsMouseDown(false)}
                >
                  {currentCell[rowIndex][colIndex] === 'wrong' ? 'x' : ''}
                </div>
              );
            }

            // その他の場合（念のため）
            return (
              <div
                key={key}
                className="flex items-center justify-center border border-gray-200"
              ></div>
            );
          })
        )}
      </div>
      {/* ボタンの配置 */}
      <div className="flex space-x-4 mt-4">
        <button
          className={`flex items-center justify-center bg-white text-black font-semibold w-12 h-12 rounded-lg shadow-lg transition duration-300 ${
            playType === 'paint'
              ? 'border-4 border-blue-500'
              : 'border border-gray-300'
          }`}
          onClick={() => setPlayType('paint')}
        >
          🖌️
        </button>
        <button
          className={`flex items-center justify-center bg-white text-black font-semibold w-12 h-12 rounded-lg shadow-lg transition duration-300 ${
            playType === 'erase'
              ? 'border-4 border-blue-500'
              : 'border border-gray-300'
          }`}
          onClick={() => setPlayType('erase')}
        >
          ✖️
        </button>
      </div>
      {playState === 'correct' && (
        <div className="text-2xl mt-4 text-green-500">ゲームクリア！</div>
      )}
      {playState === 'gameover' && (
        <div className="text-2xl mt-4 text-red-500">ゲームオーバー！</div>
      )}
      <button
        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 mt-4"
        onClick={resetGame}
      >
        ゲームリセット
      </button>
      <button
        onClick={onBack}
        className="absolute bottom-4 left-4 px-3 py-1 border border-gray-300 rounded-md bg-gray-200 hover:bg-gray-300"
      >
        戻る
      </button>
    </div>
  );
};

export default GameScreen;

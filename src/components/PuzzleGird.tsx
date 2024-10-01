import React, { useState, useEffect } from 'react';
import { Puzzle } from '../lib/puzzles';
import { calculateHints } from '../lib/utils';

interface PuzzleGridProps {
  puzzle: Puzzle;
}

const PuzzleGrid: React.FC<PuzzleGridProps> = ({ puzzle }) => {
  const { rows, columns } = calculateHints(puzzle.data);
  const [gridState, setGridState] = useState<number[][]>(
    Array.from({ length: puzzle.size }, () => Array(puzzle.size).fill(0))
  );

  const [isSolved, setIsSolved] = useState(false);

  // ライフとゲームオーバー状態
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);

  // ドラッグ操作用の状態変数
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState<{
    rowIndex: number;
    colIndex: number;
  } | null>(null);
  const [dragPreview, setDragPreview] = useState<
    Array<{ rowIndex: number; colIndex: number }>
  >([]);
  const [selectedCellCount, setSelectedCellCount] = useState(0);
  const [mistakeMade, setMistakeMade] = useState(false);

  // 操作モードの状態
  const [currentMode, setCurrentMode] = useState<'fill' | 'mark'>('fill');

  const handleCellRightClick = (
    event: React.MouseEvent<HTMLDivElement>,
    rowIndex: number,
    colIndex: number
  ) => {
    event.preventDefault();
    if (isGameOver) return;

    const cellValue = gridState[rowIndex][colIndex];
    if (cellValue !== 0) return; // 既に塗られているか×印が付いている場合は何もしない

    // ライフを減らす
    setLives((prevLives) => prevLives - 1);
  };

  const handleMarkModeClick = (rowIndex: number, colIndex: number) => {
    if (isGameOver) return;

    const cellValue = gridState[rowIndex][colIndex];
    if (cellValue !== 0) return;

    const correctValue = puzzle.data[rowIndex][colIndex];

    if (correctValue === 0) {
      // 正解が空白マスの場合
      setGridState((prevState) => {
        const newState = prevState.map((row) => row.slice());
        newState[rowIndex][colIndex] = 2; // ×印を付ける
        return newState;
      });
    } else {
      // 正解が塗りつぶしマスの場合
      setGridState((prevState) => {
        const newState = prevState.map((row) => row.slice());
        newState[rowIndex][colIndex] = 1; // 正しい状態に修正（1）
        return newState;
      });
      setLives((prevLives) => prevLives - 1);
      setMistakeMade(true);
    }
  };

  // マウスダウン時の処理
  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement>,
    rowIndex: number,
    colIndex: number
  ) => {
    event.preventDefault();
    if (isGameOver) return;

    const cellValue = gridState[rowIndex][colIndex];
    if (cellValue !== 0) return;

    if (event.button === 0) {
      // 左クリック
      if (currentMode === 'fill') {
        // 塗りつぶしモード
        const correctValue = puzzle.data[rowIndex][colIndex];
        if (correctValue === 1) {
          // 正解の場合
          setGridState((prevState) => {
            const newState = prevState.map((row) => row.slice());
            newState[rowIndex][colIndex] = 1;
            return newState;
          });
          setIsDragging(true);
          setDragStartPos({ rowIndex, colIndex });
          setDragPreview([{ rowIndex, colIndex }]);
          setSelectedCellCount(1);
        } else {
          // 不正解の場合
          setGridState((prevState) => {
            const newState = prevState.map((row) => row.slice());
            newState[rowIndex][colIndex] = 2; // ×印を付ける
            return newState;
          });
          setLives((prevLives) => prevLives - 1);
          setMistakeMade(true);
        }
      } else if (currentMode === 'mark') {
        // ×印モード
        handleMarkModeClick(rowIndex, colIndex);
      }
    } else if (event.button === 2) {
      // 右クリック
      handleCellRightClick(event, rowIndex, colIndex);
    }
  };

  // マウス移動時の処理
  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement>,
    rowIndex: number,
    colIndex: number
  ) => {
    if (isDragging && dragStartPos) {
      event.preventDefault();

      let newPreview = [];
      if (rowIndex === dragStartPos.rowIndex) {
        const startCol = Math.min(dragStartPos.colIndex, colIndex);
        const endCol = Math.max(dragStartPos.colIndex, colIndex);
        for (let c = startCol; c <= endCol; c++) {
          newPreview.push({ rowIndex, colIndex: c });
        }
      } else if (colIndex === dragStartPos.colIndex) {
        const startRow = Math.min(dragStartPos.rowIndex, rowIndex);
        const endRow = Math.max(dragStartPos.rowIndex, rowIndex);
        for (let r = startRow; r <= endRow; r++) {
          newPreview.push({ rowIndex: r, colIndex });
        }
      } else {
        newPreview = [
          { rowIndex: dragStartPos.rowIndex, colIndex: dragStartPos.colIndex },
        ];
      }
      setDragPreview(newPreview);
      setSelectedCellCount(newPreview.length);
    }
  };

  // マウスアップ時の処理
  const handleMouseUp = () => {
    if (isDragging && dragPreview.length > 0 && !mistakeMade) {
      setGridState((prevState) => {
        const newState = prevState.map((row) => row.slice());
        let livesLost = 0;

        dragPreview.forEach((pos) => {
          const { rowIndex, colIndex } = pos;
          const cellValue = prevState[rowIndex][colIndex];
          if (cellValue !== 0) return;

          const correctValue = puzzle.data[rowIndex][colIndex];

          if (correctValue === 1) {
            // 正解の場合
            newState[rowIndex][colIndex] = 1;
          } else {
            // 不正解の場合
            newState[rowIndex][colIndex] = 2; // ×印を付ける
            livesLost += 1;
          }
        });

        if (livesLost > 0) {
          setLives((prevLives) => prevLives - livesLost);
        }

        return newState;
      });
    }
    setIsDragging(false);
    setDragStartPos(null);
    setDragPreview([]);
    setSelectedCellCount(0);
    setMistakeMade(false);
  };

  // ドキュメント全体でマウスアップイベントを監視
  useEffect(() => {
    const handleDocumentMouseUp = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };

    document.addEventListener('mouseup', handleDocumentMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleDocumentMouseUp);
    };
  }, [isDragging]);

  // ライフが0になったらゲームオーバー
  useEffect(() => {
    if (lives <= 0) {
      setIsGameOver(true);
    }
  }, [lives]);

  // 正解判定
  useEffect(() => {
    const checkSolved = () => {
      for (let i = 0; i < puzzle.size; i++) {
        for (let j = 0; j < puzzle.size; j++) {
          const userCell = gridState[i][j] === 1 ? 1 : 0;
          if (userCell !== puzzle.data[i][j]) {
            return false;
          }
        }
      }
      return true;
    };

    if (checkSolved()) {
      setIsSolved(true);
    } else {
      setIsSolved(false);
    }
  }, [gridState, puzzle]);

  const handleReset = () => {
    setGridState(
      Array.from({ length: puzzle.size }, () => Array(puzzle.size).fill(0))
    );
    setIsSolved(false);
    setLives(3);
    setIsGameOver(false);
  };

  useEffect(() => {
    setGridState(
      Array.from({ length: puzzle.size }, () => Array(puzzle.size).fill(0))
    );
    setIsSolved(false);
    setLives(3);
    setIsGameOver(false);
  }, [puzzle]);

  const maxHintHeight = Math.max(...columns.map((hints) => hints.length));
  const maxHintWidth = Math.max(...rows.map((hints) => hints.length));

  // プレビュー中の最後のセルを取得
  const lastPreviewCell =
    dragPreview.length > 0 ? dragPreview[dragPreview.length - 1] : null;

  return (
    <div className="flex flex-col items-center">
      {/* ライフの表示 */}
      <div className="flex items-center mb-2">
        <span className="text-lg mr-2">ライフ:</span>
        {[...Array(3)].map((_, idx) => (
          <span
            key={idx}
            className={`w-6 h-6 mx-1 ${
              idx < lives ? 'bg-red-500' : 'bg-gray-300'
            } rounded-full inline-block`}
          ></span>
        ))}
      </div>

      {/* ヒントとグリッドを含む全体のコンテナ */}
      <div className="flex">
        {/* 左上の空白スペース */}
        <div className="flex flex-col gap-0">
          <div className="flex gap-0">
            {Array.from({ length: maxHintWidth }).map((_, idx) => (
              <div key={idx} className="w-8 h-8"></div>
            ))}
          </div>
        </div>

        {/* 列のヒント */}
        <div className="flex gap-0">
          {columns.map((hints, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-0">
              {Array.from({ length: maxHintHeight }).map((_, idx) => {
                const hint = hints[hints.length - maxHintHeight + idx] || '';
                return (
                  <div
                    key={idx}
                    className="w-8 h-8 inline-flex items-center justify-center p-0 m-0"
                  >
                    <span className="text-xs leading-none">{hint}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex">
        {/* 行のヒント */}
        <div className="flex flex-col gap-0">
          {rows.map((hints, rowIndex) => (
            <div key={rowIndex} className="flex gap-0">
              {Array.from({ length: maxHintWidth }).map((_, idx) => {
                const hint = hints[hints.length - maxHintWidth + idx] || '';
                return (
                  <div
                    key={idx}
                    className="w-8 h-8 inline-flex items-center justify-center p-0 m-0"
                  >
                    <span className="text-xs leading-none">{hint}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* グリッド */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${puzzle.size}, 2rem)`,
            gridTemplateRows: `repeat(${puzzle.size}, 2rem)`,
          }}
        >
          {gridState.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isPreviewCell = dragPreview.some(
                (pos) => pos.rowIndex === rowIndex && pos.colIndex === colIndex
              );
              const isLastPreviewCell =
                lastPreviewCell &&
                rowIndex === lastPreviewCell.rowIndex &&
                colIndex === lastPreviewCell.colIndex;

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`relative cursor-pointer flex items-center justify-center ${
                    cell === 1
                      ? 'bg-black'
                      : isPreviewCell
                      ? 'bg-gray-300'
                      : 'bg-white'
                  }`}
                  onMouseDown={(event) =>
                    handleMouseDown(event, rowIndex, colIndex)
                  }
                  onMouseEnter={(event) =>
                    handleMouseMove(event, rowIndex, colIndex)
                  }
                  onMouseUp={handleMouseUp}
                  onContextMenu={(event) =>
                    handleCellRightClick(event, rowIndex, colIndex)
                  }
                  style={{
                    width: '2rem',
                    height: '2rem',
                    borderTop: rowIndex === 0 ? '1px solid #000' : 'none',
                    borderLeft: colIndex === 0 ? '1px solid #000' : 'none',
                    borderRight: '1px solid #000',
                    borderBottom: '1px solid #000',
                  }}
                >
                  {cell === 2 && (
                    <span className="text-gray-500 text-lg">×</span>
                  )}
                  {isLastPreviewCell &&
                    !isGameOver &&
                    !mistakeMade &&
                    selectedCellCount > 1 && (
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm text-gray-700 bg-white px-1 rounded">
                        {selectedCellCount}
                      </div>
                    )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 操作モードの切り替えボタン */}
      <div className="mt-4 flex space-x-4">
        <button
          className={`px-4 py-2 rounded ${
            currentMode === 'fill' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setCurrentMode('fill')}
        >
          塗りつぶし
        </button>
        <button
          className={`px-4 py-2 rounded ${
            currentMode === 'mark' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setCurrentMode('mark')}
        >
          ×印
        </button>
      </div>

      {/* 正解メッセージとリセットボタン */}
      {isSolved && (
        <div className="mt-4 p-2 bg-green-200 text-green-800 rounded">
          おめでとうございます！パズルを解きました。
        </div>
      )}
      {isGameOver && (
        <div className="mt-4 p-2 bg-red-200 text-red-800 rounded">
          ゲームオーバー！リセットして再挑戦してください。
        </div>
      )}
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleReset}
      >
        リセット
      </button>
    </div>
  );
};

export default PuzzleGrid;

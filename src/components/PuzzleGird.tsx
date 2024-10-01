// PuzzleGrid.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Puzzle, Cell } from '../lib/puzzles';
import { calculateHints } from '../lib/utils';

interface PuzzleGridProps {
  puzzle: Puzzle;
}

const PuzzleGrid: React.FC<PuzzleGridProps> = ({ puzzle }) => {
  // calculateHintsに渡すデータをnumber[][]に変換
  const { rows, columns } = calculateHints(puzzle.data.map((row) => row.map((cell) => cell.value)));

  // gridState: 各セルの状態 (0: 未操作, 1: 塗りつぶし, 2: ×印)
  const [gridState, setGridState] = useState<number[][]>(Array.from({ length: puzzle.size }, () => Array(puzzle.size).fill(0)));

  // 正解判定とメッセージ表示
  const [isSolved, setIsSolved] = useState(false);

  // ライフとゲームオーバー状態
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);

  // ドラッグ操作用の状態変数
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState<{ rowIndex: number; colIndex: number } | null>(null);
  const [dragButton, setDragButton] = useState<number | null>(null);
  const [dragPreview, setDragPreview] = useState<Array<{ rowIndex: number; colIndex: number }>>([]);
  const [selectedCellCount, setSelectedCellCount] = useState(0);

  // 操作モードの状態
  const [currentMode, setCurrentMode] = useState<'fill' | 'mark'>('fill');

  // マウスアップ時の処理をuseCallbackでメモ化
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setDragStartPos(null);
      setDragButton(null);
      setDragPreview([]);
      setSelectedCellCount(0);
    }
  }, [isDragging]);

  // マウスアップイベントのリスナーを設定
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
  }, [isDragging, handleMouseUp]);

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
          if (userCell !== puzzle.data[i][j].value) {
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

  // パズル変更時に状態をリセット
  useEffect(() => {
    console.log(`Selected Puzzle Size: ${puzzle.size}`);
    console.log(`Selected Puzzle Data Rows: ${puzzle.data.length}`);
    console.log(`Selected Puzzle Data Columns (First Row): ${puzzle.data[0]?.length}`);

    // gridStateの正確な設定を確認
    const newGridState = Array.from({ length: puzzle.size }, () => Array(puzzle.size).fill(0));
    console.log('Setting new gridState:', newGridState);
    setGridState(newGridState);

    // その他の状態をリセット
    setIsSolved(false);
    setLives(3);
    setIsGameOver(false);
    setIsDragging(false);
    setDragStartPos(null);
    setDragButton(null);
    setDragPreview([]);
    setSelectedCellCount(0);
  }, [puzzle]);

  // 左クリックおよび右クリック時の処理
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>, rowIndex: number, colIndex: number) => {
    event.preventDefault();
    if (isGameOver) return;

    const cellValue = gridState[rowIndex][colIndex];
    if (cellValue !== 0) return; // 既に操作済みの場合は何もしない

    const puzzleCell: Cell | undefined = puzzle.data[rowIndex]?.[colIndex];
    if (!puzzleCell) {
      console.error(`Invalid cell at row ${rowIndex}, column ${colIndex}`);
      return;
    }

    const correctValue = puzzleCell.value;

    if (currentMode === 'fill') {
      if (event.button === 0) {
        // 左クリック（塗りつぶし）
        if (correctValue === 1) {
          // 正解マスの場合
          setGridState((prevState) => {
            const newState = prevState.map((row) => row.slice());
            newState[rowIndex][colIndex] = 1;
            return newState;
          });
          // ドラッグ操作を開始
          setIsDragging(true);
          setDragStartPos({ rowIndex, colIndex });
          setDragButton(0); // 左クリック
          setDragPreview([{ rowIndex, colIndex }]);
          setSelectedCellCount(1);
        } else {
          // 不正解マスの場合
          setGridState((prevState) => {
            const newState = prevState.map((row) => row.slice());
            newState[rowIndex][colIndex] = 2; // ×印を付ける
            return newState;
          });
          setLives((prevLives) => prevLives - 1);
          // プレビューは不要
        }
      } else if (event.button === 2) {
        // 右クリック（×印を付ける）
        if (correctValue === 0) {
          // 正解が空白マスの場合
          setGridState((prevState) => {
            const newState = prevState.map((row) => row.slice());
            newState[rowIndex][colIndex] = 2; // ×印を付ける
            return newState;
          });
          // ドラッグ操作を開始
          setIsDragging(true);
          setDragStartPos({ rowIndex, colIndex });
          setDragButton(2); // 右クリック
          setDragPreview([{ rowIndex, colIndex }]);
          setSelectedCellCount(1);
        } else {
          // 正解が塗りつぶしマスの場合
          setGridState((prevState) => {
            const newState = prevState.map((row) => row.slice());
            newState[rowIndex][colIndex] = 1; // 塗りつぶす
            return newState;
          });
          setLives((prevLives) => prevLives - 1);
          // プレビューは不要
        }
      }
    } else if (currentMode === 'mark') {
      // ×印モード（左右クリック共通）
      if (correctValue === 0) {
        // 正解が空白マスの場合
        setGridState((prevState) => {
          const newState = prevState.map((row) => row.slice());
          newState[rowIndex][colIndex] = 2; // ×印を付ける
          return newState;
        });
        // ドラッグ操作を開始
        setIsDragging(true);
        setDragStartPos({ rowIndex, colIndex });
        setDragButton(event.button); // 左右どちらのクリックかを記録
        setDragPreview([{ rowIndex, colIndex }]);
        setSelectedCellCount(1);
      } else {
        // 正解が塗りつぶしマスの場合
        setGridState((prevState) => {
          const newState = prevState.map((row) => row.slice());
          newState[rowIndex][colIndex] = 1; // 塗りつぶす
          return newState;
        });
        setLives((prevLives) => prevLives - 1);
        // プレビューは不要
      }
    }
  };

  // 右クリック時の処理
  const handleCellRightClick = (event: React.MouseEvent<HTMLDivElement>, rowIndex: number, colIndex: number) => {
    handleMouseDown(event, rowIndex, colIndex); // 右クリックもhandleMouseDownで処理
  };

  // マウス移動時の処理（ドラッグ操作）
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>, rowIndex: number, colIndex: number) => {
    if (isDragging && dragStartPos && dragButton !== null) {
      event.preventDefault();

      const cellValue = gridState[rowIndex][colIndex];
      if (cellValue !== 0) return; // 既に操作済みの場合は何もしない

      const puzzleCell: Cell | undefined = puzzle.data[rowIndex]?.[colIndex];
      if (!puzzleCell) {
        console.error(`Invalid cell at row ${rowIndex}, column ${colIndex}`);
        return;
      }

      const correctValue = puzzleCell.value;

      // 塗りつぶしモードで左クリックまたは右クリック
      if (currentMode === 'fill') {
        if (dragButton === 0) {
          // 左クリックでドラッグ中（塗りつぶし）
          if (correctValue === 1) {
            // 正解マスの場合
            setGridState((prevState) => {
              const newState = prevState.map((row) => row.slice());
              newState[rowIndex][colIndex] = 1;
              return newState;
            });
            // プレビューを更新
            setDragPreview((prev) => [...prev, { rowIndex, colIndex }]);
            setSelectedCellCount((prev) => prev + 1);
          } else {
            // 不正解マスの場合
            setGridState((prevState) => {
              const newState = prevState.map((row) => row.slice());
              newState[rowIndex][colIndex] = 2; // ×印を付ける
              return newState;
            });
            setLives((prevLives) => prevLives - 1);
            // プレビューは不要
          }
        } else if (dragButton === 2) {
          // 右クリックでドラッグ中（×印を付ける）
          if (correctValue === 0) {
            // 正解が空白マスの場合
            setGridState((prevState) => {
              const newState = prevState.map((row) => row.slice());
              newState[rowIndex][colIndex] = 2;
              return newState;
            });
            // プレビューを更新
            setDragPreview((prev) => [...prev, { rowIndex, colIndex }]);
            setSelectedCellCount((prev) => prev + 1);
          } else {
            // 正解が塗りつぶしマスの場合
            setGridState((prevState) => {
              const newState = prevState.map((row) => row.slice());
              newState[rowIndex][colIndex] = 1;
              return newState;
            });
            setLives((prevLives) => prevLives - 1);
            // プレビューは不要
          }
        }
      } else if (currentMode === 'mark') {
        // ×印モード（左右クリック共通）
        if (correctValue === 0) {
          // 正解が空白マスの場合
          setGridState((prevState) => {
            const newState = prevState.map((row) => row.slice());
            newState[rowIndex][colIndex] = 2;
            return newState;
          });
          // プレビューを更新
          setDragPreview((prev) => [...prev, { rowIndex, colIndex }]);
          setSelectedCellCount((prev) => prev + 1);
        } else {
          // 正解が塗りつぶしマスの場合
          setGridState((prevState) => {
            const newState = prevState.map((row) => row.slice());
            newState[rowIndex][colIndex] = 1;
            return newState;
          });
          setLives((prevLives) => prevLives - 1);
          // プレビューは不要
        }
      }
    }
  };

  const handleReset = () => {
    setGridState(Array.from({ length: puzzle.size }, () => Array(puzzle.size).fill(0)));
    setIsSolved(false);
    setLives(3);
    setIsGameOver(false);
    setIsDragging(false);
    setDragStartPos(null);
    setDragButton(null);
    setDragPreview([]);
    setSelectedCellCount(0);
  };

  useEffect(() => {
    console.log('Current gridState:', gridState);
  }, [gridState]);

  const maxHintHeight = Math.max(...columns.map((hints) => hints.length));
  const maxHintWidth = Math.max(...rows.map((hints) => hints.length));

  return (
    <div className="flex flex-col items-center">
      {/* ライフの表示 */}
      <div className="flex items-center mb-2">
        <span className="text-lg mr-2">ライフ:</span>
        {[...Array(3)].map((_, idx) => (
          <span key={idx} className={`w-6 h-6 mx-1 ${idx < lives ? 'bg-red-500' : 'bg-gray-300'} rounded-full inline-block`}></span>
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
                  <div key={idx} className="w-8 h-8 inline-flex items-center justify-center p-0 m-0">
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
                  <div key={idx} className="w-8 h-8 inline-flex items-center justify-center p-0 m-0">
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
              const puzzleCell: Cell | undefined = puzzle.data[rowIndex]?.[colIndex];
              if (!puzzleCell) {
                console.error(`Invalid cell at row ${rowIndex}, column ${colIndex}`);
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="relative cursor-pointer flex items-center justify-center bg-red-500"
                    style={{
                      width: '2rem',
                      height: '2rem',
                      borderTop: rowIndex === 0 ? '1px solid #000' : 'none',
                      borderLeft: colIndex === 0 ? '1px solid #000' : 'none',
                      borderRight: '1px solid #000',
                      borderBottom: '1px solid #000',
                    }}
                  >
                    <span className="text-white text-lg">!</span>
                  </div>
                );
              }
              const cellColor = puzzleCell.color;

              const isPreviewCell = dragPreview.some((pos) => pos.rowIndex === rowIndex && pos.colIndex === colIndex);
              const isLastPreviewCell =
                dragPreview.length > 0 &&
                rowIndex === dragPreview[dragPreview.length - 1].rowIndex &&
                colIndex === dragPreview[dragPreview.length - 1].colIndex;

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`relative cursor-pointer flex items-center justify-center`}
                  onMouseDown={(event) => handleMouseDown(event, rowIndex, colIndex)}
                  onMouseEnter={(event) => handleMouseMove(event, rowIndex, colIndex)}
                  onMouseUp={handleMouseUp}
                  onContextMenu={(event) => handleCellRightClick(event, rowIndex, colIndex)}
                  style={{
                    width: '2rem',
                    height: '2rem',
                    borderTop: rowIndex === 0 ? '1px solid #000' : 'none',
                    borderLeft: colIndex === 0 ? '1px solid #000' : 'none',
                    borderRight: '1px solid #000',
                    borderBottom: '1px solid #000',
                    backgroundColor:
                      cell === 1
                        ? cellColor
                        : cell === 2
                        ? '#FFFFFF' // ×印の際は白背景
                        : isPreviewCell
                        ? '#CCCCCC' // プレビュー中のセルは灰色
                        : '#FFFFFF',
                  }}
                >
                  {cell === 2 && <span className="text-gray-500 text-lg">×</span>}
                  {isLastPreviewCell && !isGameOver && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm text-gray-700 bg-white px-1 rounded">{selectedCellCount}</div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 操作モードの切り替えボタン */}
      <div className="mt-4 flex space-x-4">
        <button className={`px-4 py-2 rounded ${currentMode === 'fill' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setCurrentMode('fill')}>
          塗りつぶし
        </button>
        <button className={`px-4 py-2 rounded ${currentMode === 'mark' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setCurrentMode('mark')}>
          ×印
        </button>
      </div>

      {/* 正解メッセージとリセットボタン */}
      {isSolved && <div className="mt-4 p-2 bg-green-200 text-green-800 rounded">おめでとうございます！パズルを解きました。</div>}
      {isGameOver && <div className="mt-4 p-2 bg-red-200 text-red-800 rounded">ゲームオーバー！リセットして再挑戦してください。</div>}
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={handleReset}>
        リセット
      </button>
    </div>
  );
};

export default PuzzleGrid;

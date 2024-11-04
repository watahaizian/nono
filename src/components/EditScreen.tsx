import { useState } from 'react';
import { puzzleSizes, createCellData, createPuzzle, EditScreenProps } from '../lib/interface';
import { getCellStyle } from '../lib/utils';
import { postPuzzle } from '../lib/api';

const EditScreen = ({ onBack }: EditScreenProps) => {
  const sizes = [5, 10, 15, 20, 25];
  const [puzzleSize, setPuzzleSize] = useState<puzzleSizes>(5);
  const [paintColor, setPaintColor] = useState<string>('#000000');
  const [currentCell, setCurrentCell] = useState<(string | null)[][]>(Array.from({ length: puzzleSize }, () => Array<string | null>(puzzleSize).fill(null)));
  const [title, setTitle] = useState<string>('');

  const selectPuzzleSize = (size: puzzleSizes) => {
    // サイズ選択時にcurrentCellがすべてnullでなければ、確認ダイアログを表示
    if (currentCell.some((row) => row.some((cell) => cell !== null))) {
      if (!window.confirm('変更すると現在の編集内容が消えます。よろしいですか？')) {
        return;
      }
    }
    setPuzzleSize(size);
    setCurrentCell(Array.from({ length: size }, () => Array<string | null>(size).fill(null)));
  };

  const resetAllCells = () => {
    // currentCellが全てnullでない場合は確認ダイアログを表示
    if (currentCell.some((row) => row.some((cell) => cell !== null)) && !window.confirm('全てがリセットされます。よろしいですか？')) {
      return;
    }
    setCurrentCell(Array.from({ length: puzzleSize }, () => Array<string | null>(puzzleSize).fill(null)));
  };

  const createPuzzle = () => {
    // タイトルが入力されていない場合はアラートを表示
    if (!title) {
      alert('タイトルを入力してください');
      return;
    }
    // currentCellがすべてnullの場合はアラートを表示
    if (currentCell.every((row) => row.every((cell) => cell === null))) {
      alert('何か描いてください');
      return;
    }
    // createCellDataに合わせてパズルデータを作成
    const puzzleData: createCellData[] = [];
    currentCell.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        puzzleData.push({
          row_index: rowIndex,
          col_index: colIndex,
          value: cell ? 1 : 0,
          color: cell || '#FFFFFF',
        });
      });
    });
    // パズルデータをfetchで送信
    const puzzle: createPuzzle = {
      name: title,
      size: puzzleSize,
      cells: puzzleData,
    };
    postPuzzle(puzzle).then(() => {
      alert('パズルを作成しました');
      onBack();
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div>
        <h2>サイズ選択</h2>
        <select
          value={puzzleSize}
          onChange={(e) => selectPuzzleSize(Number(e.target.value) as puzzleSizes)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sizes.map((size) => (
            <option key={size} value={size}>
              {size} x {size}
            </option>
          ))}
        </select>
        <div className="mt-4">
          塗色：
          <input type="color" value={paintColor} onChange={(e) => setPaintColor(e.target.value)} className="ml-2 cursor-pointer" />
          <button className="ml-4 px-3 py-1 border border-gray-300 rounded-md" onClick={resetAllCells}>
            リセット
          </button>
        </div>
      </div>
      <div
        className="grid gap-0 mt-4"
        style={{ gridTemplateColumns: `repeat(${puzzleSize}, 2rem)` }} // 固定幅に変更
      >
        {currentCell.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="w-8 h-8 flex items-center justify-center cursor-pointer border border-gray-300" // ボーダーを追加
              style={{
                ...getCellStyle(rowIndex, colIndex),
                backgroundColor: cell || '#FFFFFF',
              }}
              onClick={() => {
                const newCell = [...currentCell];
                newCell[rowIndex][colIndex] = paintColor === '#ffffff' ? null : paintColor;
                setCurrentCell(newCell);
              }}
            ></div>
          ))
        )}
      </div>
      <div>
        <input
          type="text"
          className="mt-4 px-3 py-1 border border-gray-300 rounded-md"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="ml-4 mt-4 px-3 py-1 border border-gray-300 rounded-md" onClick={createPuzzle}>
          作成
        </button>
      </div>
      <button onClick={onBack} className="absolute bottom-4 left-4 px-3 py-1 border border-gray-300 rounded-md bg-gray-200 hover:bg-gray-300">
        戻る
      </button>
    </div>
  );
};

export default EditScreen;

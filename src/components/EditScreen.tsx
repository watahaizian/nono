import { useState } from 'react';
import { puzzleSizes } from '../lib/interface';
import { getCellStyle } from '../lib/utils';

const EditScreen = () => {
  const sizes = [5, 10, 15, 20, 25];
  const [puzzleSize, setPuzzleSize] = useState<puzzleSizes>(5);
  const [defaultBackgroundColor, setDefaultBackgroundColor] = useState<string>('#FFFFFF');
  const [paintColor, setPaintColor] = useState<string>('#000000');
  const [currentCell, setCurrentCell] = useState<(string | null)[][]>(Array.from({ length: puzzleSize }, () => Array<string | null>(puzzleSize).fill(null)));

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
          背景色：
          <input type="color" value={defaultBackgroundColor} onChange={(e) => setDefaultBackgroundColor(e.target.value)} className="ml-2" />
          塗色：
          <input type="color" value={paintColor} onChange={(e) => setPaintColor(e.target.value)} className="ml-2" />
        </div>
      </div>
      <div
        className="grid gap-0"
        style={{ gridTemplateColumns: `repeat(${puzzleSize}, 2rem)` }} // 固定幅に変更
      >
        {currentCell.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="w-8 h-8 flex items-center justify-center cursor-pointer border border-gray-300" // ボーダーを追加
              style={{ ...getCellStyle(rowIndex, colIndex), backgroundColor: cell || defaultBackgroundColor }}
              onClick={() => {
                const newCell = [...currentCell];
                newCell[rowIndex][colIndex] = paintColor;
                setCurrentCell(newCell);
              }}
            ></div>
          ))
        )}
      </div>
    </div>
  );
};

export default EditScreen;

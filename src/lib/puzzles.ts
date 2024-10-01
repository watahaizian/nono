export interface Cell {
  value: number; // 0: 空白, 1: 塗りつぶし
  color: string; // 例: "#FF0000" (赤色)
}

export interface Puzzle {
  id: string;
  name: string;
  size: number;
  data: Cell[][];
}

export const puzzles: Puzzle[] = [
  {
    id: 'puzzle-5x5-1',
    name: '5x5 パズル 1',
    size: 5,
    data: [
      [
        { value: 1, color: "#FF0000" }, // 赤色
        { value: 0, color: "#FFFFFF" }, // 白色
        { value: 1, color: "#00FF00" }, // 緑色
        { value: 0, color: "#FFFFFF" },
        { value: 1, color: "#0000FF" }, // 青色
      ],
      [
        { value: 0, color: "#FFFFFF" },
        { value: 1, color: "#FFFF00" }, // 黄色
        { value: 0, color: "#FFFFFF" },
        { value: 1, color: "#FF00FF" }, // マゼンタ
        { value: 0, color: "#FFFFFF" },
      ],
      [
        { value: 1, color: "#00FFFF" }, // シアン
        { value: 0, color: "#FFFFFF" },
        { value: 1, color: "#FFA500" }, // オレンジ
        { value: 0, color: "#FFFFFF" },
        { value: 1, color: "#800080" }, // 紫色
      ],
      [
        { value: 0, color: "#FFFFFF" },
        { value: 1, color: "#008000" }, // 緑
        { value: 0, color: "#FFFFFF" },
        { value: 1, color: "#800000" }, // 茶色
        { value: 0, color: "#FFFFFF" },
      ],
      [
        { value: 1, color: "#FFD700" }, // ゴールド
        { value: 0, color: "#FFFFFF" },
        { value: 1, color: "#00CED1" }, // ダークターコイズ
        { value: 0, color: "#FFFFFF" },
        { value: 1, color: "#FF69B4" }, // ホットピンク
      ],
    ],
  },
  {
    id: 'puzzle-10x10-1',
    name: '10x10 パズル 1',
    size: 10,
    data: [
      // 10x10のデータをここに追加
        [
          { value: 1, color: "#FF0000" }, { value: 0, color: "#FFFFFF" }, { value: 1, color: "#00FF00" }, { value: 0, color: "#FFFFFF" }, { value: 1, color: "#0000FF" },
          { value: 0, color: "#FFFFFF" }, { value: 1, color: "#FFFF00" }, { value: 0, color: "#FFFFFF" }, { value: 1, color: "#FF00FF" }, { value: 0, color: "#FFFFFF" }
        ],[
          { value: 1, color: "#FF0000" }, { value: 0, color: "#FFFFFF" }, { value: 1, color: "#00FF00" }, { value: 0, color: "#FFFFFF" }, { value: 1, color: "#0000FF" },
          { value: 0, color: "#FFFFFF" }, { value: 1, color: "#FFFF00" }, { value: 0, color: "#FFFFFF" }, { value: 1, color: "#FF00FF" }, { value: 0, color: "#FFFFFF" }
        ],[
          { value: 1, color: "#FF0000" }, { value: 0, color: "#FFFFFF" }, { value: 1, color: "#00FF00" }, { value: 0, color: "#FFFFFF" }, { value: 1, color: "#0000FF" },
          { value: 0, color: "#FFFFFF" }, { value: 1, color: "#FFFF00" }, { value: 0, color: "#FFFFFF" }, { value: 1, color: "#FF00FF" }, { value: 0, color: "#FFFFFF" }
        ],[
          { value: 1, color: "#FF0000" }, { value: 0, color: "#FFFFFF" }, { value: 1, color: "#00FF00" }, { value: 0, color: "#FFFFFF" }, { value: 1, color: "#0000FF" },
          { value: 0, color: "#FFFFFF" }, { value: 1, color: "#FFFF00" }, { value: 0, color: "#FFFFFF" }, { value: 1, color: "#FF00FF" }, { value: 0, color: "#FFFFFF" }
        ],[
          { value: 1, color: "#FF0000" }, { value: 0, color: "#FFFFFF" }, { value: 1, color: "#00FF00" }, { value: 0, color: "#FFFFFF" }, { value: 1, color: "#0000FF" },
          { value: 0, color: "#FFFFFF" }, { value: 1, color: "#FFFF00" }, { value: 0, color: "#FFFFFF" }, { value: 1, color: "#FF00FF" }, { value: 0, color: "#FFFFFF" }
        ],[
          { value: 1, color: "#FF0000" }, { value: 0, color: "#FFFFFF" }, { value: 1, color: "#00FF00" }, { value: 0, color: "#FFFFFF" }, { value: 1, color: "#0000FF" },
          { value: 0, color: "#FFFFFF" }, { value: 1, color: "#FFFF00" }, { value: 0, color: "#FFFFFF" }, { value: 1, color: "#FF00FF" }, { value: 0, color: "#FFFFFF" }
        ],[
          { value: 1, color: "#FF0000" }, { value: 0, color: "#FFFFFF" }, { value: 1, color: "#00FF00" }, { value: 0, color: "#FFFFFF" }, { value: 1, color: "#0000FF" },
          { value: 0, color: "#FFFFFF" }, { value: 1, color: "#FFFF00" }, { value: 0, color: "#FFFFFF" }, { value: 1, color: "#FF00FF" }, { value: 0, color: "#FFFFFF" }
        ],[
          { value: 1, color: "#FF0000" }, { value: 0, color: "#FFFFFF" }, { value: 1, color: "#00FF00" }, { value: 0, color: "#FFFFFF" }, { value: 1, color: "#0000FF" },
          { value: 0, color: "#FFFFFF" }, { value: 1, color: "#FFFF00" }, { value: 0, color: "#FFFFFF" }, { value: 1, color: "#FF00FF" }, { value: 0, color: "#FFFFFF" }
        ],[
          { value: 1, color: "#FF0000" }, { value: 0, color: "#FFFFFF" }, { value: 1, color: "#00FF00" }, { value: 0, color: "#FFFFFF" }, { value: 1, color: "#0000FF" },
          { value: 0, color: "#FFFFFF" }, { value: 1, color: "#FFFF00" }, { value: 0, color: "#FFFFFF" }, { value: 1, color: "#FF00FF" }, { value: 0, color: "#FFFFFF" }
        ],[
          { value: 1, color: "#FF0000" }, { value: 0, color: "#FFFFFF" }, { value: 1, color: "#00FF00" }, { value: 0, color: "#FFFFFF" }, { value: 1, color: "#0000FF" },
          { value: 0, color: "#FFFFFF" }, { value: 1, color: "#FFFF00" }, { value: 0, color: "#FFFFFF" }, { value: 1, color: "#FF00FF" }, { value: 0, color: "#FFFFFF" }
        ],
    ],
  },
  // 他のパズルも同様に追加
];

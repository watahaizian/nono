export interface cellData {
  id: number;
  puzzle_id: number;
  row_index: number;
  col_index: number;
  value: number;
  color: string;
}

export interface GameScreenProps {
  puzzleId: number;
  puzzleSize: number;
}

export interface TitleScreenProps {
  onStart: () => void;
  onEdit: () => void;
}

export interface hints {
  rowHints: number[][];
  colHints: number[][];
}

export type puzzleSizes = 5 | 10 | 15 | 20 | 25;

export interface createCellData {
  row_index: number;
  col_index: number;
  value: number;
  color: string;
}

export interface EditScreenProps {
  onBack: () => void;
}

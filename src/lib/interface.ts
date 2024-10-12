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

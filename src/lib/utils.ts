export const calculateHints = (
  data: number[][]
): { rows: number[][]; columns: number[][] } => {
  const rows = data.map((row) => {
    const hints = [];
    let count = 0;
    for (const cell of row) {
      if (cell) {
        count++;
      } else if (count > 0) {
        hints.push(count);
        count = 0;
      }
    }
    if (count > 0) {
      hints.push(count);
    }
    return hints.length ? hints : [0];
  });

  const columns = data[0].map((_, colIndex) => {
    const hints = [];
    let count = 0;
    for (const row of data) {
      if (row[colIndex]) {
        count++;
      } else if (count > 0) {
        hints.push(count);
        count = 0;
      }
    }
    if (count > 0) {
      hints.push(count);
    }
    return hints.length ? hints : [0];
  });

  return { rows, columns };
};

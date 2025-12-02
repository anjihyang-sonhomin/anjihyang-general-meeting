export const tables = {};

// Vertical Layout Configuration
// Canvas size: 800 (width) x 1200 (height)
// const startPoint = [400, 1150]; // Deprecated: Old Entrance

// Generate 15 tables in a grid (5 rows x 3 columns) - Vertical mobile layout
// 첫 번째 행을 입구 3(X) 아래로 이동 (입구 3 가로줄에는 테이블 없음)
// Rows (Y coords) - 5 rows (간격 160, 균등 분배)
const rows = [160, 320, 480, 640, 800];
// Columns (X coords) - 3 columns (간격 145)
const cols = [340, 195, 50];

const SEATS_PER_TABLE = 8;
const SEAT_RADIUS_FROM_CENTER = 65;

let tableCount = 1;

// Row-first iteration: 1,2,3 in row1, 4,5,6 in row2, etc.
rows.forEach((y) => {
  cols.forEach((x) => {
    const tableId = `Table_${tableCount}`;
    const seats = [];

    // Generate 8 seats around the table
    for (let i = 1; i <= SEATS_PER_TABLE; i++) {
      // Start from top (-90 degrees) and go clockwise
      const angle = ((i - 1) * (360 / SEATS_PER_TABLE) - 90) * (Math.PI / 180);
      seats.push({
        id: i,
        label: `${i}`,
        x: x + SEAT_RADIUS_FROM_CENTER * Math.cos(angle),
        y: y + SEAT_RADIUS_FROM_CENTER * Math.sin(angle),
      });
    }

    // Path logic is deprecated/commented out for now as per request
    // We just need table and seat coordinates
    const path = [];

    tables[tableId] = {
      id: tableId,
      label: `${tableCount}`,
      x: x,
      y: y,
      path: path,
      seats: seats,
    };

    tableCount++;
  });
});

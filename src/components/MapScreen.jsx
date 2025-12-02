import React from "react";
import { tables } from "../data/tables";

const MapScreen = ({ tableId, seatId, entrance, userName }) => {
  const table = tables[tableId];

  if (!table) return <div>Table not found</div>;

  const TABLE_RADIUS = 45;

  // 입구 위치 (오른쪽에 세로로 배치) - 동일한 간격(195px)
  const entrancePositions = {
    1: { x: 445, y: 745 }, // 입구 1 (아래쪽) - 박스 왼쪽에서 시작
    2: { x: 445, y: 410 }, // 입구 2 (중간) - 박스 왼쪽에서 시작
  };

  const entrancePos = entrancePositions[entrance] || entrancePositions[2];

  // 통로 x좌표 (테이블과 입구 사이)
  const mainAisleX = 410; // 메인 통로 (오른쪽, 테이블에서 충분히 떨어진 위치)

  // 테이블 열 위치
  const colXs = [340, 195, 50]; // 오른쪽, 중간, 왼쪽 열

  // 테이블 행 위치 (5행, 간격 160, 균등 분배)
  const rowYs = [160, 320, 480, 640, 800];

  // 행 사이 통로 y좌표 (테이블 사이의 빈 공간)
  const rowAisles = [100, 240, 400, 560, 720, 860]; // 각 행 사이의 통로

  // 찾아가는 길 계산 (입구 → 테이블, 테이블 사이 통로로만 이동)
  const generatePath = () => {
    const startX = entrancePos.x;
    const startY = entrancePos.y;
    const endX = table.x;
    const endY = table.y;

    // 테이블이 몇 번째 열/행인지
    const colIndex = colXs.indexOf(endX);
    const rowIndex = rowYs.indexOf(endY);

    // 테이블 오른쪽 가장자리 (경로 끝점)
    const tableEdgeX = endX + TABLE_RADIUS + 15;

    // 오른쪽 열(1,4,7,10,13): 같은 행의 통로로 이동 후 테이블로
    if (colIndex === 0) {
      // 입구에서 위/아래 중 가까운 통로 선택
      const upperAisle = rowAisles[rowIndex];
      const lowerAisle = rowAisles[rowIndex + 1];
      const aisleY = Math.abs(startY - upperAisle) < Math.abs(startY - lowerAisle) ? upperAisle : lowerAisle;

      return `M ${startX} ${startY} L ${mainAisleX} ${startY} L ${mainAisleX} ${aisleY} L ${tableEdgeX} ${aisleY} L ${tableEdgeX} ${endY}`;
    }

    // 중간/왼쪽 열: 행 사이 통로를 이용
    // 입구 위치에 따라 위에서 접근할지 아래에서 접근할지 결정
    const upperAisle = rowAisles[rowIndex];
    const lowerAisle = rowAisles[rowIndex + 1];
    const aisleY = Math.abs(startY - upperAisle) < Math.abs(startY - lowerAisle) ? upperAisle : lowerAisle;

    // 경로: 입구 → 메인통로 → 행사이통로로 수직이동 → 테이블 열까지 수평이동 → 테이블로 수직이동
    const approachFromTop = aisleY < endY;
    const tableApproachY = approachFromTop ? endY - TABLE_RADIUS - 15 : endY + TABLE_RADIUS + 15;

    return `M ${startX} ${startY} L ${mainAisleX} ${startY} L ${mainAisleX} ${aisleY} L ${endX} ${aisleY} L ${endX} ${tableApproachY}`;
  };

  const pathData = generatePath();

  return (
    <div className="map-screen">
      {/* 상단 안내 */}
      <div className="info-panel-top">
        <h2>{userName}님</h2>
        <h1>{table.label}번 테이블</h1>
      </div>

      <div className="map-container">
        <svg
          className="path-overlay"
          viewBox="0 0 500 850"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* 입구 표시 - 오른쪽 */}
          {/* 입구 3 (미개방) - 더 위로 */}
          <rect
            x="448"
            y="5"
            width="52"
            height="140"
            fill="#999"
            rx="6"
            stroke="#666"
            strokeWidth="2"
          />
          {/* X 표시 */}
          <line x1="458" y1="20" x2="490" y2="130" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
          <line x1="490" y1="20" x2="458" y2="130" stroke="#fff" strokeWidth="5" strokeLinecap="round" />

          {/* 입구 2 - 간격 195px */}
          <rect
            x="448"
            y="340"
            width="52"
            height="140"
            fill={entrance === 2 ? "#267f53" : "#e0e0e0"}
            rx="6"
            stroke={entrance === 2 ? "#1b5e3c" : "#bbb"}
            strokeWidth={entrance === 2 ? "3" : "2"}
          />
          <text
            x="474"
            y="375"
            textAnchor="middle"
            fill={entrance === 2 ? "#fff" : "#444"}
            fontSize="32"
            fontWeight="bold"
          >
            <tspan x="474" dy="0">입</tspan>
            <tspan x="474" dy="38">구</tspan>
            <tspan x="474" dy="38">2</tspan>
          </text>

          {/* 입구 1 - 간격 195px */}
          <rect
            x="448"
            y="675"
            width="52"
            height="140"
            fill={entrance === 1 ? "#267f53" : "#e0e0e0"}
            rx="6"
            stroke={entrance === 1 ? "#1b5e3c" : "#bbb"}
            strokeWidth={entrance === 1 ? "3" : "2"}
          />
          <text
            x="474"
            y="710"
            textAnchor="middle"
            fill={entrance === 1 ? "#fff" : "#444"}
            fontSize="32"
            fontWeight="bold"
          >
            <tspan x="474" dy="0">입</tspan>
            <tspan x="474" dy="38">구</tspan>
            <tspan x="474" dy="38">1</tspan>
          </text>

          {/* 찾아가는 길 */}
          <path
            d={pathData}
            fill="none"
            stroke="#fbc02d"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="15,10"
          />

          {/* 테이블 렌더링 */}
          {Object.values(tables).map((t) => {
            const isSelected = t.id === tableId;

            return (
              <g
                key={t.id}
                className={`table-group ${isSelected ? "selected" : ""}`}
                style={{ opacity: isSelected ? 1 : 0.4 }}
              >
                <circle
                  cx={t.x}
                  cy={t.y}
                  r={isSelected ? 55 : TABLE_RADIUS}
                  className="table-shape"
                />
                <text
                  x={t.x}
                  y={t.y}
                  dy="10"
                  textAnchor="middle"
                  className="table-label"
                  style={{ fontSize: isSelected ? "32px" : "20px" }}
                >
                  {t.label}
                </text>
              </g>
            );
          })}

        </svg>
      </div>
    </div>
  );
};

export default MapScreen;

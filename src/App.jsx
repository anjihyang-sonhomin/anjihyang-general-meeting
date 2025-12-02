import React, { useState, useMemo } from "react";
import InputScreen from "./components/InputScreen";
import MapScreen from "./components/MapScreen";
import "./App.css";

function App() {
  const [view, setView] = useState("input"); // 'input' or 'map'
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [userName, setUserName] = useState("");

  // 쿼리파라미터에서 entrance 값 읽기 (1 또는 2, 기본값 2)
  const entrance = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const entranceParam = params.get("entrance");
    return entranceParam === "1" ? 1 : 2;
  }, []);

  const [selectedEntrance, setSelectedEntrance] = useState(entrance);

  const handleFind = (nickname, tableId, seatId, entranceNum) => {
    setUserName(nickname);
    setSelectedTable(tableId);
    setSelectedSeat(seatId);
    setSelectedEntrance(entranceNum);
    setView("map");
  };

  return (
    <div className="app-container">
      {view === "input" ? (
        <InputScreen onFind={handleFind} entrance={entrance} />
      ) : (
        <MapScreen
          tableId={selectedTable}
          seatId={selectedSeat}
          entrance={selectedEntrance}
          userName={userName}
        />
      )}
    </div>
  );
}

export default App;

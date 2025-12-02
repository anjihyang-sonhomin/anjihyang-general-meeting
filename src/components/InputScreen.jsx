import React, { useState } from "react";
import { motion } from "framer-motion";
import { users } from "../data/users";

const InputScreen = ({ onFind, entrance: initialEntrance }) => {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedEntrance, setSelectedEntrance] = useState(initialEntrance || 2);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setNickname(val);
    setError("");

    if (val.trim() === "") {
      setSuggestions([]);
      return;
    }

    // Autocomplete logic (prefix match)
    const matches = Object.keys(users).filter((key) =>
      key.toLowerCase().startsWith(val.toLowerCase())
    );
    // Limit to top 5
    setSuggestions(matches.slice(0, 5));
  };

  const handleSuggestionClick = (name) => {
    setNickname(name);
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = users[nickname];
    if (user) {
      onFind(nickname, user.tableId, user.seatId, selectedEntrance);
    } else {
      setError("없는 닉네임입니다. 다시 확인해주세요.");
    }
  };

  return (
    <div className="input-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="input-container"
      >
        <h1>환영합니다</h1>
        <p>닉네임을 입력하여 자리를 확인하세요</p>

        {/* 입구 선택 */}
        <div className="entrance-selector">
          <button
            type="button"
            className={`entrance-btn ${selectedEntrance === 1 ? "active" : ""}`}
            onClick={() => setSelectedEntrance(1)}
          >
            입구 1
          </button>
          <button
            type="button"
            className={`entrance-btn ${selectedEntrance === 2 ? "active" : ""}`}
            onClick={() => setSelectedEntrance(2)}
          >
            입구 2
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ position: "relative" }}>
          <input
            type="text"
            value={nickname}
            onChange={handleInputChange}
            placeholder="닉네임 (예: 호구마)"
            className="nickname-input"
          />

          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((name) => (
                <li
                  key={name}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(name)}
                >
                  {name}
                </li>
              ))}
            </ul>
          )}

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="find-button">
            내 자리 찾기
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default InputScreen;

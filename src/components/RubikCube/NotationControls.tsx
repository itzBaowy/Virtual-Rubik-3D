import { useState } from "react";

type NotationControlsProps = {
  onMove: (move: string) => void;
  onResolve?: () => void;
  onReset?: () => void;
  moveHistory?: string[];
  disabled?: boolean;
};

export function NotationControls({ onMove, onResolve, onReset, moveHistory = [], disabled = false }: NotationControlsProps) {
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const basicMoves = ['R', 'L', 'U', 'D', 'F', 'B'];
  const modifiers = ['', "'", '2'];

  const buttonStyle: React.CSSProperties = {
    padding: "10px 16px",
    margin: "3px",
    backgroundColor: "#ea66e3",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: "14px",
    fontWeight: "600",
    minWidth: "50px",
    opacity: disabled ? 0.5 : 1,
    transition: "all 0.2s",
  };

  const handleMoveClick = (move: string) => {
    if (disabled) return;
    onMove(move);
    setHistory(prev => [...prev, move].slice(-10));
  };

  const handleInputSubmit = () => {
    if (disabled || !inputValue.trim()) return;
    const moves = inputValue.trim().split(/\s+/);
    
    // Validate moves before executing
    const validMovePattern = /^[RLUDFB]['2]?$/;
    const invalidMoves = moves.filter(move => !validMovePattern.test(move));
    
    if (invalidMoves.length > 0) {
      alert(`Invalid moves`);
      return;
    }
    
    moves.forEach(move => handleMoveClick(move));
    setInputValue("");
  };

  const handleScramble = () => {
    if (disabled) return;
    const moves = basicMoves.flatMap(m => [m, m + "'", m + "2"]);
    const scramble = Array.from({ length: 20 }, () => 
      moves[Math.floor(Math.random() * moves.length)]
    );
    scramble.forEach(move => handleMoveClick(move));
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        backgroundColor: "rgba(255,255,255,0.95)",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        backdropFilter: "blur(10px)",
        maxWidth: "400px",
        maxHeight: "calc(100vh - 40px)",
        overflowY: "auto",
      }}
    >
      {/* Basic moves */}
      <div style={{ marginBottom: "15px" }}>
        <div style={{ fontWeight: "bold", marginBottom: "10px", color: "#333" }}>
          Basic Moves:
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          {basicMoves.map(move => (
            <div key={move} style={{ display: "flex", gap: "2px" }}>
              {modifiers.map(mod => (
                <button
                  key={move + mod}  
                  style={buttonStyle}
                  onClick={() => handleMoveClick(move + mod)}
                  disabled={disabled}
                  onMouseEnter={(e) => !disabled && (e.currentTarget.style.backgroundColor = "#ab28e7")}
                  onMouseLeave={(e) => !disabled && (e.currentTarget.style.backgroundColor = "#ea66e3")}
                >
                  {move}{mod}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Algorithm input */}
      <div style={{ marginBottom: "15px" }}>
        <div style={{ fontWeight: "bold", marginBottom: "10px", color: "#333" }}>
          Algorithm Input:
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="ex: R U R' U'"
            disabled={disabled}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "6px",
              border: "2px solid #667eea",
              fontSize: "14px",
              outline: "none",
            }}
          />
          <button
            style={{
              ...buttonStyle,
              backgroundColor: "#10b981",
            }}
            onClick={handleInputSubmit}
            disabled={disabled || !inputValue.trim()}
            onMouseEnter={(e) => !disabled && (e.currentTarget.style.backgroundColor = "#059669")}
            onMouseLeave={(e) => !disabled && (e.currentTarget.style.backgroundColor = "#10b981")}
          >
            Execute
          </button>
        </div>
      </div>

      {/* Utility buttons */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button
          style={{
            ...buttonStyle,
            backgroundColor: "#f59e0b",
          }}
          onClick={handleScramble}
          disabled={disabled}
          onMouseEnter={(e) => !disabled && (e.currentTarget.style.backgroundColor = "#d97706")}
          onMouseLeave={(e) => !disabled && (e.currentTarget.style.backgroundColor = "#f59e0b")}
        >
          Scramble
        </button>
        <button
          style={{
            ...buttonStyle,
            backgroundColor: "#10b981",
          }}
          onClick={onResolve}
          disabled={disabled || moveHistory.length === 0}
          onMouseEnter={(e) => !disabled && moveHistory.length > 0 && (e.currentTarget.style.backgroundColor = "#059669")}
          onMouseLeave={(e) => !disabled && (e.currentTarget.style.backgroundColor = "#10b981")}
          title={`Resolve ${moveHistory.length} moves`}
        >
          Resolve ({moveHistory.length})
        </button>
        <button
          style={{
            ...buttonStyle,
            backgroundColor: "#ef4444",
          }}
          onClick={onReset}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#dc2626"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ef4444"}
        >
          Reset
        </button>
      </div>

      {/* Move history */}
      {history.length > 0 && (
        <div style={{ marginTop: "15px", fontSize: "12px", color: "#666" }}>
          <strong>Recent moves:</strong> {history.join(' ')}
        </div>
      )}
    </div>
  );
}

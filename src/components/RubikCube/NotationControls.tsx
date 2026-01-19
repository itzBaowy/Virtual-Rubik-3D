import { useState } from "react";

type NotationControlsProps = {
  onMove: (move: string) => void;
  onResolve?: () => void;
  onReset?: () => void;
  onStartRace?: (length: number) => void;
  moveHistory?: string[];
  disabled?: boolean;
  raceMode?: 'idle' | 'showing' | 'ready' | 'racing' | 'finished';
  raceSequence?: string[];
  raceResult?: 'win' | 'lose' | null;
};

export function NotationControls({ 
  onMove, 
  onResolve, 
  onReset, 
  onStartRace,
  moveHistory = [], 
  disabled = false,
  raceMode = 'idle',
  raceSequence = [],
  raceResult = null
}: NotationControlsProps) {
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [raceLength, setRaceLength] = useState("5");

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

  const handleRaceStart = () => {
    const length = parseInt(raceLength);
    if (isNaN(length) || length < 1 || length > 50) {
      alert('Please enter a number between 1 and 50');
      return;
    }
    onStartRace?.(length);
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

      {/* Race Mode Section */}
      <div style={{ 
        marginTop: "20px", 
        paddingTop: "20px", 
        borderTop: "2px solid #667eea"
      }}>
        <div style={{ fontWeight: "bold", marginBottom: "15px", color: "#333", fontSize: "16px" }}>
          🏁 Wanna Race?
        </div>
        
        {raceMode === 'idle' && (
          <div>
            <div style={{ marginBottom: "10px", fontSize: "13px", color: "#666" }}>
              Challenge the cube! Enter sequence length:
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="number"
                value={raceLength}
                onChange={(e) => setRaceLength(e.target.value)}
                min="1"
                max="50"
                style={{
                  width: "80px",
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
                  backgroundColor: "#8b5cf6",
                  flex: 1
                }}
                onClick={handleRaceStart}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#7c3aed"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#8b5cf6"}
              >
                Start Race
              </button>
            </div>
          </div>
        )}

        {raceMode === 'showing' && (
          <div style={{
            padding: "15px",
            backgroundColor: "#f0f9ff",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>
              Watch and memorize:
            </div>
            <div style={{ 
              fontSize: "18px", 
              fontWeight: "bold", 
              color: "#667eea",
              fontFamily: "monospace"
            }}>
              {raceSequence.join(' ')}
            </div>
            <div style={{ fontSize: "12px", color: "#888", marginTop: "10px" }}>
              Cube is executing...
            </div>
          </div>
        )}

        {raceMode === 'ready' && (
          <div style={{
            padding: "20px",
            backgroundColor: "#fef3c7",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "20px", fontWeight: "bold", color: "#f59e0b", marginBottom: "10px" }}>
              ⚡ Are You Ready?
            </div>
            <div style={{ 
              fontSize: "16px", 
              fontWeight: "bold", 
              color: "#667eea",
              fontFamily: "monospace",
              marginBottom: "10px",
              padding: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              borderRadius: "6px"
            }}>
              {raceSequence.join(' ')}
            </div>
            <div style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>
              Press <strong>SPACE</strong> to start racing!
            </div>
            <div style={{ fontSize: "12px", color: "#888" }}>
              The cube will start resolving. Press SPACE again before it finishes!
            </div>
          </div>
        )}

        {raceMode === 'racing' && (
          <div style={{
            padding: "20px",
            backgroundColor: "#fee2e2",
            borderRadius: "8px",
            textAlign: "center",
            animation: "pulse 1s infinite"
          }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#ef4444", marginBottom: "10px" }}>
              🏃 RACING!
            </div>
            <div style={{ 
              fontSize: "16px", 
              fontWeight: "bold", 
              color: "#667eea",
              fontFamily: "monospace",
              marginBottom: "10px",
              padding: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: "6px"
            }}>
              {raceSequence.join(' ')}
            </div>
            <div style={{ fontSize: "14px", color: "#666" }}>
              Press <strong>SPACE</strong> before the cube finishes!
            </div>
          </div>
        )}

        {raceMode === 'finished' && (
          <div style={{
            padding: "20px",
            backgroundColor: raceResult === 'win' ? "#d1fae5" : "#fee2e2",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <div style={{ 
              fontSize: "32px", 
              fontWeight: "bold", 
              color: raceResult === 'win' ? "#10b981" : "#ef4444",
              marginBottom: "10px"
            }}>
              {raceResult === 'win' ? '🎉 YOU WIN!' : '😢 YOU LOSE!'}
            </div>
            <div style={{ 
              fontSize: "14px", 
              fontWeight: "bold", 
              color: "#667eea",
              fontFamily: "monospace",
              marginBottom: "10px",
              padding: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              borderRadius: "6px"
            }}>
              Sequence: {raceSequence.join(' ')}
            </div>
            <div style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>
              {raceResult === 'win' 
                ? 'You\'re faster than the cube!' 
                : 'Bruh, the cube solved itself before you were done!'}
            </div>
            <button
              style={{
                ...buttonStyle,
                backgroundColor: "#8b5cf6",
              }}
              onClick={() => {
                setRaceLength("5");
                onReset?.();
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#7c3aed"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#8b5cf6"}
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Move history */}
      {history.length > 0 && (
        <div style={{ marginTop: "15px", fontSize: "12px", color: "#666" }}>
          <strong>Recent moves:</strong> {history.join(' ')}
        </div>
      )}

      {/* Author credit */}
      <div style={{ 
        marginTop: "15px", 
        paddingTop: "15px", 
        borderTop: "1px solid #e0e0e0",
        fontSize: "11px", 
        color: "#888",
        textAlign: "center"
      }}>
        Created by <a 
          href="https://github.com/itzBaowy" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            color: "#667eea", 
            textDecoration: "none",
            fontWeight: "600"
          }}
          onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
          onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
        >
          @itzBaowy
        </a>
      </div>
    </div>
  );
}

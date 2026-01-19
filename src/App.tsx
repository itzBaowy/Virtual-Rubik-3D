import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { PlayableRubik } from "./components/RubikCube/PlayableRubik";
import { NotationControls } from "./components/RubikCube/NotationControls";
export default function App() {
  const initialPosition: [number, number, number] = [800, 800, 800];
  const [currentMove, setCurrentMove] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [moveQueue, setMoveQueue] = useState<string[]>([]);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [resetKey, setResetKey] = useState(0);

  const getInverseMove = (move: string): string => {
    if (move.includes("2")) {
      return move; // double moves are their own inverse
    }
    if (move.includes("'")) {
      return move.replace("'", ""); // R' → R
    }
    return move + "'"; // R → R'
  };

  const handleMove = (move: string) => {
    console.log('handleMove called:', move);
    setMoveQueue(prev => {
      console.log('Adding to queue:', move, 'current queue length:', prev.length);
      return [...prev, move];
    });
    // add to history
    setMoveHistory(prev => [...prev, move]);
  };

  const handleResolve = () => {
    if (moveHistory.length === 0) return;
    
    const inverseMoves = moveHistory
      .slice()
      .reverse()
      .map(move => getInverseMove(move));
    
    // Thêm tất cả inverse moves vào queue
    inverseMoves.forEach(move => {
      setMoveQueue(prev => [...prev, move]);
    });
    
    // Xóa history vì đã resolve
    setMoveHistory([]);
  };

  const handleReset = () => {
    setMoveQueue([]);
    setMoveHistory([]);
    setCurrentMove(null);
    setIsAnimating(false);
    // Force remount entire Canvas to reset everything
    setResetKey(prev => prev + 1);
  };

  const handleMoveComplete = () => {
    console.log('handleMoveComplete called');
    setIsAnimating(false);
    setCurrentMove(null);
  };

  // move processor
  useEffect(() => {
    console.log('Queue effect:', { queueLength: moveQueue.length, currentMove, isAnimating });
    if (moveQueue.length > 0 && !currentMove && !isAnimating) {
      const [nextMove, ...rest] = moveQueue;
      console.log('Processing next move from queue:', nextMove);
      setMoveQueue(rest);
      setCurrentMove(nextMove);
      setIsAnimating(true);
    }
  }, [moveQueue, currentMove, isAnimating]);

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <Canvas
        key={resetKey}
        camera={{ 
          position: initialPosition, 
          fov: 50,
          near: 0.1,
          far: 10000
        }}
        style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #1e293b 100%)" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
        <directionalLight position={[-5, 5, -5]} intensity={0.6} />
        <pointLight position={[0, 5, 0]} intensity={0.5} />
        <Suspense fallback={null}>
          <PlayableRubik
            modelPath="/rubiks_cube_new.glb"
            scale={2}
            move={currentMove}
            onMoveComplete={handleMoveComplete}
          />
        </Suspense>
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          minDistance={700}
          maxDistance={2000}
          enabled={!isAnimating}
        />
      </Canvas>

      <NotationControls 
        onMove={handleMove}
        onResolve={handleResolve}
        onReset={handleReset}
        moveHistory={moveHistory}
        disabled={isAnimating}
      />

    </div>
  );
}

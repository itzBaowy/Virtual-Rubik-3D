import { useRef, useState, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type PlayableRubikProps = {
  modelPath: string;           
  scale?: number;             
  move?: string | null;       
  onMoveComplete?: () => void;
};

type MoveInfo = {
  axis: 'x' | 'y' | 'z';                   
  angle: number;                             
  filter: (pos: THREE.Vector3) => boolean;  
};

export function PlayableRubik({ 
  modelPath, 
  scale = 1,
  move,
  onMoveComplete
}: PlayableRubikProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelPath); 
  const sceneRef = useRef<THREE.Group | null>(null);  // Clone của scene để tránh mutate original
  
  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);  
  const animationProgress = useRef(0);                    
  const rotatingGroup = useRef<THREE.Group | null>(null);
  const targetRotation = useRef(0);                   
  const rotationAxis = useRef<'x' | 'y' | 'z'>('y');

 
  const parseMoveNotation = (moveNotation: string): MoveInfo => {

    const baseMove = moveNotation.replace(/[2']/g, '');
    const isPrime = moveNotation.includes("'"); 
    const isDouble = moveNotation.includes('2');

    let angle = isPrime ? Math.PI / 2 : -Math.PI / 2;
    if (isDouble) angle *= 2; 

    // Ngưỡng để phân biệt pieces ở các mặt (tuỳ theo kích thước model)
    const threshold = 115  ;


    switch(baseMove) {
      case 'R': 
        return {
          axis: 'x',
          angle: angle,
          filter: (pos) => pos.x > threshold
        };
      case 'L': 
        return {
          axis: 'x',
          angle: -angle, 
          filter: (pos) => pos.x < -threshold
        };
      case 'U':
        return {
          axis: 'y',
          angle: angle,
          filter: (pos) => pos.y > threshold
        };
      case 'D':
        return {
          axis: 'y',
          angle: -angle,
          filter: (pos) => pos.y < -threshold
        };
      case 'F': 
        return {
          axis: 'z',
          angle: angle,
          filter: (pos) => pos.z > threshold
        };
      case 'B':
        return {
          axis: 'z',
          angle: -angle,
          filter: (pos) => pos.z < -threshold
        };
      default:
        return {
          axis: 'y',
          angle: Math.PI / 2,
          filter: () => false
        };
    }
  };


  useEffect(() => {
    console.log('PlayableRubik useEffect:', { move, isAnimating });
    if (move && sceneRef.current) {
      const moveInfo = parseMoveNotation(move);
      console.log('Starting move:', move, moveInfo.axis, moveInfo.angle);
      
      // Tạo temporary group để xoay (position tại tâm [0,0,0])
      const tempGroup = new THREE.Group();
      tempGroup.position.set(0, 0, 0);
      sceneRef.current.add(tempGroup);
      
      // Tìm các pieces cần xoay dựa trên bounding box center
      const piecesToRotate: THREE.Object3D[] = [];
      
      sceneRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.geometry) {
          // Tính bounding box center trong world space
          child.geometry.computeBoundingBox();
          const bbox = child.geometry.boundingBox;
          
          if (bbox) {
            const center = new THREE.Vector3();
            bbox.getCenter(center);        // Center trong local space
            child.localToWorld(center);    // Convert sang world space
            
            // Kiểm tra piece có thuộc mặt cần xoay không?
            if (moveInfo.filter(center)) {
              piecesToRotate.push(child);
            }
          }
        }
      });
      
      // Không tìm thấy pieces → Skip
      if (piecesToRotate.length === 0) {
        sceneRef.current.remove(tempGroup);
        onMoveComplete?.();
        return;
      }
      
      // Attach pieces vào rotating group
      // attach() khác add(): giữ nguyên world position, chỉ đổi parent
      piecesToRotate.forEach(piece => {
        tempGroup.attach(piece);
      });
      
      rotatingGroup.current = tempGroup;
      targetRotation.current = moveInfo.angle;
      rotationAxis.current = moveInfo.axis;
      animationProgress.current = 0;
      setIsAnimating(true);
    }
  }, [move]);


  useFrame(() => {
    if (!isAnimating || !rotatingGroup.current || !sceneRef.current) return;

    animationProgress.current += 0.1; // Tăng tiến trình (tốc độ animation)

    if (animationProgress.current >= 1) {
      animationProgress.current = 1;
      const finalRotation = targetRotation.current;
      
      // Set góc xoay chính xác cuối cùng
      if (rotationAxis.current === 'x') {
        rotatingGroup.current.rotation.x = finalRotation;
      } else if (rotationAxis.current === 'y') {
        rotatingGroup.current.rotation.y = finalRotation;
      } else {
        rotatingGroup.current.rotation.z = finalRotation;
      }

      // Re-attach pieces về scene chính (giữ lại vị trí đã xoay)
      const pieces: THREE.Object3D[] = [];
      rotatingGroup.current.children.slice().forEach(child => pieces.push(child));
      pieces.forEach(piece => {
        sceneRef.current!.attach(piece);
      });

      // Xóa temporary group
      sceneRef.current.remove(rotatingGroup.current);
      rotatingGroup.current = null;
      
      // Gọi callback để trigger move tiếp theo trong queue
      console.log('Animation complete, calling onMoveComplete');
      setIsAnimating(false);
      setTimeout(() => {
        onMoveComplete?.();
      }, 0);
    } else {
      // Apply easing curve để animation mượt (tăng tốc đầu, giảm tốc cuối)
      const eased = easeInOutCubic(animationProgress.current);
      const currentRotation = targetRotation.current * eased;

      if (rotationAxis.current === 'x') {
        rotatingGroup.current.rotation.x = currentRotation;
      } else if (rotationAxis.current === 'y') {
        rotatingGroup.current.rotation.y = currentRotation;
      } else {
        rotatingGroup.current.rotation.z = currentRotation;
      }
    }
  });


  if (!sceneRef.current) {
    sceneRef.current = scene.clone();
    
    sceneRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Clone materials để không ảnh hưởng các instance khác
        if (Array.isArray(child.material)) {
          child.material = child.material.map(mat => mat.clone());
        } else {
          child.material = child.material.clone();
        }
      }
    });
  }

  return (
    <group 
      ref={groupRef} 
      scale={scale}
    >
      <primitive object={sceneRef.current} />
    </group>
  );
}

/**
 * Easing function: Cubic ease-in-out
 * 
 * Làm animation mượt mà hơn:
 * - t < 0.5: Tăng tốc (ease-in) - bắt đầu chậm, tăng dần
 * - t > 0.5: Giảm tốc (ease-out) - nhanh dần, kết thúc chậm
 * 
 * Input: t (0 → 1, linear progress)
 * Output: eased value (0 → 1, với curve)
 */
function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t                      // Ease-in: y = 4x³
    : 1 - Math.pow(-2 * t + 2, 3) / 2;   // Ease-out: y = 1 - (2-2x)³/2
}

// Preload model để tránh lag khi mount component
useGLTF.preload("/rubiks_cube_new.glb");

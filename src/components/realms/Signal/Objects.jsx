import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Text } from '@react-three/drei'

// Hover text formatting 
function UnfurlingText({ textPrimary, textSecondary, isHovered }) {
  // Use a simple scale + opacity reveal (simulating unfurling mask)
  const groupRef = useRef()
  
  useFrame(() => {
     if (groupRef.current) {
        const targetScale = isHovered ? 1.0 : 0.0
        const targetOp = isHovered ? 1.0 : 0.0
        groupRef.current.scale.y += (targetScale - groupRef.current.scale.y) * 0.1
        groupRef.current.position.y = -1.2 - (1.0 - groupRef.current.scale.y) * 0.5
        // opacity lerp would go to child materials
     }
  })

  return (
    <group ref={groupRef}>
      <Text
        fontSize={0.2}
        color="#F0F0F0"
        anchorX="center"
        anchorY="top"
        position={[0, 0, 0]}
        font={undefined}
        letterSpacing={0.05}
      >
        {textPrimary}
      </Text>
      <Text
        fontSize={0.06}
        color="#C9A84C"
        anchorX="center"
        anchorY="top"
        position={[0, -0.4, 0]}
        font={undefined}
        letterSpacing={0.2}
      >
        {textSecondary}
      </Text>
    </group>
  )
}

// ── Object A: Origami Crane (approximate low-poly) ──
export function OrigamiCrane({ hovered, onClick, position, rotationOffset }) {
  const meshRef = useRef()
  const ringRef = useRef()

  const craneGeo = useMemo(() => {
    // Highly abstract low poly bird shape
    const geo = new THREE.BufferGeometry()
    const vertices = new Float32Array([
      // Body (diamond)
      0.0, 0.2, 0.0,
     -0.1, 0.0, 0.2,
      0.1, 0.0, 0.2,
      
      0.0, 0.2, 0.0,
      0.1, 0.0, 0.2,
      0.0,-0.1, 0.0,
      
      0.0, 0.2, 0.0,
      0.0,-0.1, 0.0,
     -0.1, 0.0, 0.2,

      // Left Wing
      0.0, 0.2, 0.0,
     -0.6, 0.4, -0.2,
     -0.1, 0.0, 0.2,
     
      // Right Wing
      0.0, 0.2, 0.0,
      0.1, 0.0, 0.2,
      0.6, 0.4, -0.2,
      
      // Neck
      0.1, 0.0, 0.2,
      0.0, 0.5, 0.3,
     -0.1, 0.0, 0.2,

      // Tail
      0.0, 0.2, 0.0,
     -0.1, 0.0, 0.2,
      0.0, 0.1, -0.5,

      0.0, 0.2, 0.0,
      0.0, 0.1, -0.5,
      0.1, 0.0, 0.2,
    ])
    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    geo.computeVertexNormals()
    return geo
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    
    // Ambient hover breathing
    const baseRot = rotationOffset || 0
    let targetRotationY = baseRot + t * 0.2
    let targetScale = 1.0

    if (hovered) {
      targetRotationY = 0 // face front
      targetScale = 1.25
    }
    
    meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.1
    // Lock to face front pitch
    meshRef.current.rotation.x += ((hovered ? Math.PI/12 : Math.sin(t*0.5)*0.1) - meshRef.current.rotation.x) * 0.1

    meshRef.current.scale.lerp(new THREE.Vector3().setScalar(targetScale), 0.1)
    
    meshRef.current.position.y = position[1] + Math.sin(t + position[0]) * 0.1

    if (ringRef.current) {
        ringRef.current.rotation.z += 0.01
        ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t)*0.2
        ringRef.current.scale.lerp(new THREE.Vector3().setScalar(hovered ? 1.5 : 0.0), 0.1)
        ringRef.current.visible = ringRef.current.scale.x > 0.01
    }
  })

  return (
    <group position={[position[0], 0, position[2]]}>
      <group ref={meshRef}>
        <mesh 
          geometry={craneGeo} 
          onClick={onClick} 
        >
          <meshStandardMaterial 
            color="#FFFFFF" 
            emissive="#C9A84C"
            emissiveIntensity={0.2}
            transparent
            opacity={0.9}
            wireframe={true}
            side={THREE.DoubleSide}
          />
        </mesh>

        <mesh ref={ringRef} visible={false}>
          <torusGeometry args={[0.5, 0.005, 16, 64]} />
          <meshBasicMaterial color="#C9A84C" transparent opacity={0.6} />
        </mesh>
      </group>
      
      <UnfurlingText 
         textPrimary="rniteshvarma@gmail.com" 
         textSecondary="WRITE SOMETHING WORTH READING."
         isHovered={hovered} 
      />
    </group>
  )
}

// ── Object B: Compass ──
export function NavigationCompass({ hovered, onClick, position, rotationOffset }) {
  const meshRef = useRef()
  const ringRef = useRef()
  const needleRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    
    let targetRotationY = rotationOffset + t * 0.3
    let targetScale = 1.0

    if (hovered) {
      targetRotationY = 0 
      targetScale = 1.25
    }
    
    meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.1
    meshRef.current.rotation.x += ((hovered ? Math.PI/4 : 0) - meshRef.current.rotation.x) * 0.1
    meshRef.current.scale.lerp(new THREE.Vector3().setScalar(targetScale), 0.1)
    meshRef.current.position.y = position[1] + Math.cos(t + position[0]) * 0.1

    if (needleRef.current) {
        needleRef.current.rotation.z = t * 2.0
    }

    if (ringRef.current) {
        ringRef.current.rotation.z -= 0.01
        ringRef.current.scale.lerp(new THREE.Vector3().setScalar(hovered ? 1.5 : 0.0), 0.1)
        ringRef.current.visible = ringRef.current.scale.x > 0.01
    }
  })

  return (
    <group position={[position[0], 0, position[2]]}>
      <group ref={meshRef}>
        {/* Outer Ring */}
        <mesh onClick={onClick}>
          <torusGeometry args={[0.4, 0.05, 16, 32]} />
          <meshStandardMaterial metalness={1.0} roughness={0.1} color="#AAAAAA" />
        </mesh>
        
        {/* Center Pivot */}
        <mesh>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial metalness={1.0} roughness={0.1} color="#C9A84C" />
        </mesh>

        {/* Needle */}
        <mesh ref={needleRef}>
          <octahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial metalness={1.0} roughness={0.2} color="#00F5FF" />
        </mesh>

        <mesh ref={ringRef} visible={false}>
          <torusGeometry args={[0.6, 0.005, 16, 64]} />
          <meshBasicMaterial color="#C9A84C" transparent opacity={0.6} />
        </mesh>
      </group>
      
      <UnfurlingText 
         textPrimary="linkedin.com/in/niteshvarma" 
         textSecondary="FIND YOUR BEARING."
         isHovered={hovered} 
      />
    </group>
  )
}

// ── Object C: Code Fragment ──
export function CodeFragment({ hovered, onClick, position, rotationOffset }) {
  const meshRef = useRef()
  const ringRef = useRef()
  
  const codeString = `/* \n  if (you.need(creativity)) {\n    return me.call();\n  }\n*/`

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    
    let targetRotationY = rotationOffset - t * 0.1
    let targetScale = 1.0

    if (hovered) {
      targetRotationY = 0 
      targetScale = 1.25
    }
    
    meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.1
    meshRef.current.rotation.x += ((hovered ? 0 : Math.sin(t)*0.1) - meshRef.current.rotation.x) * 0.1
    meshRef.current.scale.lerp(new THREE.Vector3().setScalar(targetScale), 0.1)
    meshRef.current.position.y = position[1] + Math.sin(t*0.5 + position[0]) * 0.1

    if (ringRef.current) {
        ringRef.current.rotation.z += 0.015
        ringRef.current.scale.lerp(new THREE.Vector3().setScalar(hovered ? 1.5 : 0.0), 0.1)
        ringRef.current.visible = ringRef.current.scale.x > 0.01
    }
  })

  return (
    <group position={[position[0], 0, position[2]]}>
      <group ref={meshRef}>
        <mesh onClick={onClick}>
          <planeGeometry args={[1.2, 0.8]} />
          <meshStandardMaterial 
            color="#080C14" 
            transparent 
            opacity={0.8}
            side={THREE.DoubleSide}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Glow border */}
        <mesh position={[0,0,-0.01]}>
           <planeGeometry args={[1.22, 0.82]} />
           <meshBasicMaterial color="#00F5FF" transparent opacity={0.2} />
        </mesh>

        <Text
          position={[0, 0, 0.01]}
          fontSize={0.08}
          color="#00F5FF"
          anchorX="center"
          anchorY="middle"
          font={undefined} // default monospace
        >
          {codeString}
        </Text>

        <mesh ref={ringRef} visible={false}>
          <torusGeometry args={[0.8, 0.005, 16, 64]} />
          <meshBasicMaterial color="#C9A84C" transparent opacity={0.6} />
        </mesh>
      </group>
      
      <UnfurlingText 
         textPrimary="github.com/niteshvarma" 
         textSecondary="READ THE RECEIPTS."
         isHovered={hovered} 
      />
    </group>
  )
}

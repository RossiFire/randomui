import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Group, Mesh } from 'three'

export function MouseModel(props: React.ComponentPropsWithoutRef<'group'>) {
  const { nodes, materials } = useGLTF('/mouse.glb')

  const ref = useRef<Group>(null)

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.z += 0.02;
  })

  return (
      <group {...props} ref={ref}>
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Object_2 as Mesh)?.geometry}
          material={materials.material}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Object_3 as Mesh)?.geometry}
          material={materials.material_1}
        />
      </group>
  )
}

useGLTF.preload('/mouse.glb')

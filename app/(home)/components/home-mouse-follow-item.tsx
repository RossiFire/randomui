"use client";

import { MouseModel } from "@/components/threed-mouse";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";


export default function HomeMouseFollowItem() {
    return (
        <>
            <div className="size-20 rounded-full mx-auto overflow-hidden pointer-events-none touch-none">
                <Canvas 
                    key="mouse-canvas"
                    style={{ pointerEvents: 'none' }}
                    className="w-full h-full"
                    gl={{ 
                        alpha: true,
                        antialias: true,
                        preserveDrawingBuffer: false,
                    }}
                    camera={{ 
                        position: [0, 0, 500], 
                        fov: 50,
                        near: 1,
                        far: 4000
                    }}
                >
                    <Suspense fallback={null}>
                        <ambientLight intensity={1.5} />
                        <pointLight position={[5, 5, 5]} intensity={1} />
                        <pointLight position={[-5, -5, -5]} intensity={0.5} />
                        <MouseModel 
                            position={[90, -80, 100]} 
                            scale={0.2} 
                            rotation={[-1.9, -0.6, -2.7]} 
                        />
                    </Suspense>
                </Canvas>
            </div>
        </>
    )
}
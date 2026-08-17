"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { lerp } from "three/src/math/MathUtils.js";

const fragmentShader = `
uniform float u_time;
uniform float u_hover;
varying vec2 vUv;

void main() {
    vec2 st = vUv;
    
    // Liquid waves driven by time and amplified by hover
    float wave = sin(st.y * 15.0 + u_time * 2.0) * 0.02 * u_hover;
    float wave2 = cos(st.x * 10.0 - u_time * 1.5) * 0.02 * u_hover;
    
    st.x += wave;
    st.y += wave2;
    
    // Base gradient colors representing the "dark/glass" aesthetic
    vec3 color1 = vec3(0.08, 0.08, 0.08); // very dark grey
    vec3 color2 = vec3(0.18, 0.18, 0.18); // slightly lighter
    
    // Diagonal mixed gradient
    float mixVal = st.x * st.y;
    vec3 baseColor = mix(color1, color2, mixVal + sin(u_time * 0.5) * 0.1);
    
    // RGB split effect applied during hover state interpolation
    float r = mix(color1.r, color2.r, mixVal + wave * 2.0);
    float g = baseColor.g;
    float b = mix(color1.b, color2.b, mixVal - wave2 * 2.0);
    
    // Add white shine when heavily hovered
    vec3 finalColor = vec3(r, g, b) + (u_hover * 0.05);

    gl_FragColor = vec4(finalColor, 1.0);
}
`;

const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0); // Fullscreen quad
}
`;

const LiquidPlane = ({ isHovered }: { isHovered: boolean }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const hoverState = useRef(0);

  useFrame((state, delta) => {
    if (materialRef.current) {
      // Lerp the hover state for smooth transition
      hoverState.current = lerp(hoverState.current, isHovered ? 1 : 0, delta * 5.0);
      
      materialRef.current.uniforms.u_time.value = state.clock.elapsedTime;
      materialRef.current.uniforms.u_hover.value = hoverState.current;
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          u_time: { value: 0 },
          u_hover: { value: 0 },
        }}
      />
    </mesh>
  );
};

export default function ProjectShader({ isHovered }: { isHovered: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden mix-blend-lighten opacity-60">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1.5]}
      >
        <LiquidPlane isHovered={isHovered} />
      </Canvas>
    </div>
  );
}

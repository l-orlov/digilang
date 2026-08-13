/**
 * Campo WebGL compartido para la galería de estilos: un único <Canvas> (no
 * uno por card, para no agotar el límite de contextos WebGL del navegador)
 * que dibuja un plano por imagen, sincronizado cada frame con la posición
 * real del <div> correspondiente en el DOM (así funciona sin importar qué
 * transform CSS/GSAP esté moviendo la fila por debajo). Al hacer hover
 * sobre el card DOM, el plano correspondiente se distorsiona con un shader
 * de ondas (efecto típico de Lusion en las miniaturas de proyectos).
 *
 * Importante: las coordenadas de getBoundingClientRect() son relativas al
 * viewport del navegador, no al canvas — hay que restar la posición del
 * propio canvas (que puede estar lejos del top de la página) antes de
 * convertirlas a unidades de mundo de three.js.
 */
import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Mesh, ShaderMaterial, SRGBColorSpace, Vector2 } from 'three';

const VERTEX_SHADER = /* glsl */ `
  uniform float uHover;
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 pos = position;
    float dist = distance(uv, vec2(0.5));
    pos.z += sin(dist * 14.0 - uTime * 3.0) * 0.07 * uHover;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uHover;
  varying vec2 vUv;
  void main() {
    vec2 dir = normalize(vUv - 0.5 + 0.0001);
    float dist = distance(vUv, vec2(0.5));
    vec2 offset = dir * sin(dist * 14.0 - uHover * 2.4) * 0.018 * uHover;
    gl_FragColor = vec4(texture2D(uTexture, vUv + offset).rgb, 1.0);
  }
`;

interface PlaneProps {
  url: string;
  elRef: React.RefObject<HTMLDivElement | null>;
  hoverRef: React.RefObject<boolean>;
}

function DistortPlane({ url, elRef, hoverRef }: PlaneProps) {
  const texture = useTexture(url);
  const mesh = useRef<Mesh>(null);
  const material = useRef<ShaderMaterial>(null);
  const hoverValue = useRef(0);
  const { size, viewport, gl } = useThree();

  useEffect(() => {
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture]);

  useFrame((state) => {
    const el = elRef.current;
    if (!el || !mesh.current) return;

    const canvasRect = gl.domElement.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    const px = rect.left + rect.width / 2 - canvasRect.left;
    const py = rect.top + rect.height / 2 - canvasRect.top;

    const worldX = (px - size.width / 2) * (viewport.width / size.width);
    const worldY = -(py - size.height / 2) * (viewport.height / size.height);
    const worldW = rect.width * (viewport.width / size.width);
    const worldH = rect.height * (viewport.height / size.height);

    mesh.current.position.set(worldX, worldY, 0);
    mesh.current.scale.set(worldW, worldH, 1);
    mesh.current.visible = px + rect.width > -50 && px - rect.width < size.width + 50;

    const target = hoverRef.current ? 1 : 0;
    hoverValue.current += (target - hoverValue.current) * 0.08;
    if (material.current) {
      material.current.uniforms.uHover.value = hoverValue.current;
      material.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        ref={material}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={{
          uTexture: { value: texture },
          uHover: { value: 0 },
          uTime: { value: 0 },
          uMouse: { value: new Vector2(0.5, 0.5) },
        }}
      />
    </mesh>
  );
}

interface DistortFieldProps {
  images: string[];
  elRefs: React.RefObject<HTMLDivElement | null>[];
  hoverRefs: React.RefObject<boolean>[];
}

export function DistortField({ images, elRefs, hoverRefs }: DistortFieldProps) {
  return (
    <Canvas
      className="dl-styles__gl"
      orthographic={false}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <Suspense fallback={null}>
        {images.map((url, i) => (
          <DistortPlane key={url} url={url} elRef={elRefs[i]} hoverRef={hoverRefs[i]} />
        ))}
      </Suspense>
    </Canvas>
  );
}

/**
 * Fondo "banco de calibración": el cristal cuelga entre dos garras metálicas
 * (arriba/abajo), sobre un piso con grilla técnica y un charco de luz debajo
 * — vende la idea de "pieza de precisión en un stand de pruebas" en vez de
 * flotar en el vacío. Las garras están fijas fuera del radio máximo que
 * puede alcanzar una cara al abrirse (ver el comentario en JAW_Y), así que
 * nunca se cruzan con el cristal sin importar cómo lo arrastres.
 *
 * Las dos garras son el mismo pedestal ancho — la superior un poco más
 * grande, para que le entre el nombre "DigiLang" grabado en el frente,
 * curvado siguiendo la superficie del cilindro (no una placa aparte).
 *
 * Todo esto es puro fondo de la fase "afuera": a medida que la cámara entra
 * al cristal (mismo `insideDepth` que ya usan `Lighting` y `Crystal` en
 * CoreScene.tsx) se desvanece, porque adentro no se vería igual (la cámara
 * queda rodeada de caras) y no debe competir con los paneles de texto del
 * viaje.
 */
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  AdditiveBlending,
  CanvasTexture,
  MathUtils,
  MeshBasicMaterial,
  MeshStandardMaterial,
  RepeatWrapping,
  SRGBColorSpace,
  type Mesh,
} from 'three';
import { APPROACH_END } from '@/home/components/CoreScene';

// Distancia mínima seguro que debe guardar cualquier pieza del stand sobre
// el eje Y respecto del cristal (radio 1.3 + su desplazamiento máximo con
// REST_GAP/HOVER_PUSH_STRENGTH, ver CoreScene.tsx, ~1.6 en total) para que
// nunca lo toque, sin importar cómo se arrastre.
const SAFE_Y = 1.85;

// Garra (pedestal ancho) — la cara NEAR mira al cristal, la cara FAR mira
// al collar/varilla. Mismas medidas arriba y abajo — solo la de arriba
// suma la franja grabada con el nombre.
const ROD_RADIUS = 0.05;
const ROD_HEIGHT = 1.0;
const COLLAR_RADIUS_FAR = 0.075;
const COLLAR_HEIGHT = 0.16;
const JAW_Y = SAFE_Y;

const JAW_RADIUS_NEAR = 0.42;
const JAW_RADIUS_FAR = 0.48;
const JAW_HEIGHT = 0.3;
const COLLAR_RADIUS_NEAR = JAW_RADIUS_FAR;
const COLLAR_Y = JAW_Y + JAW_HEIGHT / 2 + COLLAR_HEIGHT / 2;
const ROD_Y = COLLAR_Y + COLLAR_HEIGHT / 2 + ROD_HEIGHT / 2;

// Franja grabada: un cilindro parcial (no una placa) apenas más ancho que
// la garra, con el texto curvado siguiendo esa superficie. Solo en la
// garra superior.
const TEXT_ARC_FRACTION = 0.38;
const TEXT_ARC_LENGTH = TEXT_ARC_FRACTION * Math.PI * 2;
const TEXT_BAND_RADIUS = (JAW_RADIUS_NEAR + JAW_RADIUS_FAR) / 2 + 0.006;
const TEXT_BAND_HEIGHT = JAW_HEIGHT * 0.55;

const FLOOR_Y = -3.3;
const RAIL_X = 1.85;
const RAIL_Z = 0.4;
const RAIL_HEIGHT = 2.6;
const SCAN_AMPLITUDE = 1.15;

function createGridTexture(): CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0c0c0e';
  ctx.fillRect(0, 0, size, size);

  const cells = 8;
  const step = size / cells;
  ctx.strokeStyle = '#3a3a3f';
  ctx.lineWidth = 1;
  for (let i = 0; i <= cells; i++) {
    const p = i * step;
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, p);
    ctx.lineTo(size, p);
    ctx.stroke();
  }

  ctx.fillStyle = 'rgba(252, 163, 17, 0.35)';
  for (let i = 0; i <= cells; i += 2) {
    for (let j = 0; j <= cells; j += 2) {
      ctx.beginPath();
      ctx.arc(i * step, j * step, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(7, 7);
  return texture;
}

// Textura de la franja grabada: SOLO el texto, fondo transparente — nada de
// relleno detrás. Un fondo opaco (aunque fuera oscuro) tapaba el metal real
// de la garra con sus reflejos propios; así se ve la garra tal cual, con
// las letras flotando encima. Sin marco recto tampoco: al envolverse en un
// cilindro, una línea recta se ve "ondulada" y rompe la lectura. El
// contraste sale solo del color y de un trazo oscuro fino alrededor de las
// letras. Se envuelve en un cilindro parcial, así que el texto sale
// realmente curvado, no una placa plana.
function createEngravingTexture(text: string): CanvasTexture {
  const width = 1536;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.font = '700 160px Tektur, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 12;
  ctx.strokeStyle = '#000000';
  ctx.strokeText(text, width / 2, height / 2 + 8);
  ctx.fillStyle = '#fca311';
  ctx.fillText(text, width / 2, height / 2 + 8);

  // Sin esto, el naranja dibujado en el canvas (sRGB) se interpreta como
  // datos lineales y sale más pálido/amarillento que el mismo hex puesto
  // directo en `color` de un material — quedaba desparejo con el resto.
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function createGlowTexture(): CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(252, 163, 17, 0.9)');
  gradient.addColorStop(1, 'rgba(252, 163, 17, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  return new CanvasTexture(canvas);
}

export function CalibrationRig({ progressRef }: { progressRef: React.RefObject<number> }) {
  const scanMesh = useRef<Mesh>(null);

  const gridTexture = useMemo(() => createGridTexture(), []);
  const glowTexture = useMemo(() => createGlowTexture(), []);
  const engravingTexture = useMemo(() => createEngravingTexture('DigiLang'), []);

  const metalMaterial = useMemo(
    () => new MeshStandardMaterial({ color: '#2a2a2e', metalness: 0.85, roughness: 0.35, transparent: true }),
    []
  );
  const accentMaterial = useMemo(
    () => new MeshBasicMaterial({ color: '#fca311', toneMapped: false, transparent: true }),
    []
  );
  const floorMaterial = useMemo(
    () => new MeshBasicMaterial({ map: gridTexture, transparent: true }),
    [gridTexture]
  );
  const glowMaterial = useMemo(
    () =>
      new MeshBasicMaterial({
        map: glowTexture,
        transparent: true,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
    [glowTexture]
  );
  const railMaterial = useMemo(
    () => new MeshStandardMaterial({ color: '#1c1c1f', metalness: 0.7, roughness: 0.5, transparent: true }),
    []
  );
  const scanMaterial = useMemo(
    () => new MeshBasicMaterial({ color: '#fca311', toneMapped: false, transparent: true }),
    []
  );
  const engravingMaterial = useMemo(
    () => new MeshBasicMaterial({ map: engravingTexture, toneMapped: false, transparent: true }),
    [engravingTexture]
  );

  useFrame((state) => {
    const p = progressRef.current ?? 0;
    const insideDepth = MathUtils.smoothstep(p, APPROACH_END, 1);
    const fade = MathUtils.lerp(1, 0, insideDepth);

    metalMaterial.opacity = fade;
    accentMaterial.opacity = fade * 0.9;
    floorMaterial.opacity = fade * 0.85;
    glowMaterial.opacity = fade * 0.5;
    railMaterial.opacity = fade * 0.6;
    scanMaterial.opacity = fade * 0.5;
    engravingMaterial.opacity = fade;

    if (scanMesh.current) {
      scanMesh.current.position.y = Math.sin(state.clock.elapsedTime * 1.05) * SCAN_AMPLITUDE;
    }
  });

  return (
    <group>
      {/* Garra superior — con el nombre grabado en el frente */}
      <mesh position={[0, ROD_Y, 0]} material={metalMaterial}>
        <cylinderGeometry args={[ROD_RADIUS, ROD_RADIUS, ROD_HEIGHT, 12]} />
      </mesh>
      <mesh position={[0, COLLAR_Y, 0]} material={metalMaterial}>
        <cylinderGeometry args={[COLLAR_RADIUS_FAR, COLLAR_RADIUS_NEAR, COLLAR_HEIGHT, 16]} />
      </mesh>
      <mesh position={[0, JAW_Y, 0]} material={metalMaterial}>
        <cylinderGeometry args={[JAW_RADIUS_FAR, JAW_RADIUS_NEAR, JAW_HEIGHT, 32]} />
      </mesh>
      <mesh position={[0, JAW_Y - JAW_HEIGHT / 2, 0]} rotation={[Math.PI / 2, 0, 0]} material={accentMaterial}>
        <torusGeometry args={[JAW_RADIUS_NEAR * 0.85, 0.016, 8, 32]} />
      </mesh>
      <mesh position={[0, JAW_Y, 0]} material={engravingMaterial}>
        <cylinderGeometry
          args={[
            TEXT_BAND_RADIUS,
            TEXT_BAND_RADIUS,
            TEXT_BAND_HEIGHT,
            48,
            1,
            true,
            -TEXT_ARC_LENGTH / 2,
            TEXT_ARC_LENGTH,
          ]}
        />
      </mesh>

      {/* Garra inferior — mismo tamaño, sin grabado */}
      <mesh position={[0, -ROD_Y, 0]} material={metalMaterial}>
        <cylinderGeometry args={[ROD_RADIUS, ROD_RADIUS, ROD_HEIGHT, 12]} />
      </mesh>
      <mesh position={[0, -COLLAR_Y, 0]} material={metalMaterial}>
        <cylinderGeometry args={[COLLAR_RADIUS_NEAR, COLLAR_RADIUS_FAR, COLLAR_HEIGHT, 16]} />
      </mesh>
      <mesh position={[0, -JAW_Y, 0]} material={metalMaterial}>
        <cylinderGeometry args={[JAW_RADIUS_NEAR, JAW_RADIUS_FAR, JAW_HEIGHT, 24]} />
      </mesh>
      <mesh position={[0, -JAW_Y + JAW_HEIGHT / 2, 0]} rotation={[Math.PI / 2, 0, 0]} material={accentMaterial}>
        <torusGeometry args={[JAW_RADIUS_NEAR * 0.85, 0.016, 8, 32]} />
      </mesh>

      {/* Piso con grilla + charco de luz debajo del cristal */}
      <mesh position={[0, FLOOR_Y, 0]} rotation={[-Math.PI / 2, 0, 0]} material={floorMaterial}>
        <planeGeometry args={[14, 14]} />
      </mesh>
      <mesh position={[0, FLOOR_Y + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} material={glowMaterial}>
        <planeGeometry args={[2.4, 2.4]} />
      </mesh>

      {/* Riel lateral con plaqueta de escaneo en movimiento */}
      <mesh position={[RAIL_X, 0, RAIL_Z]} material={railMaterial}>
        <cylinderGeometry args={[0.015, 0.015, RAIL_HEIGHT, 8]} />
      </mesh>
      <mesh ref={scanMesh} position={[RAIL_X, 0, RAIL_Z]} material={scanMaterial}>
        <boxGeometry args={[0.12, 0.03, 0.02]} />
      </mesh>
    </group>
  );
}

/**
 * Escena WebGL del "viaje al núcleo": el mismo icosaedro facetado que
 * antes tenía HeroScene.tsx (ver esa técnica — geometría no indexada +
 * `aCentroid` + ExplodeMaterial vía onBeforeCompile), pero acá la cámara
 * viaja según `progressRef` (0..1, escrito desde fuera por el
 * ScrollTrigger de CoreJourney.tsx) en vez de quedarse fija: de "objeto
 * que se acerca" a "estamos adentro". El material usa `side: DoubleSide`
 * para que las caras no desaparezcan al cruzar la cámara al interior.
 *
 * Las caras son prismas triangulares (con espesor real, no planos) con una
 * separación fija chica entre sí (REST_GAP), que deja ver ese espesor como
 * una línea de profundidad aun en reposo — pero solo "afuera": adentro se
 * cierra rápido (ver el fade de REST_GAP en el useFrame de Crystal), porque
 * de cerca esa separación deja huecos visibles en los vértices donde
 * convergen varias caras. Se puede arrastrar para girarlo
 * (con inercia), y además gira solo (lento, autónomo) mientras la cámara
 * está "afuera". En vez de que TODAS las caras se separen igual al pasar el
 * mouse, se raycastea el punto exacto bajo el cursor sobre el cristal y
 * solo la cara bajo ESE punto se entreabre un poco, revelando sus paredes
 * laterales (mismo tipo de técnica shader que ya usamos en
 * StylesShowcase/DistortImage.tsx, pero en 3D).
 *
 * Solo se monta en el camino "enhanced" (puntero fino, sin reduced-motion,
 * no mobile) — el fallback de CoreJourney no usa esta escena en absoluto.
 */
import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import { useFinePointer, useIsMobile } from '@/shared/hooks/useReducedMotion';
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  IcosahedronGeometry,
  MathUtils,
  MeshPhysicalMaterial,
  Vector3,
  type MeshPhysicalMaterialParameters,
} from 'three';
import type { AmbientLight, DirectionalLight, Group, Mesh } from 'three';
import { CalibrationRig } from '@/home/components/CalibrationRig';
import { JourneyContent } from '@/home/components/JourneyContent';
import type { JourneyFacet } from '@/home/content';

/** Cuánto se empuja hacia afuera la cara bajo el cursor, además del
 * REST_GAP — apenas, solo se entreabre un poco más al pasar el mouse. */
const HOVER_PUSH_STRENGTH = 0.22;
/** Radio (en espacio local del cristal) del área que reacciona al cursor —
 * chico a propósito, para que reaccione la cara puntual, no un racimo. */
const HOVER_PUSH_RADIUS = 0.38;
/** Espesor de cada cara (prisma triangular) — le da profundidad real: al
 * entreabrirse se ven las paredes laterales, no un plano flotando. */
const FACET_DEPTH = 0.11;
/** Separación fija entre caras aun en reposo (no llegan a tocarse del
 * todo) — así el espesor de FACET_DEPTH se ve siempre como una línea de
 * profundidad entre caras, no solo al pasar el mouse. */
const REST_GAP = 0.045;

const CAMERA_START_Z = 6;
const CAMERA_THRESHOLD_Z = 1.6;
// Centro geométrico del cristal — equidistante de todas las caras. La
// cámara llega hasta acá una sola vez (fase de "asentado", ver
// CAMERA_SETTLE_END) y after eso NUNCA vuelve a moverse en Z: el resto del
// recorrido "adentro" es puro giro (camera.rotation.y en CameraRig), no
// traslación — así la cámara jamás vuelve a salir del cristal.
const CAMERA_INSIDE_Z = 0;
/** Progreso (0..1) donde termina el "acercamiento" y arranca "adentro". */
export const APPROACH_END = 0.15;
// Ventana corta (6% del scroll) justo después de cruzar el umbral, donde la
// cámara todavía se termina de asentar en el centro antes de que el resto
// del recorrido pase a ser solo rotación.
const CAMERA_SETTLE_END = APPROACH_END + 0.06;
/** Progreso (0..1) donde termina el giro "adentro" y arranca el outro —
 * compartido con CoreJourney.tsx para que el giro de cámara y el cambio de
 * panel de cada facet queden siempre sincronizados entre sí. */
export const INSIDE_END = 0.92;

// Solo 3 colores — con 8 (rojo/naranja/amarillo/verde/turquesa/azul/violeta/
// magenta cíclico por índice) casi cada cara quedaba pegada a una vecina de
// tono totalmente distinto: con ~80 caras chicas eso se leía como
// "confetti", no como un objeto diseñado. Menos colores + asignación por
// COLOREADO DE GRAFO (ver `colorFaces` — nunca dos caras que comparten una
// arista quedan con el mismo color) da bloques limpios y deliberados, más
// cerca de una piedra tallada o un patrón gráfico que de ruido aleatorio.
const PASTEL_PALETTE = [
  '#C1573D', // terracota
  '#1F6F6B', // verde azulado profundo
  '#E8DCC8', // crema cálido
];

/** Dos caras son vecinas si comparten una arista (2 vértices), no solo un
 * vértice — compartir un solo vértice (donde convergen 5-6 caras) no basta,
 * ese punto lo tocan caras que ni se rozan entre sí. Se arma comparando
 * posiciones (con redondeo, porque la geometría no está indexada) en vez de
 * índices de vértice, así funciona directo sobre `basePos`. */
function buildFaceAdjacency(basePos: BufferGeometry['attributes']['position'], faceCount: number): number[][] {
  const v = new Vector3();
  const keyOf = (i: number) => {
    v.fromBufferAttribute(basePos, i);
    return `${v.x.toFixed(4)},${v.y.toFixed(4)},${v.z.toFixed(4)}`;
  };
  const edgeFaces = new Map<string, number[]>();
  for (let f = 0; f < faceCount; f++) {
    const i0 = f * 3;
    const keys = [keyOf(i0), keyOf(i0 + 1), keyOf(i0 + 2)];
    for (let e = 0; e < 3; e++) {
      const a = keys[e];
      const b = keys[(e + 1) % 3];
      const edgeKey = a < b ? `${a}|${b}` : `${b}|${a}`;
      let faces = edgeFaces.get(edgeKey);
      if (!faces) {
        faces = [];
        edgeFaces.set(edgeKey, faces);
      }
      faces.push(f);
    }
  }
  const adjacency: number[][] = Array.from({ length: faceCount }, () => []);
  for (const faces of edgeFaces.values()) {
    if (faces.length === 2) {
      const [a, b] = faces;
      adjacency[a].push(b);
      adjacency[b].push(a);
    }
  }
  return adjacency;
}

/** Colorea cada cara (índice de paleta, no el color en sí) de forma que
 * ninguna cara comparta color con una vecina — backtracking simple, rápido
 * de sobra para ~80 caras con solo 3 vecinos cada una. Un icosaedro
 * subdividido es un grafo cúbico (grado 3) no completo, así que 3 colores
 * siempre alcanzan (teorema de Brooks) — el fallback cíclico es solo por
 * las dudas, no debería activarse nunca en la práctica. */
function colorFaces(adjacency: number[][], paletteSize: number): number[] {
  const faceCount = adjacency.length;
  const colorOf = new Array(faceCount).fill(-1);

  function place(idx: number): boolean {
    if (idx === faceCount) return true;
    const used = new Set(adjacency[idx].map((n) => colorOf[n]).filter((c) => c !== -1));
    for (let c = 0; c < paletteSize; c++) {
      if (used.has(c)) continue;
      colorOf[idx] = c;
      if (place(idx + 1)) return true;
      colorOf[idx] = -1;
    }
    return false;
  }

  if (!place(0)) {
    for (let f = 0; f < faceCount; f++) colorOf[f] = f % paletteSize;
  }
  return colorOf;
}

/**
 * Cada cara del icosaedro se reemplaza por un prisma triangular: la cara
 * exterior (al radio original) más 3 paredes laterales que bajan hasta una
 * base hundida `depth` hacia el centro. Los 21 vértices del prisma (7
 * triángulos: 1 tapa + 3 paredes x 2) comparten el mismo `aCentroid`, así
 * que el shader los mueve como un único bloque rígido al entreabrirse —
 * revelando las paredes como profundidad real, no un plano sin espesor.
 * También comparten un color de PASTEL_PALETTE, elegido por `colorFaces`
 * (nunca igual al de una cara vecina) — igual técnica que aCentroid, un
 * valor por cara repetido en sus 21 vértices.
 */
function createFacetedGeometry(radius: number, detail: number, depth: number): BufferGeometry {
  const base = new IcosahedronGeometry(radius, detail).toNonIndexed();
  const basePos = base.attributes.position;
  const faceCount = basePos.count / 3;
  const trisPerFace = 7;
  const vertCount = faceCount * trisPerFace * 3;

  const positions = new Float32Array(vertCount * 3);
  const centroids = new Float32Array(vertCount * 3);
  const colors = new Float32Array(vertCount * 3);

  const t0 = new Vector3();
  const t1 = new Vector3();
  const t2 = new Vector3();
  const c = new Vector3();
  const dir = new Vector3();
  const b0 = new Vector3();
  const b1 = new Vector3();
  const b2 = new Vector3();
  const col = new Color();
  const palette = PASTEL_PALETTE.map((hex) => new Color(hex));
  const faceColorIndex = colorFaces(buildFaceAdjacency(basePos, faceCount), palette.length);

  let vi = 0;
  const pushVert = (v: Vector3) => {
    positions[vi * 3] = v.x;
    positions[vi * 3 + 1] = v.y;
    positions[vi * 3 + 2] = v.z;
    centroids[vi * 3] = c.x;
    centroids[vi * 3 + 1] = c.y;
    centroids[vi * 3 + 2] = c.z;
    colors[vi * 3] = col.r;
    colors[vi * 3 + 1] = col.g;
    colors[vi * 3 + 2] = col.b;
    vi++;
  };

  for (let f = 0; f < faceCount; f++) {
    const i0 = f * 3;
    t0.fromBufferAttribute(basePos, i0);
    t1.fromBufferAttribute(basePos, i0 + 1);
    t2.fromBufferAttribute(basePos, i0 + 2);
    c.copy(t0).add(t1).add(t2).divideScalar(3);
    col.copy(palette[faceColorIndex[f]]);
    // Cada vértice de la base de la pared usa SU PROPIA dirección radial
    // (no la del centroide de la cara) — así el punto quede compartido con
    // las caras vecinas que tocan ese mismo vértice, sin importar cuál cara
    // lo esté calculando. Antes usaban `dir` (centroide de la cara), que
    // difiere entre caras vecinas aunque el vértice de arriba (t0/t1/t2)
    // sea el mismo punto — eso dejaba las paredes sin cerrar en cada
    // vértice donde convergen 5-6 caras (hueco en forma de estrella, fijo
    // en la geometría, independiente de REST_GAP/explode).
    b0.copy(t0).addScaledVector(dir.copy(t0).normalize(), -depth);
    b1.copy(t1).addScaledVector(dir.copy(t1).normalize(), -depth);
    b2.copy(t2).addScaledVector(dir.copy(t2).normalize(), -depth);

    // tapa exterior
    pushVert(t0);
    pushVert(t1);
    pushVert(t2);
    // pared t0-t1
    pushVert(t0);
    pushVert(t1);
    pushVert(b1);
    pushVert(t0);
    pushVert(b1);
    pushVert(b0);
    // pared t1-t2
    pushVert(t1);
    pushVert(t2);
    pushVert(b2);
    pushVert(t1);
    pushVert(b2);
    pushVert(b1);
    // pared t2-t0
    pushVert(t2);
    pushVert(t0);
    pushVert(b0);
    pushVert(t2);
    pushVert(b0);
    pushVert(b2);
  }

  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(positions, 3));
  geo.setAttribute('aCentroid', new BufferAttribute(centroids, 3));
  geo.setAttribute('color', new BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
}

class ExplodeMaterial extends MeshPhysicalMaterial {
  private uExplode = { value: 0 };
  private uTime = { value: 0 };
  private uHoverPoint = { value: new Vector3() };
  private uHoverStrength = { value: 0 };

  constructor(params?: MeshPhysicalMaterialParameters) {
    super(params);
  }

  onBeforeCompile(shader: { vertexShader: string; uniforms: Record<string, { value: unknown }> }) {
    shader.uniforms.uExplode = this.uExplode;
    shader.uniforms.uTime = this.uTime;
    shader.uniforms.uHoverPoint = this.uHoverPoint;
    shader.uniforms.uHoverStrength = this.uHoverStrength;
    shader.vertexShader = `
      attribute vec3 aCentroid;
      uniform float uExplode;
      uniform float uTime;
      uniform vec3 uHoverPoint;
      uniform float uHoverStrength;
      ${shader.vertexShader}
    `.replace(
      '#include <begin_vertex>',
      `
      vec3 dir = normalize(aCentroid);
      float wobble = sin(uTime * 1.6 + length(aCentroid) * 5.0) * 0.04 * uExplode;
      float hoverDist = distance(aCentroid, uHoverPoint);
      float hoverPush = uHoverStrength * smoothstep(${HOVER_PUSH_RADIUS.toFixed(2)}, 0.0, hoverDist) * ${HOVER_PUSH_STRENGTH.toFixed(2)};
      float totalExplode = uExplode + hoverPush;
      vec3 transformed = vec3(position + dir * (totalExplode * 1.1 + wobble));
      `
    );
  }

  get explode(): number {
    return this.uExplode.value;
  }

  set explode(v: number) {
    this.uExplode.value = v;
  }

  set time(v: number) {
    this.uTime.value = v;
  }

  set hoverPoint(v: Vector3) {
    this.uHoverPoint.value.copy(v);
  }

  set hoverStrength(v: number) {
    this.uHoverStrength.value = v;
  }
}

// Ángulo de cada facet — se reparten en una grilla de 2 filas (arriba/abajo)
// en orden "serpiente" (fila de arriba de izquierda a derecha, fila de
// abajo de derecha a izquierda), así que ir de una facet a la siguiente del
// listado va realmente en distintas direcciones — derecha, derecha, abajo,
// izquierda, izquierda, arriba — no siempre para el mismo lado con el pitch
// como único variante. Compartido entre CameraRig (a dónde apunta la
// cámara) y JourneyContent.tsx (dónde vive el texto de cada facet) — si se
// calculara por separado en cada archivo, alguno se podría desincronizar al
// tocar un solo lado.
// Con 14° dos facets de la misma columna (arriba/abajo) quedaban a solo
// ~28° de distancia angular entre sí — dentro de la ventana de fundido de
// JourneyContent.tsx (hasta 0.6 rad ≈ 34°), así que la de abajo se veía
// "transparentada" detrás de la de arriba. Con 26° la separación (~52°)
// queda claramente afuera de esa ventana, y de paso el arriba/abajo se
// siente más marcado, que era justamente el pedido.
const FACET_PITCH = MathUtils.degToRad(26);
const FACET_YAW_STEP = MathUtils.degToRad(55);

export function getFacetAngles(index: number, facetCount: number): { yaw: number; pitch: number } {
  const cols = Math.ceil(facetCount / 2);
  const row = Math.floor(index / cols);
  const colInRow = index % cols;
  // fila impar recorrida al revés (serpiente) — así la transición entre
  // filas es un solo paso hacia abajo/arriba, no un salto lateral grande.
  const col = row % 2 === 0 ? colInRow : cols - 1 - colInRow;
  const yaw = (col - (cols - 1) / 2) * FACET_YAW_STEP;
  const pitch = row === 0 ? FACET_PITCH : -FACET_PITCH;
  return { yaw, pitch };
}

// Diferencia angular más corta entre dos ángulos (en radianes) — % de JS
// puede devolver negativo (a diferencia de Python), por eso el "+ twoPi)
// % twoPi" de más: sin él, el camino más corto salía mal la mitad de las
// veces (resultado fuera de (-π, π]).
export function shortestAngleDelta(target: number, current: number): number {
  const twoPi = Math.PI * 2;
  return (((target - current + Math.PI) % twoPi) + twoPi) % twoPi - Math.PI;
}

/**
 * Mueve la cámara según el progreso del scroll (acercamiento, traslación en
 * Z, y una vez adentro se asienta y nunca vuelve a moverse en Z) y hace
 * girar la cámara (yaw + pitch) hacia la cara elegida por click en la nav
 * de CoreJourney.tsx (`activeFacetRef`), no por scroll — girar en cada
 * pixel de scroll mareaba (fue lo primero que se probó, ver historial). El
 * giro usa el camino más corto en cada eje por separado.
 */
function CameraRig({
  progressRef,
  activeFacetRef,
  facetCount,
}: {
  progressRef: React.RefObject<number>;
  activeFacetRef: React.RefObject<number>;
  facetCount: number;
}) {
  const { camera } = useThree();

  useFrame(() => {
    const p = progressRef.current ?? 0;

    let z: number;
    if (p <= APPROACH_END) {
      z = MathUtils.lerp(CAMERA_START_Z, CAMERA_THRESHOLD_Z, p / APPROACH_END);
    } else if (p <= CAMERA_SETTLE_END) {
      z = MathUtils.lerp(CAMERA_THRESHOLD_Z, CAMERA_INSIDE_Z, (p - APPROACH_END) / (CAMERA_SETTLE_END - APPROACH_END));
    } else {
      z = CAMERA_INSIDE_Z;
    }
    camera.position.z = z;

    // Si volviste a scrollear hacia afuera (p <= APPROACH_END), el giro
    // vuelve a (0,0) sin importar qué facet quedó elegida en la nav — si
    // no, la vista de "afuera" quedaba girada al último click, distinta a
    // como se veía al entrar la primera vez.
    const target = p <= APPROACH_END ? { yaw: 0, pitch: 0 } : getFacetAngles(activeFacetRef.current ?? 0, facetCount);
    camera.rotation.y += shortestAngleDelta(target.yaw, camera.rotation.y) * 0.07;
    camera.rotation.x += shortestAngleDelta(target.pitch, camera.rotation.x) * 0.07;
  });

  return null;
}

/** Key/rim son direccionales (rayos paralelos, sin caída por distancia) a
 * propósito: con luces puntuales cerca del objeto, cada cara plana recibía
 * una intensidad distinta según qué tan cerca quedaba cada píxel de la
 * lámpara — eso pintaba un degradé dentro de CADA cara (más claro al
 * centro, más oscuro en los bordes) que rompía la lectura de "color sólido
 * por cara" (estilo cubo Rubik) y la dejaba viéndose sucia/mezclada. Una
 * direccional ilumina toda la cara por igual (mismo ángulo de luz en todo
 * punto de un plano), así que dentro de una cara no hay degradé — solo
 * varía el brillo entre caras según el ángulo de cada una. */
function Lighting({ progressRef }: { progressRef: React.RefObject<number> }) {
  const ambient = useRef<AmbientLight>(null);
  const key = useRef<DirectionalLight>(null);
  const fill = useRef<DirectionalLight>(null);
  const rim = useRef<DirectionalLight>(null);

  useFrame(() => {
    const p = progressRef.current ?? 0;
    const insideDepth = MathUtils.smoothstep(p, APPROACH_END, 1);
    // Un ambient alto (probado en 1.1) resolvía el lado en sombra del
    // cristal, pero un ambient ilumina PAREJO toda la escena por igual sin
    // importar orientación — de paso volaba de brillo cualquier superficie
    // plana del stand que mirase de frente a cámara (la garra se veía
    // "encendida" en blanco). Con un `fill` direccional dedicado del lado
    // opuesto al `key`, el lado en sombra del cristal se resuelve sin
    // pegarle ese extra parejo a todo lo demás — el ambient vuelve a un
    // nivel moderado, solo para que no se vaya a negro puro.
    if (ambient.current) ambient.current.intensity = MathUtils.lerp(0.55, 0.5, insideDepth);
    if (key.current) key.current.intensity = MathUtils.lerp(2, 1.2, insideDepth);
    if (fill.current) fill.current.intensity = MathUtils.lerp(1, 0.6, insideDepth);
    if (rim.current) rim.current.intensity = MathUtils.lerp(0.8, 0.4, insideDepth);
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={0.55} />
      <directionalLight ref={key} position={[4, 3, 5]} intensity={2} color="#ffffff" />
      <directionalLight ref={fill} position={[-3, -1, 4]} intensity={1} color="#ffffff" />
      <directionalLight ref={rim} position={[-5, 3, -4]} intensity={0.8} color="#7fb2ff" />
    </>
  );
}

/**
 * El cristal se puede arrastrar para girarlo (con inercia — sigue girando
 * un poco al soltar), envuelto en un `group` aparte para no pisar el giro
 * autónomo lento que ya tiene el mesh mientras la cámara está "afuera".
 * Las caras mantienen una separación fija chica (REST_GAP) en reposo, sin
 * respirar; el empuje local bajo el cursor se suma aparte, vía raycast.
 */
function Crystal({ progressRef, draggable }: { progressRef: React.RefObject<number>; draggable: boolean }) {
  const mesh = useRef<Mesh>(null);
  const group = useRef<Group>(null);
  const material = useRef<ExplodeMaterial>(null);
  const light = useRef<DirectionalLight>(null);

  const dragging = useRef(false);
  const velocity = useRef({ x: 0, y: 0 });
  const hovering = useRef(false);
  const hoverPointCurrent = useRef(new Vector3());
  const hoverPointTarget = useRef(new Vector3());
  const hoverStrengthCurrent = useRef(0);

  const geometry = useMemo(() => createFacetedGeometry(1.3, 1, FACET_DEPTH), []);
  const dlMaterial = useMemo(
    () =>
      new ExplodeMaterial({
        // Blanco + vertexColors: true — el color final por píxel es
        // `color × color-de-vértice` (ver PASTEL_PALETTE en
        // createFacetedGeometry); con blanco de base, sale el color de la
        // cara tal cual, sin mezcla.
        color: '#ffffff',
        vertexColors: true,
        // Neutro, no tibio: un emissive con tinte (antes '#3a1600',
        // marrón cálido) le pondría el mismo tono a todas las caras por
        // encima y se perdería la diferencia entre pasteles.
        emissive: '#0a0a0a',
        // Mate a propósito, casi sin metalness/clearcoat — un brillo
        // especular amplio (aunque venga de una direccional, no de un
        // punto cercano) sigue variando algo con el ángulo y podía
        // "romper" el color plano de una cara. Estilo cubo Rubik: plástico
        // mate, no gema pulida.
        roughness: 0.65,
        metalness: 0,
        clearcoat: 0,
        clearcoatRoughness: 0.35,
        ior: 1.8,
        side: DoubleSide,
      }),
    []
  );

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    // En touch no hay forma de distinguir "arrastrar para girar" de
    // "swipe para scrollear la página" — es el mismo gesto de un dedo sobre
    // el mismo canvas que cubre toda la sección. Bloquear el scroll nativo
    // ahí para permitir el drag rompería el journey (scroll pineado) en
    // touch por completo, así que en touch directamente no se engancha
    // este handler (ver `draggable` más abajo) — el giro automático de
    // reposo alcanza para que el cristal no se sienta estático.
    if (!draggable) return;
    // Una vez adentro (p > APPROACH_END) el cristal deja de responder al
    // mouse — ni arrastre ni empuje local de caras — porque ahí el punto
    // de vista ya lo controla la nav (yaw/pitch hacia la facet elegida) y
    // que el objeto además gire por su cuenta al tocarlo quedaba confuso.
    if ((progressRef.current ?? 0) > APPROACH_END) return;
    e.stopPropagation();
    dragging.current = true;
    velocity.current = { x: 0, y: 0 };
    let lastX = e.clientX;
    let lastY = e.clientY;

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - lastX;
      const dy = ev.clientY - lastY;
      lastX = ev.clientX;
      lastY = ev.clientY;
      const vy = dx * 0.006;
      const vx = dy * 0.006;
      if (group.current) {
        group.current.rotation.y += vy;
        group.current.rotation.x += vx;
      }
      velocity.current = { x: vx, y: vy };
    };

    const onUp = () => {
      dragging.current = false;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  useFrame((state, delta) => {
    const inApproach = (progressRef.current ?? 0) <= APPROACH_END;

    if (mesh.current && inApproach) {
      mesh.current.rotation.x += delta * 0.06;
      mesh.current.rotation.y += delta * 0.1;
    }

    if (group.current && !dragging.current) {
      if (Math.abs(velocity.current.x) > 0.0002 || Math.abs(velocity.current.y) > 0.0002) {
        group.current.rotation.x += velocity.current.x;
        group.current.rotation.y += velocity.current.y;
        velocity.current.x *= 0.94;
        velocity.current.y *= 0.94;
      }
    }

    // Raycast solo mientras se está sobre el cristal, para saber qué cara
    // "mira" el cursor y empujar solo esa zona.
    if (hovering.current && mesh.current) {
      state.raycaster.setFromCamera(state.pointer, state.camera);
      const hit = state.raycaster.intersectObject(mesh.current, false)[0];
      if (hit) {
        hoverPointTarget.current.copy(mesh.current.worldToLocal(hit.point.clone()));
      }
    }
    hoverPointCurrent.current.lerp(hoverPointTarget.current, 0.15);
    // Mismo criterio que el drag: el empuje local de la cara bajo el
    // cursor solo tiene sentido "afuera" — adentro no se interactúa con
    // el cristal en absoluto.
    const hoverStrengthTarget = hovering.current && inApproach ? 1 : 0;
    hoverStrengthCurrent.current += (hoverStrengthTarget - hoverStrengthCurrent.current) * 0.08;

    // Con vertexColors + paleta por cara, metalness/clearcoat altos hacían
    // que la luz dominara el color propio de cada cara vía reflejo
    // especular — leía "piedra oscura/mezclada" en vez de color plano y
    // sólido. Casi nulos en todo el recorrido, mate (roughness alto), así
    // el color de vértice se ve tal cual, sin brillo que lo tape — estilo
    // cubo Rubik, no gema pulida.
    const p = progressRef.current ?? 0;
    const insideDepth = MathUtils.smoothstep(p, APPROACH_END, 1);
    if (material.current) {
      // Adentro la cámara queda muy cerca de la cara — el vector de vista
      // barre un ángulo enorme de un extremo al otro de un mismo plano, y
      // hasta un specular chico (el ~4% de Fresnel que tiene cualquier
      // dieléctrico, no hace falta metalness) se nota como un degradé
      // dentro de la cara. Roughness bien alto ahí adentro lo aplana.
      material.current.roughness = MathUtils.lerp(0.65, 0.9, insideDepth);
      material.current.metalness = 0;
      material.current.clearcoat = 0;
      // REST_GAP separa cada cara de sus vecinas empujándolas por SU PROPIA
      // dirección — en un vértice donde convergen 5-6 caras, ese punto
      // compartido se parte en 5-6 posiciones ligeramente distintas y deja
      // un hueco en forma de estrella sin geometría detrás (se ve negro).
      // De afuera, a la distancia normal, no se nota — pero de cerca,
      // adentro del cristal, esos huecos quedan pegados a la cámara y se
      // ven claramente. En vez de sacar el gap por completo (se pierde el
      // efecto "caras separadas" que se pidió), se cierra rápido apenas se
      // cruza adentro — mismo tramo de 0.05 que ya usan CalibrationRig.tsx
      // y JourneyContent.tsx para sus propios fade — así de afuera se ve
      // igual que siempre y adentro, donde molesta, directamente no está.
      const gapFade = 1 - MathUtils.smoothstep(p, APPROACH_END, APPROACH_END + 0.05);
      material.current.explode = REST_GAP * gapFade;
      material.current.time = state.clock.elapsedTime;
      material.current.hoverPoint = hoverPointCurrent.current;
      material.current.hoverStrength = hoverStrengthCurrent.current;
    }

    if (light.current && inApproach) {
      // Solo sigue al cursor en X — moverla también en Y la acercaba a la
      // altura de las garras del stand (Y≈±1.85, arriba/abajo de la
      // pantalla) y, aunque quedara lejos "en distancia", el ángulo bastaba
      // para sobreexponer la tapa metálica: se veía como si la garra "se
      // prendiera" al pasar el mouse por arriba o por abajo. Fijando Y no
      // hay forma de que esta luz llegue nunca a esa zona.
      const targetLX = state.pointer.x * 3;
      light.current.position.x += (targetLX - light.current.position.x) * 0.1;
    }
  });

  return (
    <>
      <group ref={group}>
        <mesh
          ref={mesh}
          geometry={geometry}
          onPointerOver={() => {
            hovering.current = true;
          }}
          onPointerOut={() => {
            hovering.current = false;
          }}
          onPointerDown={handlePointerDown}
        >
          <primitive ref={material} object={dlMaterial} attach="material" />
        </mesh>
      </group>
      <directionalLight ref={light} position={[-4, -2, -3]} intensity={1.2} color="#ffffff" />
    </>
  );
}

export function CoreScene({
  progressRef,
  activeFacetRef,
  facetCount,
  facets,
}: {
  progressRef: React.RefObject<number>;
  activeFacetRef: React.RefObject<number>;
  facetCount: number;
  facets: JourneyFacet[];
}) {
  const fine = useFinePointer();
  const mobile = useIsMobile();

  return (
    <Canvas
      className="dl-journey__canvas"
      style={{ position: 'absolute', inset: 0 }}
      // Tope de dpr más bajo en mobile: son pantallas de dpr 2-3, y sin este
      // tope el canvas renderiza a resolución real de pixel (2-3x el ancho
      // CSS) en una GPU bastante más floja que una de escritorio — mismo
      // criterio que el conteo de Sparkles más abajo.
      dpr={mobile ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 0, CAMERA_START_Z], fov: 40, near: 0.05, far: 60 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Lighting progressRef={progressRef} />
      <CameraRig progressRef={progressRef} activeFacetRef={activeFacetRef} facetCount={facetCount} />
      <CalibrationRig progressRef={progressRef} />
      <JourneyContent facets={facets} facetCount={facetCount} progressRef={progressRef} />
      <Crystal progressRef={progressRef} draggable={fine} />
      <Sparkles count={mobile ? 28 : 60} scale={6} size={2} speed={0.3} color="#ffffff" />
    </Canvas>
  );
}

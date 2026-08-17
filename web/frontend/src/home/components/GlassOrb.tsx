/**
 * Objeto "afuera" del viaje — reemplaza al cristal facetado visible que
 * había antes (ver git history: `CalibrationRig.tsx`, con zajones metálicas
 * y piso con grilla). Portado de digilang.vercel.app: una esfera de vidrio
 * esmerilado con un núcleo brillante adentro, rodeada por dos anillos
 * metálicos finos cruzados en ángulo (tipo giroscopio/átomo). Gira solo,
 * lento, todo el tiempo que está "afuera" — no es arrastrable (a diferencia
 * del cristal anterior): en la referencia no hay indicio de esa interacción,
 * y simplifica bastante no tener que resolver drag-vs-scroll en touch acá
 * también (ver el mismo problema, ya resuelto de otra forma, en
 * CoreScene.tsx/Crystal de versiones anteriores).
 *
 * La esfera usa `MeshTransmissionMaterial` (drei) — un `meshPhysicalMaterial`
 * con transmisión "a mano" (probado primero) salía plano/opaco sin un
 * entorno real atrás para refractar; este componente resuelve eso solo,
 * capturando lo que hay detrás del objeto cada frame en un buffer propio,
 * así que el núcleo se ve a través con distorsión real de vidrio en vez de
 * ser un simple alpha-blend.
 *
 * Comparte la ventana de cruce (`CROSSFADE_START`/`CROSSFADE_END`, ver
 * CoreScene.tsx) con `Crystal` — se apaga exactamente mientras el patrón
 * facetado se prende, para que la cámara "atraviese el vidrio" en vez de
 * ver dos fades sueltos.
 */
import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import { Color, MathUtils } from 'three';
import type { Group, Mesh, MeshBasicMaterial, MeshStandardMaterial } from 'three';
import { CROSSFADE_END, CROSSFADE_START } from '@/home/components/CoreScene';

const ORB_RADIUS = 1.15;
const RING_OPACITY = 1;
// Fondo que "ve" el buffer de transmisión al refractar — sin una escena 3D
// completa detrás (nuestro canvas es transparente sobre la página), sin
// esto el vidrio refractaba hacia negro/vacío. Mismo tono que el fondo real
// de la página (--dl-black en tokens.css), así la refracción de los bordes
// se mezcla con lo que hay alrededor en vez de recortarse.
const GLASS_BACKGROUND = new Color('#eef0f4');

export function GlassOrb({ progressRef, mobile }: { progressRef: React.RefObject<number>; mobile: boolean }) {
  const group = useRef<Group>(null);
  const orb = useRef<Mesh>(null);
  const glassMat = useRef<{ opacity: number }>(null);
  const coreMat = useRef<MeshBasicMaterial>(null);
  const ringMatA = useRef<MeshStandardMaterial>(null);
  const ringMatB = useRef<MeshStandardMaterial>(null);

  // El color del núcleo se "sobre-satura" más allá de 1.0 por canal (un hex
  // normal no puede pasar de #fff) — es lo que le da al Bloom del
  // postprocesado (ver PostFX en CoreScene.tsx) algo que de verdad exceda
  // el umbral de luminancia y brille. Con el color plano (#5b4ff0, luminancia
  // ~0.3) por debajo del fondo claro (~0.9), el Bloom nunca lo agarraba sin
  // bajar tanto el umbral que el fondo entero terminaba brillando.
  useEffect(() => {
    coreMat.current?.color.set('#5b4ff0').multiplyScalar(1.35);
  }, []);

  useFrame((state, delta) => {
    const p = progressRef.current ?? 0;
    const fade = 1 - MathUtils.smoothstep(p, CROSSFADE_START, CROSSFADE_END);

    if (group.current) {
      // Oculto del todo (no solo opacity 0) una vez cruzado — no hace falta
      // seguir dibujando estos meshes adentro del viaje.
      group.current.visible = fade > 0.01;
      group.current.rotation.y += delta * 0.14;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.12;
    }
    if (glassMat.current) glassMat.current.opacity = fade;
    if (coreMat.current) coreMat.current.opacity = fade;
    if (ringMatA.current) ringMatA.current.opacity = RING_OPACITY * fade;
    if (ringMatB.current) ringMatB.current.opacity = RING_OPACITY * fade;
  });

  return (
    <group ref={group}>
      {/* Núcleo primero (adentro del vidrio) — con blending normal, el
          orden de dibujo dentro del mismo grupo transparente importa: si el
          vidrio se dibujara antes, en algunos ángulos tapaba el núcleo en
          vez de dejarlo ver a través. */}
      <mesh>
        <sphereGeometry args={[ORB_RADIUS * 0.46, 32, 32]} />
        {/* toneMapped false para que el color salga saturado tal cual, no
            atenuado por el tonemapping de la escena — el resplandor difuso
            alrededor (el "glow" de la referencia) lo agrega el Bloom de
            postprocesado, no este mesh. */}
        <meshBasicMaterial ref={coreMat} color="#5b4ff0" toneMapped={false} transparent opacity={1} />
      </mesh>
      <mesh ref={orb}>
        <sphereGeometry args={[ORB_RADIUS, 64, 64]} />
        <MeshTransmissionMaterial
          ref={glassMat}
          background={GLASS_BACKGROUND}
          // Menos samples/resolution en mobile — recalcula un buffer nuevo
          // cada frame (para que la refracción sea real al girar), así que
          // es la parte más cara de todo GlassOrb en GPUs chicas. Buffer
          // más chico (256 en desktop, probado primero) hacía que el anillo
          // — geometría fina, atrás del vidrio — se refractara en punta/
          // dentada (poca resolución para algo tan fino), en vez de la
          // curva lisa que debería verse.
          samples={mobile ? 4 : 8}
          resolution={mobile ? 256 : 512}
          thickness={0.8}
          roughness={0.14}
          transmission={1}
          ior={1.34}
          chromaticAberration={0.03}
          anisotropy={0}
          distortion={0}
          distortionScale={0}
          temporalDistortion={0}
          color="#eef1fa"
          clearcoat={0.3}
          clearcoatRoughness={0.15}
        />
      </mesh>
      <mesh rotation={[MathUtils.degToRad(72), MathUtils.degToRad(12), 0]}>
        <torusGeometry args={[ORB_RADIUS * 1.55, 0.018, 12, 96]} />
        <meshStandardMaterial
          ref={ringMatA}
          color="#6b7280"
          metalness={0.95}
          roughness={0.18}
          transparent
          opacity={RING_OPACITY}
        />
      </mesh>
      <mesh rotation={[MathUtils.degToRad(18), MathUtils.degToRad(-22), MathUtils.degToRad(78)]}>
        <torusGeometry args={[ORB_RADIUS * 1.4, 0.015, 12, 96]} />
        <meshStandardMaterial
          ref={ringMatB}
          color="#6b7280"
          metalness={0.95}
          roughness={0.18}
          transparent
          opacity={RING_OPACITY}
        />
      </mesh>
    </group>
  );
}

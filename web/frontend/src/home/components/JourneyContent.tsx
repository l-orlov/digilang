/**
 * El texto de cada disciplina ya no es HTML flotando sobre el canvas — vive
 * en la escena, "pegado" al cristal: una posición fija alrededor del centro
 * por cada facet, en el mismo ángulo al que `CameraRig` (CoreScene.tsx)
 * gira la cámara cuando se clickea esa facet en la nav. Así, cuando una
 * facet queda elegida, su texto queda exactamente enfrente.
 *
 * Truco de rotación: cada facet vive en su propio `<group rotation={[pitch,
 * yaw, 0]}>` (mismo ángulo que devuelve `getFacetAngles`, compartido con
 * `CameraRig` en CoreScene.tsx — yaw Y pitch, no solo yaw, para que las
 * facets queden repartidas también arriba/abajo, no todas en el mismo
 * plano horizontal), y sus hijos (texto + marca) se ubican en local
 * `z = -radio` (no en coordenadas de mundo a mano) — así el giro del group
 * ya los deja en el ángulo correcto Y mirando hacia la cámara (Text de
 * drei mira por defecto a +Z; girado con el group, ese +Z local termina
 * apuntando de vuelta hacia el origen).
 *
 * Dos fuentes, igual que en la referencia (digilang.vercel.app): Geist Mono
 * para el eyebrow (chico, uppercase) y Geist SemiBold para la línea grande —
 * troika-three-text (lo que usa el <Text> de drei por debajo) no lee
 * variable fonts bien / .woff2, por eso son archivos .ttf estáticos aparte
 * (ver public/fonts/), no los mismos que carga fonts.css para el HTML.
 */
import { Suspense, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { MathUtils, MeshBasicMaterial } from 'three';
import type { JourneyFacet } from '@/home/content';
import { APPROACH_END, INSIDE_END, getFacetAngles, shortestAngleDelta } from '@/home/components/CoreScene';

const FACET_TEXT_RADIUS = 1.0;
const MARKER_RADIUS = 1.4;

type FillOpacityRef = { fillOpacity: number; maxWidth?: number; fontSize?: number } | null;

export function JourneyContent({
  facets,
  facetCount,
  progressRef,
}: {
  facets: JourneyFacet[];
  facetCount: number;
  progressRef: React.RefObject<number>;
}) {
  const eyebrowRefs = useRef<FillOpacityRef[]>([]);
  const lineRefs = useRef<FillOpacityRef[]>([]);
  const markerMaterials = useMemo(
    () => facets.map(() => new MeshBasicMaterial({ color: '#161b24', toneMapped: false, transparent: true })),
    [facets]
  );

  useFrame(({ camera, viewport }) => {
    const p = progressRef.current ?? 0;
    // fontSize/maxWidth originales (0.065/0.85, 0.026 el eyebrow) se
    // pensaron para un aspect de escritorio (~1.6) — en portrait de celular
    // el ancho visible a esta distancia es mucho menor (mismo FOV VERTICAL,
    // pero bastante menos horizontal). `getCurrentViewport` da el ancho/alto
    // real visibles en la distancia del texto (FOV+aspect+distancia).
    const vp = viewport.getCurrentViewport(camera, [0, 0, -FACET_TEXT_RADIUS]);
    const REFERENCE_ASPECT = 1.6;
    const referenceWidth = vp.height * REFERENCE_ASPECT;
    // `fontSize` escala con un piso (0.45) para que siga siendo legible en
    // pantallas muy angostas — pero `maxWidth` NO puede heredar ese mismo
    // piso: en un iPhone angosto (~0.46 de aspect) la escala "cruda" cae a
    // ~0.29, muy por debajo del piso de fuente. Si maxWidth usara el mismo
    // piso (0.45), terminaba siendo MÁS ANCHO que el espacio real visible
    // (vp.width) — exactamente lo que pasaba: texto pegado a los bordes,
    // sin margen, en vez de quedar más chico y wrappear en más líneas. Por
    // eso maxWidth se ata siempre y directo al ancho real (con margen del
    // 8% de cada lado), nunca a la escala de fuente.
    // Geist es más ancha que Tektur (la fuente con la que se calibraron
    // estos números antes) al mismo tamaño — piso más bajo (0.4, antes
    // 0.45) y menos ancho relativo (0.78, antes 0.84) para que en mobile
    // angosto siga entrando con margen en vez de tocar los bordes.
    const fontScale = MathUtils.clamp(vp.width / referenceWidth, 0.4, 1);
    const lineFontSize = 0.065 * fontScale;
    const lineMaxWidth = vp.width * 0.66;
    const eyebrowFontSize = 0.026 * fontScale;
    // Sin esto, las marcas/texto quedaban visibles (aunque chicos, en el
    // borde de la silueta) incluso "afuera" — antes de que la cámara
    // cruzara adentro del cristal. Aparece recién ahí, igual de rápido que
    // la nav (mismo tramo de 0.05 que usa CoreJourney.tsx para su fade-in).
    const insideFade = MathUtils.smoothstep(p, APPROACH_END, APPROACH_END + 0.05);
    // Y del mismo modo tiene que apagarse hacia el final: si te quedás en
    // la última facet elegida y seguís scrolleando hasta el outro, ese
    // texto (que seguía "alineado" con la cámara) se veía superpuesto con
    // "Saliste del núcleo" — mismo tramo que usa CoreJourney.tsx para el
    // fade-in del outro, acá invertido.
    const outroFade = 1 - MathUtils.smoothstep(p, INSIDE_END, 1);

    facets.forEach((_, i) => {
      const { yaw, pitch } = getFacetAngles(i, facetCount);
      const yawDelta = shortestAngleDelta(yaw, camera.rotation.y);
      const pitchDelta = shortestAngleDelta(pitch, camera.rotation.x);
      const angularDist = Math.sqrt(yawDelta * yawDelta + pitchDelta * pitchDelta);
      // 1 cuando la cámara mira casi directo a esta facet, 0 pasado cierto
      // ángulo — evita que el texto vecino se vea recortado feo en el
      // borde del FOV mientras la cámara todavía está girando hacia acá.
      const aligned = (1 - MathUtils.smoothstep(angularDist, 0.15, 0.6)) * insideFade * outroFade;

      const eyebrow = eyebrowRefs.current[i];
      const line = lineRefs.current[i];
      if (eyebrow) {
        eyebrow.fillOpacity = aligned;
        eyebrow.fontSize = eyebrowFontSize;
      }
      if (line) {
        line.fillOpacity = aligned;
        line.maxWidth = lineMaxWidth;
        line.fontSize = lineFontSize;
      }
      markerMaterials[i].opacity = MathUtils.lerp(0.35, 1, aligned) * insideFade * outroFade;
    });
  });

  return (
    <Suspense fallback={null}>
      {facets.map((f, i) => {
        const { yaw, pitch } = getFacetAngles(i, facetCount);
        return (
          <group key={f.eyebrow} rotation={[pitch, yaw, 0]}>
            <mesh position={[0, 0, -MARKER_RADIUS]} material={markerMaterials[i]}>
              <sphereGeometry args={[0.03, 12, 12]} />
            </mesh>
            <Text
              ref={(el) => {
                eyebrowRefs.current[i] = el;
              }}
              position={[0, 0.17, -FACET_TEXT_RADIUS]}
              font="/fonts/geist-mono-medium.ttf"
              fontSize={0.026}
              letterSpacing={0.28}
              color="#6b7280"
              anchorX="center"
              anchorY="middle"
            >
              {f.eyebrow.toUpperCase()}
            </Text>
            {/* anchorY="top" (no "middle") a propósito: en portrait angosto
                el texto envuelve en más líneas (ver `lineMaxWidth` en el
                useFrame de arriba) — con anchor al medio ese bloque más alto
                crecía hacia arriba y se comía el eyebrow. Ancladas por
                arriba, sea cual sea el largo del texto o cuántas líneas
                use, el bloque crece para abajo, nunca invade el eyebrow. */}
            <Text
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              position={[0, 0.09, -FACET_TEXT_RADIUS]}
              font="/fonts/geist-semibold.ttf"
              fontSize={0.065}
              maxWidth={0.85}
              lineHeight={1.15}
              letterSpacing={-0.01}
              textAlign="center"
              color="#161b24"
              anchorX="center"
              anchorY="top"
            >
              {f.line}
            </Text>
          </group>
        );
      })}
    </Suspense>
  );
}

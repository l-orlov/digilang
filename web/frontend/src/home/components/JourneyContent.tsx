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
 * apuntando de vuelta hacia el origen). Mismo tipo de truco de texto ya
 * probado en CalibrationRig.tsx (grabado "DigiLang"), acá sin curvatura.
 *
 * La fuente es la misma .ttf ya usada en CalibrationRig.tsx — troika-three-
 * text (lo que usa el <Text> de drei por debajo) no lee .woff2, por eso ya
 * existe esa conversión; no hace falta repetirla.
 */
import { Suspense, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { MathUtils, MeshBasicMaterial } from 'three';
import type { JourneyFacet } from '@/home/content';
import { APPROACH_END, INSIDE_END, getFacetAngles, shortestAngleDelta } from '@/home/components/CoreScene';

const FACET_TEXT_RADIUS = 1.0;
const MARKER_RADIUS = 1.4;

type FillOpacityRef = { fillOpacity: number; maxWidth?: number } | null;

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
    () => facets.map(() => new MeshBasicMaterial({ color: '#ffffff', toneMapped: false, transparent: true })),
    [facets]
  );

  useFrame(({ camera, viewport }) => {
    const p = progressRef.current ?? 0;
    // `maxWidth` original (0.85) se pensó para un aspect de escritorio
    // (~1.6-1.8) — en portrait de celular el ancho visible a esta distancia
    // es mucho menor (mismo FOV VERTICAL, pero mucho menos horizontal), y
    // ese ancho fijo en unidades de mundo se salía del encuadre entero. Se
    // recalcula cada frame contra el ancho real visible en la distancia del
    // texto (`getCurrentViewport`, tiene en cuenta FOV+aspect+distancia),
    // así se ajusta solo con cualquier ancho de pantalla.
    const vp = viewport.getCurrentViewport(camera, [0, 0, -FACET_TEXT_RADIUS]);
    const lineMaxWidth = Math.min(0.85, vp.width * 0.78);
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
      if (eyebrow) eyebrow.fillOpacity = aligned;
      if (line) {
        line.fillOpacity = aligned;
        line.maxWidth = lineMaxWidth;
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
              font="/fonts/tektur-variable.ttf"
              fontSize={0.026}
              letterSpacing={0.16}
              color="#ffffff"
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
              font="/fonts/tektur-variable.ttf"
              fontSize={0.065}
              maxWidth={0.85}
              lineHeight={1.25}
              textAlign="center"
              color="#ffffff"
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

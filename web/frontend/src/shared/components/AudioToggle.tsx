/**
 * Botón flotante persistente (todas las secciones) para prender/apagar la
 * música ambiental generativa (ver shared/lib/ambientAudio.ts). Arranca
 * apagado — los navegadores bloquean audio sin gesto del usuario de todos
 * modos, así que el primer click también crea el AudioContext.
 */
import { useAmbientAudio } from '@/shared/hooks/useAmbientAudio';

export function AudioToggle() {
  const { playing, toggle } = useAmbientAudio();

  return (
    <button
      type="button"
      className={`dl-audio-toggle${playing ? ' dl-audio-toggle--on' : ''}`}
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? 'Silenciar música' : 'Activar música'}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          d="M4 9v6h4l5 5V4L8 9H4Z"
          fill="currentColor"
        />
        {playing ? (
          <path
            d="M16.5 8.5a5 5 0 0 1 0 7M19 6a9 9 0 0 1 0 12"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          <path
            d="M16 9l5 6M21 9l-5 6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
        )}
      </svg>
    </button>
  );
}

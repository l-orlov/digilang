import { useState } from 'react';
import { getAmbientAudio } from '@/shared/lib/ambientAudio';

export function useAmbientAudio() {
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const audio = getAmbientAudio();
    if (playing) {
      audio.stop();
      setPlaying(false);
    } else {
      audio.start();
      setPlaying(true);
    }
  };

  return { playing, toggle };
}

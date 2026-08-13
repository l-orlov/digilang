import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SmoothScroll } from '@/shared/components/SmoothScroll';
import { Preloader } from '@/shared/components/Preloader';
import { Cursor } from '@/shared/components/Cursor';
import { AudioToggle } from '@/shared/components/AudioToggle';
import { LanguageToggle } from '@/shared/components/LanguageToggle';
import { LanguageProvider } from '@/shared/lib/language';
import { HomePage } from '@/home/pages/HomePage';

export function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <SmoothScroll>
          <Preloader>
            <Cursor />
            <AudioToggle />
            <LanguageToggle />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Preloader>
        </SmoothScroll>
      </BrowserRouter>
    </LanguageProvider>
  );
}

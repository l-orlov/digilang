import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SmoothScroll } from '@/shared/components/SmoothScroll';
import { Preloader } from '@/shared/components/Preloader';
import { Cursor } from '@/shared/components/Cursor';
import { HeaderMenu } from '@/shared/components/HeaderMenu';
import { LanguageProvider } from '@/shared/lib/language';
import { HomePage } from '@/home/pages/HomePage';

export function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <SmoothScroll>
          <Preloader>
            <Cursor />
            <HeaderMenu />
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

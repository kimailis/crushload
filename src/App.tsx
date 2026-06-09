import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './app/page';
import LoginPage from './app/login/page';
import ProfilePage from './app/profile/page';
import SimWrapper from './app/sim/[careerId]/page';
import LegalPage from './app/legal/page';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/sim/:careerId' element={<SimWrapper />} />
        <Route path='/privacy' element={<LegalPage />} />
        <Route path='/terms' element={<LegalPage />} />
        <Route path='/compliance' element={<LegalPage />} />
        <Route path='/acceptable-use' element={<LegalPage />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
}

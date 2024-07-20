import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePageComp } from './components/HomePage';
import { LoginComp } from './components/Login';
import { OffersComp } from './components/Offers';
import { ProfileComp } from './components/Profile';
import { RegistrationComp } from './components/Registration';
import { MessagesComp } from './components/Messages';
import { RequestsComp } from './components/Requests';
import { ReviewComp } from './components/Review';
import { AboutComp } from './components/About';
import { FooterComp } from './components/Footer';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <main className="flex-shrink-0">
          <Routes>
            <Route path="/" element={<HomePageComp />} />
            <Route path="/login" element={<LoginComp />} />
            <Route path="/register" element={<RegistrationComp />} />
            <Route path="/requests" element={<RequestsComp />} />
            <Route path="/offers" element={<OffersComp />} />
            <Route path="/profile" element={<ProfileComp />} />
            <Route path="/messages" element={<MessagesComp />} />
            <Route path="/about" element={<AboutComp />} />
            <Route path="/messages/:receiverId" element={<MessagesComp />} />
            <Route path="/profile/:userId" element={<ReviewComp />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <FooterComp />
      </div>
    </Router>
  );
}

export default App;
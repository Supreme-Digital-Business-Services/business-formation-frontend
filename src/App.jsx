import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import WhyDubai from './components/WhyDubai';
import Process from './components/Process';
import Packages from './components/Packages';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppCTA from './components/WhatsAppCTA';

import LoginPage from './admin/pages/LoginPage';
import ProtectedRoute from './admin/components/ProtectedRoute';
import AdminLayout from './admin/layout/AdminLayout';
import DashboardPage from './admin/pages/DashboardPage';
import LeadsPage from './admin/pages/LeadsPage';
import FollowUpsPage from "@/admin/pages/FollowUpsPage.jsx";

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Public landing page route */}
                <Route path="/" element={
                    <>
                        <Navbar />
                        <Hero />
                        <Services />
                        <WhyDubai />
                        <Process />
                        <Packages />
                        <Testimonials />
                        <FAQ />
                        <ContactSection />
                        <Footer />
                        <ScrollToTop />
                        <WhatsAppCTA />
                    </>
                } />

                {/* Admin routes */}
                <Route path="/admin/login" element={<LoginPage />} />

                <Route path="/admin" element={
                    <ProtectedRoute>
                        <AdminLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<DashboardPage />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="leads" element={<LeadsPage />} />
                    <Route path="follow-ups" element={<FollowUpsPage />} />
                    {/* Add more admin routes as needed */}
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
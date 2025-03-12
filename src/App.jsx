import React from 'react';
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
                <Route path="/admin/login" element={<Login />} />

                <Route path="/admin" element={
                    <ProtectedRoute>
                        <AdminLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="leads" element={<LeadsPage />} />
                    <Route path="follow-ups" element={<FollowUpsPage />} />
                    {/* Add more admin routes as needed */}
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
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

const App = () => {
    return (
        <div className="min-h-screen bg-gray-50">
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
        </div>
    );
};

export default App;
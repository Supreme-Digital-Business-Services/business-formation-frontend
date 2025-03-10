import React, { useState } from 'react';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-gradient-to-r from-blue-900 to-blue-800 text-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold">Supreme<span className="text-red-500">Business</span></span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#services" className="hover:text-teal-300 transition duration-300">Services</a>
                        <a href="#why-dubai" className="hover:text-teal-300 transition duration-300">Why Dubai</a>
                        <a href="#process" className="hover:text-teal-300 transition duration-300">Our Process</a>
                        <a href="#packages" className="hover:text-teal-300 transition duration-300">Packages</a>
                        <a href="#contact" className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md font-medium transition duration-300">Contact Us</a>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-white hover:text-gray-300 focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-800">
                        <a href="#services" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">Services</a>
                        <a href="#why-dubai" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">Why Dubai</a>
                        <a href="#process" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">Our Process</a>
                        <a href="#packages" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">Packages</a>
                        <a href="#contact" className="block px-3 py-2 rounded-md text-base font-medium bg-red-500 hover:bg-red-600">Contact Us</a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
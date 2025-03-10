import React from 'react';

const WhyDubai = () => {
    const benefits = [
        {
            title: "0% Corporate & Personal Tax",
            description: "Maximize your profits with Dubai's tax-efficient business environment."
        },
        {
            title: "100% Foreign Ownership",
            description: "Maintain complete control of your business with no local partner required."
        },
        {
            title: "Strategic Location",
            description: "Access 2.4 billion consumers across the Middle East, Africa, and South Asia."
        },
        {
            title: "World-Class Infrastructure",
            description: "Operate in a city with cutting-edge facilities and advanced technology."
        },
        {
            title: "Political & Economic Stability",
            description: "Enjoy a secure business environment with a strong, stable economy."
        },
        {
            title: "Easy Visa Procedures",
            description: "Simple processes for obtaining residency visas for you and your family."
        }
    ];

    return (
        <section id="why-dubai" className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:flex items-center gap-12">
                    <div className="lg:w-1/2 mb-10 lg:mb-0">
                        <h2 className="text-3xl font-bold text-blue-900 mb-6">Why Choose Dubai for Your Business?</h2>
                        <div className="w-24 h-1 bg-teal-500 mb-6"></div>
                        <p className="text-gray-600 mb-8">
                            Dubai offers unparalleled advantages for entrepreneurs and businesses looking to expand globally. With its strategic location, world-class infrastructure, and business-friendly policies, Dubai has become a premier destination for company formation.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex">
                                    <div className="flex-shrink-0 mt-1">
                                        <svg className="h-5 w-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h4 className="text-lg font-semibold text-blue-900">{benefit.title}</h4>
                                        <p className="text-gray-600">{benefit.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:w-1/2">
                        <div className="relative">
                            <img
                                src="https://i.postimg.cc/kgr4ksj2/Device-Bee-Dubai-Future-Museum-Banner.jpg/600x400"
                                alt="Dubai Skyline"
                                className="rounded-lg shadow-xl w-full"
                            />
                            <div className="absolute -bottom-6 -right-6 bg-red-500 text-white p-6 rounded-lg shadow-lg max-w-xs">
                                <h3 className="text-xl font-bold mb-2">2025 Special Offer</h3>
                                <p>Get 10% off on all business setup packages when you register before April 30</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyDubai;
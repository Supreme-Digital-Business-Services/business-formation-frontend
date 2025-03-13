import React from 'react';

const Packages = () => {
    const packageData = [
        {
            title: "Freelancer License",
            price: "5,750",
            isPopular: false,
            features: [
                "Freelancer Permit",
                "Upto 10 Activities",
                "0% Tax",
                "UAE Residence",
                "No Office Required",
                "Document Attestation",
                "Certificate of Incorporation",
                "Legal Documentation",
                "Business Networking Access"
            ]
        },
        {
            title: "Free Zone Company",
            price: "10,900",
            isPopular: true,
            features: [
                "Free Zone License",
                "Multiple Activities",
                "100% Foreign Ownership",
                "1 Residence Visa",
                "Flexi Desk",
                "Bank Account Assistance",
                "Corporate Tax Planning",
                "Business Development Support"
            ]
        },
        {
            title: "Mainland Company",
            price: "19,750",
            isPopular: false,
            features: [
                "Mainland DED License",
                "Multiple Activities",
                "100% Foreign Ownership",
                "Up to 6 Residence Visa Quotas",
                "Physical Office Space",
                "Corporate Bank Account",
                "VAT Registration",
                "Legal Documentation",
                "Business Networking Access"
            ]
        }
    ];

    return (
        <section id="packages" className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-blue-900">Business Setup Packages</h2>
                    <div className="w-24 h-1 bg-teal-500 mx-auto mt-4 mb-6"></div>
                    <p className="text-gray-600 max-w-3xl mx-auto">
                        Choose from our range of comprehensive packages designed to suit different business needs and budgets.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {packageData.map((pkg, index) => (
                        <div
                            key={index}
                            className={`border rounded-lg overflow-hidden transition-all duration-300 ${
                                pkg.isPopular
                                    ? 'border-teal-500 shadow-lg transform hover:-translate-y-2'
                                    : 'border-gray-200 shadow hover:shadow-md hover:-translate-y-1'
                            }`}
                        >
                            <div className={`p-6 ${pkg.isPopular ? 'bg-gradient-to-r from-blue-900 to-blue-700' : 'bg-blue-900'} text-white`}>
                                {pkg.isPopular && (
                                    <div className="bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-xl font-bold mb-1">{pkg.title}</h3>
                                <div className="flex items-baseline">
                                    <span className="text-2xl font-bold">AED</span>
                                    <span className="text-4xl font-bold ml-1">{pkg.price}</span>
                                </div>
                            </div>

                            <div className="p-6 bg-white">
                                <ul className="mb-6 space-y-3">
                                    {pkg.features.map((feature, i) => (
                                        <li key={i} className="flex items-start">
                                            <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-gray-600">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <a
                                    href="#contact"
                                    className={`block text-center py-3 px-4 rounded-md font-medium ${
                                        pkg.isPopular
                                            ? 'bg-red-500 hover:bg-red-600 text-white'
                                            : 'bg-blue-900 hover:bg-blue-800 text-white'
                                    } transition duration-300`}
                                >
                                    Get Started
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-gray-600 mb-4">Need a custom package tailored to your specific requirements?</p>
                    <a href="#contact" className="inline-block bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-md font-medium transition duration-300">
                        Request Custom Quote
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Packages;
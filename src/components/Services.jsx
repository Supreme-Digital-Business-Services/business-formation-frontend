import React from 'react';

const Services = () => {
    const services = [
        {
            title: "Free Zone Company",
            icon: "🏢",
            description: "100% foreign ownership with 0% corporate & personal tax. Ideal for international businesses."
        },
        {
            title: "Mainland Company",
            icon: "🌆",
            description: "Trade freely throughout UAE with no restrictions. Perfect for businesses targeting the local market."
        },
        {
            title: "Offshore Company",
            icon: "🌊",
            description: "Asset protection & privacy with minimal reporting requirements. Great for holding assets."
        },
        {
            title: "Business Licensing",
            icon: "📜",
            description: "Professional guidance through the entire licensing process for all business activities."
        },
        {
            title: "UAE Resident Visas",
            icon: "✈️",
            description: "Residency visas for business owners, family members, and employees with fast processing."
        },
        {
            title: "Corporate Banking",
            icon: "🏦",
            description: "Expert assistance with corporate bank account opening with leading UAE banks."
        }
    ];

    return (
        <section id="services" className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-blue-900">Our Business Setup Services</h2>
                    <div className="w-24 h-1 bg-teal-500 mx-auto mt-4 mb-6"></div>
                    <p className="text-gray-600 max-w-3xl mx-auto">
                        Comprehensive business formation services tailored to your needs, ensuring a smooth entry into Dubai's thriving market.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-t-4 border-teal-500">
                            <div className="text-3xl mb-4">{service.icon}</div>
                            <h3 className="text-xl font-bold text-blue-900 mb-2">{service.title}</h3>
                            <p className="text-gray-600">{service.description}</p>
                            <a href="#contact" className="mt-4 inline-block text-teal-500 hover:text-teal-600 font-medium">
                                Learn more →
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
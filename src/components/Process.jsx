import React from 'react';

const Process = () => {
    const steps = [
        {
            number: "01",
            title: "Free Consultation",
            description: "Our experts analyze your business needs to recommend the optimal company structure."
        },
        {
            number: "02",
            title: "Document Preparation",
            description: "We handle all necessary documentation, ensuring compliance with UAE regulations."
        },
        {
            number: "03",
            title: "License & Registration",
            description: "Our team submits applications and obtains your trade license and company registration."
        },
        {
            number: "04",
            title: "Bank Account & Visas",
            description: "We assist with corporate bank account opening and process residency visas."
        }
    ];

    return (
        <section id="process" className="py-16 bg-blue-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold">Our Simple 4-Step Process</h2>
                    <div className="w-24 h-1 bg-teal-500 mx-auto mt-4 mb-6"></div>
                    <p className="text-gray-200 max-w-3xl mx-auto">
                        We've streamlined the business setup process to make it as simple and hassle-free as possible.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step, index) => (
                        <div key={index} className="bg-blue-800 p-6 rounded-lg relative overflow-hidden group hover:bg-blue-700 transition duration-300">
                            <div className="text-6xl font-bold text-blue-700 opacity-10 absolute top-0 right-0 group-hover:text-teal-500">
                                {step.number}
                            </div>
                            <div className="relative z-10">
                                <div className="bg-teal-500 text-white w-10 h-10 rounded-full flex items-center justify-center mb-4">
                                    {index + 1}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                <p className="text-gray-300">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Process;
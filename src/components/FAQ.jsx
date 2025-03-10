import React, { useState } from 'react';

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: "What's the difference between Free Zone and Mainland companies?",
            answer: "Free Zone companies enjoy 100% foreign ownership and tax benefits but can only do business outside the UAE or with other Free Zone companies. Mainland companies can trade directly within the UAE market without restrictions but traditionally required a local sponsor (though recent changes allow 100% foreign ownership in many sectors)."
        },
        {
            question: "How long does it take to set up a company in Dubai?",
            answer: "The timeframe varies depending on the company type and jurisdiction. Typically, a Free Zone company can be set up in 1-2 weeks, while a Mainland company might take 2-4 weeks. Our expedited services can reduce these timeframes."
        },
        {
            question: "Do I need to be physically present in Dubai to set up my company?",
            answer: "Not always. For many Free Zone companies, the process can be completed remotely with proper documentation. However, for Mainland companies and certain Free Zones, at least one visit may be required for document signing. We can advise on specific requirements based on your situation."
        },
        {
            question: "What's the minimum capital requirement to start a business in Dubai?",
            answer: "Capital requirements vary by jurisdiction and business activity. Many Free Zones have no minimum capital requirement, while Mainland companies may require proof of capital for certain activities. We can provide specific information based on your business type."
        },
        {
            question: "How many visas can I obtain with my business license?",
            answer: "The number of visas depends on your company type, office space, and business activity. Free Zone packages typically include a limited number of visas (3-6), while Mainland companies' visa allocation is based on office space size and business activities."
        }
    ];

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-blue-900">Frequently Asked Questions</h2>
                    <div className="w-24 h-1 bg-teal-500 mx-auto mt-4 mb-6"></div>
                    <p className="text-gray-600">
                        Got questions about setting up a business in Dubai? Find quick answers to common inquiries.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                            <button
                                className="w-full text-left p-4 focus:outline-none bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
                                onClick={() => toggleFAQ(index)}
                            >
                                <span className="font-medium text-blue-900">{faq.question}</span>
                                <svg
                                    className={`w-5 h-5 text-blue-900 transform ${activeIndex === index ? 'rotate-180' : ''} transition-transform duration-200`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {activeIndex === index && (
                                <div className="p-4 bg-white">
                                    <p className="text-gray-600">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-100 text-center">
                    <p className="text-gray-700 mb-4">
                        Can't find the answer you're looking for? Our business setup experts are here to help.
                    </p>
                    <a href="#contact" className="inline-block bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-md font-medium transition duration-300">
                        Contact Us
                    </a>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
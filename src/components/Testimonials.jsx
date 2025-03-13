import React from 'react';

const Testimonials = () => {
    const testimonials = [
        {
            quote: "Excellent service from Supreme Digital Services. Shahina Navas was exceptionally supportive and made the SIRA license process smooth and efficient. Thank you for your great assistance!",
            name: "Farzana Mustafa",
            position: "Projection House LLC",
            image: "https://lh3.googleusercontent.com/a-/ALV-UjUu8rEdU-QYWCgx-N2JJMf5PnR3GhEeT-1ogCMaVLSemu8QZt5zhw=w36-h36-p-rp-mo-br100"
        },
        {
            quote: "I recently used the business setup service provided by Mr. Ehjaz, and I must say, it exceeded my expectations! From start to finish, the process was smooth and efficient.",
            name: "Shah Faisal",
            position: "Bright Craft FZ LLC",
            image: "https://lh3.googleusercontent.com/a/ACg8ocKOaj9u7xvVOYdeDjlhJ1LAMF87HZndkZZKQ8Hb85UtoV7O0w=w36-h36-p-rp-mo-br100"
        },
        {
            quote: "I had a fantastic experience with Supreme! They made my company formation process quick and hassle-free. Their PRO services are incredible, saving me both time and effort.",
            name: "Md Pervez",
            position: "Pervez Technical Services",
            image: "https://lh3.googleusercontent.com/a-/ALV-UjWTwuqHc6vnnYs5TsGDnXuszNOgDEOc8CnX-nGVpk-PXwUYW2s=s36-c-rp-mo-br100"
        }
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-blue-900">What Our Clients Say</h2>
                    <div className="w-24 h-1 bg-teal-500 mx-auto mt-4 mb-6"></div>
                    <p className="text-gray-600 max-w-3xl mx-auto">
                        Don't just take our word for it. Here's what entrepreneurs who've worked with us have to say.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md relative">
                            <div className="text-5xl text-teal-200 absolute top-4 right-4">"</div>
                            <p className="text-gray-600 mb-6 relative z-10">{testimonial.quote}</p>
                            <div className="flex items-center">
                                <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                                <div>
                                    <h4 className="font-medium text-blue-900">{testimonial.name}</h4>
                                    <p className="text-gray-500 text-sm">{testimonial.position}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <a href="https://www.google.com/search?q=supreme+digital+business+services+reviews" className="inline-block text-blue-900 hover:text-blue-700 font-medium">
                        Read More Client Stories →
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
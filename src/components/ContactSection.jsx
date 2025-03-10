import React, { useState } from 'react';
import { validateEmail, validatePhone, validateRequired, submitFormData } from '../utils/formUtils';

const ContactSection = () => {
    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        businessType: '',
        message: ''
    });

    // Form submission state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formStatus, setFormStatus] = useState({
        submitted: false,
        success: false,
        message: ''
    });

    // Form validation state
    const [errors, setErrors] = useState({});

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));

        // Clear error when user types
        if (errors[name]) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: null
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!validateRequired(formData.firstName)) {
            newErrors.firstName = 'First name is required';
        }

        if (!validateRequired(formData.lastName)) {
            newErrors.lastName = 'Last name is required';
        }

        if (!validateRequired(formData.email)) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!validateRequired(formData.phone)) {
            newErrors.phone = 'Phone number is required';
        } else if (!validatePhone(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await submitFormData(formData);
            setFormStatus({
                submitted: true,
                success: true,
                message: result.message
            });
            // Reset form on success
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                businessType: '',
                message: ''
            });
            // Scroll to the top of the form to show success message
            document.getElementById('contact-form').scrollIntoView({
                behavior: 'smooth'
            });
        } catch (error) {
            setFormStatus({
                submitted: true,
                success: false,
                message: error.message
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="py-16 bg-blue-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:flex items-center gap-12">
                    <div className="lg:w-1/2 mb-10 lg:mb-0">
                        <h2 className="text-3xl font-bold mb-6">Start Your Dubai Business Journey Today</h2>
                        <div className="w-24 h-1 bg-teal-500 mb-6"></div>
                        <p className="text-gray-200 mb-8">
                            Take the first step towards establishing your business in Dubai. Our experts are ready to guide you through every step of the process.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-500 flex items-center justify-center mt-1">
                                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium">Call Us</h3>
                                    <p className="mt-1 text-gray-300">+971 52 277 3056</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-500 flex items-center justify-center mt-1">
                                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium">Email Us</h3>
                                    <p className="mt-1 text-gray-300">connect@supremeservices.ae</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-500 flex items-center justify-center mt-1">
                                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium">Office Location</h3>
                                    <p className="mt-1 text-gray-300">Inside Max Metro Station, Dubai, UAE</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-lg font-medium mb-4">Connect With Us</h3>
                            <div className="flex space-x-4">
                                <a href="#" className="h-10 w-10 rounded-full bg-blue-800 hover:bg-blue-700 flex items-center justify-center transition duration-300">
                                    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                                    </svg>
                                </a>
                                <a href="#" className="h-10 w-10 rounded-full bg-blue-800 hover:bg-blue-700 flex items-center justify-center transition duration-300">
                                    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                                    </svg>
                                </a>
                                <a href="#" className="h-10 w-10 rounded-full bg-blue-800 hover:bg-blue-700 flex items-center justify-center transition duration-300">
                                    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </a>
                                <a href="#" className="h-10 w-10 rounded-full bg-blue-800 hover:bg-blue-700 flex items-center justify-center transition duration-300">
                                    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/2">
                        <div id="contact-form" className="bg-white p-8 rounded-lg shadow-lg">
                            <h3 className="text-2xl font-bold text-blue-900 mb-6">Get Free Consultation</h3>

                            {formStatus.submitted && (
                                <div className={`mb-6 p-4 rounded-md ${formStatus.success ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
                                    {formStatus.message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label htmlFor="firstName" className="block text-gray-700 mb-2">First Name</label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="Enter your first name"
                                            className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'} placeholder-black text-black`}
                                        />
                                        {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-gray-700 mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Enter your last name"
                                            className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'} placeholder-black text-black`}
                                        />
                                        {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email address"
                                        className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'} placeholder-black text-black`}
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="phone" className="block text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter your phone number"
                                        className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'} placeholder-black text-black`}
                                    />
                                    {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="businessType" className="block text-gray-700 mb-2">Business Type</label>
                                    <select
                                        id="businessType"
                                        name="businessType"
                                        value={formData.businessType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                    >
                                        <option value="" className="text-black">Select an option</option>
                                        <option value="freezone" className="text-black">Free Zone</option>
                                        <option value="mainland" className="text-black">Mainland</option>
                                        <option value="offshore" className="text-black">Offshore</option>
                                        <option value="freelance" className="text-black">Freelance Permit</option>
                                    </select>
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="message" className="block text-gray-700 mb-2">Your Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows="4"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Type your message here"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black text-black"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md font-medium transition duration-300 disabled:bg-red-300"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                                </button>

                                <p className="text-gray-500 text-sm mt-4 text-center">
                                    We respect your privacy. Your information will not be shared with third parties.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
import React, { useState } from 'react';
import { validateEmail, validatePhone, validateRequired, submitFormData } from '../utils/formUtils';

const Hero = () => {
    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        businessType: ''
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

        if (!validateRequired(formData.fullName)) {
            newErrors.fullName = 'Name is required';
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
            const [firstName, ...lastNameParts] = formData.fullName.split(' ');
            const lastName = lastNameParts.join(' ') || 'Unknown'; // Default lastName to 'Unknown' if not provided

            // Submit the form data with separated firstName and lastName
            const result = await submitFormData({
                firstName,
                lastName,
                email: formData.email,
                phone: formData.phone,
                businessType: formData.businessType
            });

            setFormStatus({
                submitted: true,
                success: true,
                message: result.message
            });
            // Reset form on success
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                businessType: ''
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
        <div className="relative bg-blue-900">
            <div className="absolute inset-0 z-0 opacity-30 bg-center bg-cover" style={{ backgroundImage: "url('https://via.placeholder.com/1920x1080')" }}></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
                <div className="lg:flex items-center gap-10">
                    <div className="lg:w-3/5 mb-10 lg:mb-0">
                        <div className="bg-blue-600 inline-block px-3 py-1 text-white text-sm font-semibold rounded-full mb-3">
                            Starting from AED 5,750
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Business Setup in Dubai <span className="text-red-500">Made Simple</span>
                        </h1>
                        <p className="text-lg text-gray-100 mb-8">
                            Professional company formation services tailored to entrepreneurs and investors. 100% foreign ownership with 0% corporate & personal tax.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a href="#contact" className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md font-medium transition duration-300">
                                Start Your Business
                            </a>
                            <a href="#packages" className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white hover:text-blue-900 transition duration-300">
                                View Packages
                            </a>
                        </div>
                        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="bg-teal-500 p-3 rounded-full">
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="text-white mt-2 text-sm">Quick Setup</span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="bg-teal-500 p-3 rounded-full">
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="text-white mt-2 text-sm">0% Tax</span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="bg-teal-500 p-3 rounded-full">
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                                <span className="text-white mt-2 text-sm">Bank Assistance</span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="bg-teal-500 p-3 rounded-full">
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <span className="text-white mt-2 text-sm">Visa Services</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-2/5">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-2xl font-bold text-blue-900 mb-4">Get Free Consultation</h3>

                            {formStatus.submitted && (
                                <div className={`mb-4 p-3 rounded-md ${formStatus.success ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
                                    {formStatus.message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Full Name"
                                        className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email Address"
                                        className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Phone Number"
                                        className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                                </div>
                                <div className="mb-4">
                                    <select
                                        name="businessType"
                                        value={formData.businessType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Business Type</option>
                                        <option value="freezone">Free Zone</option>
                                        <option value="mainland">Mainland</option>
                                        <option value="offshore">Offshore</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-md font-medium transition duration-300 disabled:bg-red-300"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                                </button>
                            </form>
                            <div className="mt-4 flex justify-center">
                                <a href="https://wa.me/971522773056?text=Hello!%20I'm%20interested%20in%20business%20setup%20in%20Dubai." className="flex items-center text-green-600 hover:text-green-700">
                                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    Speak with an Expert
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
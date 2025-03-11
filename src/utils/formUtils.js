// Form validation functions
export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const validatePhone = (phone) => {
    // Basic validation for international phone numbers
    const regex = /^\+?[0-9\s\-()]{8,20}$/;
    return regex.test(phone);
};

export const validateRequired = (value) => {
    return value.trim() !== '';
};

// Form submission function (simulate API call)
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const submitFormData = async (formData) => {
    try {
        // Map frontend form fields to backend expected format
        const backendData = {
            firstName: formData.firstName || formData.fullName?.split(' ')[0] || '',
            lastName: formData.lastName || formData.fullName?.split(' ').slice(1).join(' ') || '',
            email: formData.email,
            phone: formData.phone,
            businessType: formData.businessType || '',
            message: formData.message || ''
        };

        // Make actual API call to your backend
        const response = await fetch(`${API_BASE_URL}/leads`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(backendData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to submit form');
        }

        return {
            success: true,
            message: data.message || 'Thank you for your submission! Our team will contact you shortly.'
        };
    } catch (error) {
        console.error('Form submission error:', error);
        return {
            success: false,
            message: error.message || 'There was an error submitting your request. Please try again.'
        };
    }
};
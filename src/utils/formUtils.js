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
export const submitFormData = async (formData) => {
    // In a real application, this would be an API call
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // Simulate successful submission (90% success rate)
            if (Math.random() < 0.9) {
                resolve({
                    success: true,
                    message: 'Thank you for your submission! Our team will contact you shortly.'
                });
            } else {
                reject({
                    success: false,
                    message: 'There was an error submitting your request. Please try again.'
                });
            }
        }, 1000);
    });
};
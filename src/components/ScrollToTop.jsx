import React from 'react';
import useScrollTop from '../hooks/useScrollTop';

const ScrollToTop = () => {
    const { showScrollTop, scrollToTop } = useScrollTop(300);

    return (
        <>
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 p-3 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-all duration-300 z-50"
                    aria-label="Scroll to top"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                    </svg>
                </button>
            )}
        </>
    );
};

export default ScrollToTop;
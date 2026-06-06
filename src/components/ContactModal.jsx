import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

const ContactModal = ({ isOpen, onClose }) => {
  // Function to trigger confetti with multiple bursts
  const triggerConfetti = () => {
    // First burst
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#fcd34d', '#fde68a', '#4ade80', '#34d399'],
    })

    // Second burst after a short delay
    setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ['#fbbf24', '#fcd34d', '#fde68a'],
      })
    }, 300)

    // Third burst from the other side
    setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ['#fbbf24', '#fcd34d', '#fde68a'],
      })
    }, 600)
  };

  useEffect(() => {
    if (isOpen) {
      triggerConfetti();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 relative">
        <button 
          onClick={onClose}
          className="absolute top-2.5 right-2.5 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Let's Talk!</h2>
          <p className="text-gray-600 mb-6">Thank you for visiting my portfolio and getting this far!</p>
          
          <div className="flex justify-center space-x-6 mb-6">
            <a 
              href="https://linkedin.com/in/victoriamazilu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            
            <a 
              href="https://twitter.com/victoriamazilu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-800 hover:text-black transition-colors"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
          
          <div className="mb-6">
            <a 
              href="mailto:vmazilu@uwaterloo.ca"
              className="inline-flex items-center text-gray-700 hover:text-gray-900 transition-colors"
            >
              vmazilu@uwaterloo.ca
            </a>
          </div>
          
          <p className="text-sm text-gray-500">
            I'm always open to discussing new projects, opportunities, or just having a friendly chat!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;

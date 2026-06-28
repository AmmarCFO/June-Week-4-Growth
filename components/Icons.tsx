
import React from 'react';

interface IconProps {
    className?: string;
}

export const CurrencyDollarIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v1m0 6v1m0-10a9 9 0 110 18 9 9 0 010-18z" />
  </svg>
);

export const BanknotesIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 15.536A9.004 9.004 0 0112 15c-2.485 0-4.5-1.79-4.5-4s2.015-4 4.5-4 4.5 1.79 4.5 4c0 .608-.121 1.182-.343 1.714M17.536 19.464l-3.03-3.03m0 0a1.5 1.5 0 012.122 0l1.378 1.378a1.5 1.5 0 010 2.122l-1.377 1.378a1.5 1.5 0 01-2.122 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.721 21.321a9.025 9.025 0 001.365-2.321" />
  </svg>
);

export const ChartBarIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export const PlayCircleIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6l5-3-5-3z" />
    </svg>
);

export const FacebookIcon: React.FC<IconProps> = ({ className = "w-8 h-8 text-blue-500" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.323-1.325z" />
  </svg>
);

export const InstagramIcon: React.FC<IconProps> = ({ className = "w-8 h-8 text-pink-500" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44c0-.795-.645-1.44-1.441-1.44z" />
  </svg>
);

export const TikTokIcon: React.FC<IconProps> = ({ className = "w-8 h-8 text-white" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.84-.95-6.43-2.8-1.59-1.87-2.16-4.56-1.56-6.81.6-2.25 2.51-4.21 4.78-4.78 2.26-.57 4.69-.46 6.64.03.01 2.11-.01 4.21.01 6.32 0 .6-.13 1.18-.38 1.72-.25.54-.6 1.05-1.02 1.47-.42.42-.92.76-1.47.99-.55.23-1.15.36-1.75.38v.28c.34-.01.68-.04.99-.15.48-.16.92-.44 1.3-.78.38-.34.68-.76.91-1.22.23-.46.38-.97.41-1.48V.02z"/>
    </svg>
);

export const BayutIcon: React.FC<IconProps> = ({ className = "w-8 h-8 text-green-500" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.04 15.44L6.5 13.01l1.41-1.41 3.05 3.04 5.6-5.6L18 10.49l-7.04 4.95z"/>
    </svg>
);

export const PlayIcon: React.FC<IconProps> = ({ className = "w-16 h-16 text-[#F1ECE6]/80" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
);

export const UploadIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

export const AirbnbIcon: React.FC<IconProps> = ({ className = "w-8 h-8 text-[#FF5A5F]" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.5,12.5c0-0.7-0.1-1.4-0.4-2l-7.5-10c-0.6-0.8-1.5-1.2-2.5-1.2c-1,0-1.9,0.5-2.5,1.2l-7.5,10c-0.3,0.6-0.4,1.3-0.4,2 c0,3.9,3.1,7,7,7c0.6,0,1.2-0.1,1.8-0.2c0.2,0,0.4,0,0.6,0c0.6,0.1,1.2,0.2,1.8,0.2c3.9,0,7-3.1,7-7H22.5z M12,21.5 c-1.4,0-2.6-0.4-3.7-1c-0.2-0.1-0.3-0.2-0.5-0.4c-0.4-0.3-0.7-0.7-1-1.1c-0.6-0.9-1-1.9-1-3c0-0.4,0.1-0.8,0.2-1.2 c0.1-0.4,0.3-0.8,0.5-1.1l0,0c0.1-0.2,0.3-0.4,0.5-0.6c0.6-0.7,1.3-1.2,2.2-1.6c0.9-0.4,1.8-0.6,2.8-0.6c1,0,1.9,0.2,2.8,0.6 c0.9,0.4,1.7,0.9,2.2,1.6c0.2,0.2,0.4,0.4,0.5,0.6l0,0c0.2,0.3,0.4,0.7,0.5,1.1c0.1,0.4,0.2,0.8,0.2,1.2c0,1.1-0.4,2.2-1,3 c-0.3,0.4-0.6,0.8-1,1.1c-0.2,0.1-0.3,0.2-0.5,0.4C14.6,21.1,13.4,21.5,12,21.5z"/>
    </svg>
);

export const AqarIcon: React.FC<IconProps> = ({ className = "w-8 h-8 text-blue-600" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" fill="none" />
        <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize="14" fontWeight="bold" fill="currentColor">A</text>
    </svg>
);

export const LinkIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);

export const PhotoIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const CalculatorIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

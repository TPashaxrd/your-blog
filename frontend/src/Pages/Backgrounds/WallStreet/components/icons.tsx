
import React from 'react';

// From lucide-react: trending-up
export const TrendingUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

// From lucide-react: trending-down
export const TrendingDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
    <polyline points="16 17 22 17 22 11" />
  </svg>
);

// From lucide-react: minus
export const MinusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5 12h14" />
  </svg>
);

// From lucide-react: candlestick-chart
export const CandlestickChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M9 5v4"/>
    <rect width="4" height="6" x="7" y="9" rx="1"/>
    <path d="M9 15v2"/>
    <path d="M17 3v2"/>
    <rect width="4" height="8" x="15" y="5" rx="1"/>
    <path d="M17 13v6"/>
  </svg>
);

// From lucide-react: bitcoin
export const BitcoinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M11.8 19.2c-2 .8-4.2.4-5.6-1.2-1.8-2-1.5-5.1.6-6.9 1.1-.9 2.5-1.4 3.9-1.4.3 0 .6 0 .9.1.5.1 1 .2 1.5.4 1.1.4 2.2 1.1 2.8 2.2.5 1 .5 2.2 0 3.2-1.2 2.4-4.2 3.5-6.1 3.6Z"/>
    <path d="M15 6.8c.8-.8 1.9-1.3 3-1.3 2.1 0 3.8 1.7 3.8 3.8 0 1.4-.8 2.7-1.9 3.4"/>
    <path d="M15 17.2c.8.8 1.9 1.3 3 1.3 2.1 0 3.8-1.7 3.8-3.8 0-1.4-.8-2.7-1.9-3.4"/>
    <path d="M5 10.5v.9c0 1.2 1 2.1 2.1 2.1h.5"/>
    <path d="M5 14.8v-.9c0-1.2 1-2.1 2.1-2.1h.5"/>
    <path d="M12.5 6.5V2"/>
    <path d="M12.5 22v-4.5"/>
    <path d="M12.5 12.5h-1c-1 0-1.8-.8-1.8-1.8v-.4c0-1 .8-1.8 1.8-1.8h1"/>
    <path d="M12.5 12.5h-1c-1 0-1.8.8-1.8 1.8v.4c0 1 .8 1.8 1.8 1.8h1"/>
  </svg>
);

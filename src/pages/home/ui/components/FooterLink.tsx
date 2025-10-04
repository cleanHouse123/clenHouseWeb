import React from 'react';

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const FooterLink: React.FC<FooterLinkProps> = ({ 
  href, 
  children, 
  className = '' 
}) => {
  return (
    <a 
      className={`text-[12px] sm:text-[13px] md:text-[14px] font-normal leading-[1.275] text-[rgba(0,0,0,0.7)] hover:text-[rgba(0,0,0,0.9)] transition-colors ${className}`}
      href={href}
    >
      {children}
    </a>
  );
};

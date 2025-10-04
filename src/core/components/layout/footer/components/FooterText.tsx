import React from 'react';

interface FooterTextProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  weight?: 'normal' | 'medium';
  opacity?: '70' | '80' | '90' | '40' | '60';
  children: React.ReactNode;
  className?: string;
}

const sizeClasses = {
  sm: 'text-[12px] sm:text-[13px] md:text-[14px]',
  md: 'text-[14px] sm:text-[15px] md:text-[16px]',
  lg: 'text-[16px] sm:text-[17px] md:text-[18px] lg:text-[20px]',
  xl: 'text-[20px] sm:text-[22px] md:text-[24px] lg:text-[28px]'
};

const weightClasses = {
  normal: 'font-normal',
  medium: 'font-medium'
};

const opacityClasses = {
  '70': 'text-[rgba(0,0,0,0.7)]',
  '80': 'text-[rgba(0,0,0,0.8)]',
  '90': 'text-[rgba(0,0,0,0.9)]',
  '40': 'text-[rgba(0,0,0,0.4)]',
  '60': 'text-[rgba(0,0,0,0.6)]'
};

export const FooterText: React.FC<FooterTextProps> = ({ 
  size = 'md',
  weight = 'normal',
  opacity = '70',
  children,
  className = ''
}) => {
  return (
    <div className={`${sizeClasses[size]} ${weightClasses[weight]} ${opacityClasses[opacity]} leading-[1.275] text-center sm:text-left ${className}`}>
      {children}
    </div>
  );
};

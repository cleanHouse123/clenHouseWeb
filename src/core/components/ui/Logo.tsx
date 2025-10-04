import React from 'react';
import { LogoHouse } from './icons';

export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

interface LogoProps {
  size?: LogoSize;
  className?: string;
  onClick?: () => void;
}

const sizeConfig = {
  sm: {
    textSize: 'text-lg',
    iconWidth: 24,
    iconHeight: 21,
    gap: 'gap-1'
  },
  md: {
    textSize: 'text-xl',
    iconWidth: 28,
    iconHeight: 24,
    gap: 'gap-1.5'
  },
  lg: {
    textSize: 'text-2xl',
    iconWidth: 31.5,
    iconHeight: 28,
    gap: 'gap-2'
  },
  xl: {
    textSize: 'text-[24.7619px]',
    iconWidth: 31.5,
    iconHeight: 28,
    gap: 'gap-2'
  }
};

export const Logo: React.FC<LogoProps> = ({ 
  size = 'lg', 
  className = '', 
  onClick 
}) => {
  const config = sizeConfig[size];
  
  const logoContent = (
    <span className={`flex items-center ${config.gap} font-bold font-onest ${config.textSize} leading-[1.275] text-[#000] ${className}`}>
      <span>чисто</span>
      <LogoHouse width={config.iconWidth} height={config.iconHeight} />
      <span>дома</span>
    </span>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="flex items-center hover:opacity-90 transition-opacity"
        aria-label="ЧистоДома — на главную"
      >
        {logoContent}
      </button>
    );
  }

  return logoContent;
};

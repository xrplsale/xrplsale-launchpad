import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon';
  className?: string;
}

export function Logo({ size = 'md', variant = 'full', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20'
  };

  const imageSizes = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 80
  };

  // Always render just the logo without text
  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <Image
        src="/images/xrplsale_logo_transparent.png"
        alt="XRPL.Sale"
        width={imageSizes[size]}
        height={imageSizes[size]}
        className="w-full h-full object-contain"
        priority={size === 'lg'}
      />
    </div>
  );
}
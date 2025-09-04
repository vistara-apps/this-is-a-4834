import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'bordered';
}

export function Card({ children, className = '', variant = 'default' }: CardProps) {
  const baseClasses = 'bg-dark-surface rounded-lg shadow-card';
  const variantClasses = {
    default: '',
    bordered: 'border border-dark-border'
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-6 pb-2 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-6 pt-2 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-6 pt-2 ${className}`}>
      {children}
    </div>
  );
}
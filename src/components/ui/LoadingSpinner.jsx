import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <Loader2
      size={size === 'sm' ? 16 : size === 'md' ? 24 : size === 'lg' ? 32 : 48}
      className={`animate-spin text-primary-500 ${className}`}
    />
  );
}

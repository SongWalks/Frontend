import { Icon } from '@iconify/react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => {
  const sizeStyles = {
    sm: 'text-2xl', // 24px (버튼 안이나 좁은 영역)
    md: 'text-4xl', // 36px (기본)
    lg: 'text-6xl', // 60px (전체 화면 중앙)
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      {/* 💡 animate-spin 클래스로 무한 회전 효과를 줍니다 */}
      <Icon
        icon="ph:spinner-gap-bold"
        className={`animate-spin text-brand-blue ${sizeStyles[size]}`}
      />
    </div>
  );
};

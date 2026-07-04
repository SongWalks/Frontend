import { Icon } from '@iconify/react';

interface IconButtonProps {
  icon: string;
  onClick?: () => void;
  className?: string; // 예외적으로 색상을 바꿔야 할 때만 (예: text-point-red)
}

export const IconButton = ({
  icon,
  onClick,
  className = '',
}: IconButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        p-2 rounded-full transition-colors duration-200 
        hover:bg-gray-100 active:bg-gray-200
        flex items-center justify-center
        ${className}
      `}
    >
      {/* 💡 아이콘 크기는 무조건 24px(text-2xl) 또는 20px(text-xl)로 고정 */}
      <Icon icon={icon} className="text-[22px] text-gray-800" />
    </button>
  );
};

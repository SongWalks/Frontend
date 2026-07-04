import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import { ICONS } from '@/constants/icons';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  icon?: string;
}

export const Toast = ({
  message,
  isVisible,
  onClose,
  duration = 3000,
  icon = ICONS.CHECK,
}: ToastProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  // 💡 기존의 if (!isVisible) return null; 삭제!
  // 대신 아래 className에서 opacity와 translate로 상태를 전환합니다.

  return (
    <div
      className={`
        absolute bottom-24 left-1/2 -translate-x-1/2 z-[100] w-max max-w-[90%] 
        px-5 py-3 bg-gray-800 text-white text-sm font-medium rounded-full shadow-lg 
        flex items-center gap-2 
        
        /* ✨ 1. 부드러운 전환을 위한 핵심 속성 */
        transition-all duration-300 ease-in-out
        
        /* ✨ 2. isVisible 상태에 따라 투명도와 위치를 조절 */
        ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }
      `}
    >
      <Icon icon={icon} className="text-[#3DA5F5] text-lg shrink-0" />
      <span className="truncate">{message}</span>
    </div>
  );
};

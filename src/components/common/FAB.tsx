import { Icon } from '@iconify/react';
import { ICONS } from '@/constants/icons';

interface FABProps {
  onClick: () => void;
  text?: string;
  icon?: string;
  className?: string;
}

export const FAB = ({
  onClick,
  text,
  icon = ICONS.PLUS,
  className = '',
}: FABProps) => {
  const isPill = Boolean(text);

  return (
    <button
      onClick={onClick}
      className={`
        absolute bottom-28 right-4 z-40 
        flex items-center justify-center gap-1.5
        bg-brand-lightBlue text-white font-bold
        
        /* 💡 1. 3D 입체감의 핵심: 위쪽 빛 맺힘(inset) + 아래쪽 깊은 그림자 */
        shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_8px_16px_rgba(0,0,0,0.15)]
        
        /* 💡 2. 살짝 띄워지는 호버 효과 (PC용) */
        hover:-translate-y-0.5 hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),0_12px_20px_rgba(0,0,0,0.2)]
        
        /* 💡 3. 진짜 버튼이 쑥! 눌리는 물리적 타격감 (모바일 터치용) */
        active:translate-y-1 active:shadow-[inset_0_0px_4px_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.15)]
        
        transition-all duration-200 ease-out
        
        ${isPill ? 'px-5 py-3 rounded-full text-[15px]' : 'w-14 h-14 rounded-full text-2xl'}
        ${className}
      `}
    >
      <Icon icon={icon} className={isPill ? 'text-lg' : ''} />
      {text && <span>{text}</span>}
    </button>
  );
};

import { ICONS } from '@/constants/icons';
import { IconButton } from '@/components/common/IconButton';
import sooLogo from '@/assets/icons/soo-logo.png';

export const HomeHeader = ({
  isScrolled = false,
}: {
  isScrolled?: boolean;
}) => {
  return (
    <header
      className={`flex justify-between items-center w-full h-[56px] px-2 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm' // 스크롤 내렸을 때: 반투명 유리 배경
          : 'bg-transparent' // 맨 위에 있을 때: 투명 배경
      }`}
    >
      <div className="flex items-center w-12 h-12 ml-2">
        <img
          src={sooLogo}
          alt="SOO Logo"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="flex items-center justify-end mr-1">
        <div className="relative mt-1">
          <IconButton icon={ICONS.BELL} />
          <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-point-red rounded-full" />
        </div>
      </div>
    </header>
  );
};

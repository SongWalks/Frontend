import { ICONS } from '@/constants/icons';
import { IconButton } from '@/components/common/IconButton';
import sooLogo from '@/assets/icons/soo-logo.png';

export const HomeHeader = () => {
  return (
    // 배경을 아예 투명(bg-transparent)으로 고정합니다.
    <header className="relative flex justify-between items-center w-full h-[56px] px-2 bg-transparent z-50">
      {/* 1. 좌측 로고 영역 */}
      <div className="flex items-center w-12 h-12 ml-2">
        <img
          src={sooLogo}
          alt="SOO Logo"
          className="w-full h-full object-contain"
        />
      </div>

      {/* 2. 우측 알림 영역 */}
      <div className="flex items-center justify-end mr-1">
        <div className="relative mt-1">
          <IconButton icon={ICONS.BELL} />
          {/* TODO: 알림이 있을 때만 띄우는 빨간 점 (나중에 상태로 관리) */}
          <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-point-red rounded-full" />
        </div>
      </div>
    </header>
  );
};

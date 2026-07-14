import React, { useState } from 'react';
import { Icon } from '@iconify/react';

interface MenuItem {
  icon: string;
  title: string;
  description: string;
  badge?: string | number;
}

const MyPage = () => {
  const userEmail = 'su*******@sookmyung.ac.kr';

  // 💡 알림 설정 토글 스위치를 위한 상태(State) 추가
  const [isAlertOn, setIsAlertOn] = useState(false);

  const exchangeMenus: MenuItem[] = [
    {
      icon: 'lucide:file-text',
      title: '내 교환 게시글',
      description: '등록한 교환 게시글 관리',
    },
    {
      icon: 'lucide:link',
      title: '교환 추천 매칭함',
      description: '나에게 맞는 교환 게시글 추천',
      badge: 'new',
    },
    {
      icon: 'lucide:message-circle',
      title: '교환 요청함',
      description: '받은 요청 및 보낸 요청',
      badge: 3,
    },
    {
      icon: 'lucide:heart',
      title: '찜 목록',
      description: '관심 있는 교환 게시글 모아보기',
    },
    {
      icon: 'fa6-solid:graduation-cap',
      title: '졸업요건 과목 등록',
      description: '졸업에 필요한 과목 등록 및 관리',
    },
  ];

  const loungeMenus: MenuItem[] = [
    {
      icon: 'lucide:edit-3',
      title: '내 라운지 게시글',
      description: '등록한 라운지 게시글 관리',
    },
    {
      icon: 'lucide:bookmark',
      title: '북마크 목록',
      description: '관심있는 라운지 게시글 모아보기',
    },
  ];

  // 💡 알림 설정 렌더링을 내부에서 수동 처리할 것이므로, 비밀번호 변경만 배열에 남겨둡니다.
  const accountMenus: MenuItem[] = [
    { icon: 'lucide:lock', title: '비밀번호 변경', description: '' },
  ];

  const renderMenuItem = (item: MenuItem, index: number) => (
    <div
      key={index}
      className="flex items-center justify-between py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
    >
      <div className="flex items-center space-x-4">
        <div className="w-6 h-6 flex items-center justify-center text-brand-lightBlue">
          <Icon icon={item.icon} className="w-5 h-5" fill="currentColor" />
        </div>
        <div>
          <h4 className="text-[15px] font-semibold text-gray-900 tracking-tight">
            {item.title}
          </h4>
          {item.description && (
            <p className="text-xs text-gray-400 mt-0.5 tracking-tight">
              {item.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {item.badge === 'new' && (
          <span className="w-[37px] h-[17px] bg-brand-lightBlue text-white text-[11px] font-bold rounded-full flex items-center justify-center">
            NEW
          </span>
        )}
        {typeof item.badge === 'number' && (
          <span className="text-white text-xs font-regular w-5 h-5 flex items-center justify-center rounded-full bg-brand-lightBlue">
            {item.badge}
          </span>
        )}
        <span className="text-gray-400 text-sm font-medium">&gt;</span>
      </div>
    </div>
  );

  return (
    <div
      style={{
        fontFamily:
          "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif",
      }}
      className="w-full bg-[#FBFBFB] text-gray-800 flex flex-col antialiased min-h-full"
    >
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');
      `}</style>

      <header className="p-4 bg-white flex justify-between items-center sticky top-0 z-10 border-b border-gray-50 flex-shrink-0">
        <button className="text-black flex items-center justify-center">
          <Icon icon="lucide:chevron-left" className="w-[20px] h-[20px]" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 tracking-tight">
          마이페이지
        </h1>
        <button className="text-black flex items-center justify-center">
          <Icon icon="lucide:bell" className="w-[18px] h-[17.33px]" />
        </button>
      </header>

      <div className="px-5 pb-12 flex flex-col flex-1">
        {/* 프로필 영역 */}
        <div className="py-6 flex items-center space-x-4 border-b border-gray-100">
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
            <Icon icon="lucide:user" className="w-7 h-7 text-gray-400" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-gray-900 flex items-center gap-1 tracking-tight">
              {userEmail}
            </h2>
            <p className="text-[11px] text-[#3582FF] font-medium flex items-center gap-1 mt-0.5 tracking-tight">
              <span className="bg-[#EBF3FF] p-0.5 px-1 rounded-sm text-[9px]">
                ✓
              </span>{' '}
              숙명여자대학교 인증 계정
            </p>
          </div>
        </div>

        {/* 교환 활동 섹션 */}
        <div className="mt-6">
          <h3 className="text-xs font-bold text-gray-400 tracking-wider mb-2">
            교환 활동
          </h3>
          <div className="flex flex-col">
            {exchangeMenus.map((menu, idx) => renderMenuItem(menu, idx))}
          </div>
        </div>

        {/* 라운지 섹션 */}
        <div className="mt-8">
          <h3 className="text-xs font-bold text-gray-400 tracking-wider mb-2">
            라운지
          </h3>
          <div className="flex flex-col">
            {loungeMenus.map((menu, idx) => renderMenuItem(menu, idx))}
          </div>
        </div>

        {/* 계정 설정 섹션 */}
        <div className="mt-8">
          <h3 className="text-xs font-bold text-gray-400 tracking-wider mb-2">
            계정
          </h3>
          <div className="flex flex-col">
            {/* 💡 시안 반영 1: 알림 설정 전용 행 커스텀 (토글 스위치 포함) */}
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 flex items-center justify-center text-brand-lightBlue">
                  <Icon icon="lucide:bell" className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[15px] font-semibold text-gray-900 tracking-tight">
                    알림 받기
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5 tracking-tight">
                    교환 제안을 빠르게 확인하기 위한 알림 수신
                  </p>
                </div>
              </div>

              {/* 💡 시안의 토글 스위치 컴포넌트 */}
              <button
                onClick={() => setIsAlertOn(!isAlertOn)}
                className={`w-[44px] h-[24px] flex items-center rounded-full p-0.5 transition-colors duration-300 ${
                  isAlertOn ? 'bg-brand-lightBlue' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`bg-white w-[20px] h-[20px] rounded-full shadow transform transition-transform duration-300 ${
                    isAlertOn ? 'translate-x-[20px]' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 비밀번호 변경 등 나머지 메뉴 렌더링 */}
            {accountMenus.map((menu, idx) => renderMenuItem(menu, idx))}
          </div>
        </div>

        {/* 💡 시안 반영 2: 로그아웃 & 회원탈퇴 가로 정렬 탭 분위기 구현 */}
        <div className="mt-auto pt-10 pb-4 flex justify-center items-center space-x-8 text-[14px]">
          <button
            onClick={() => console.log('로그아웃')}
            className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            로그아웃
          </button>

          <span className="text-gray-200">|</span>

          <button
            onClick={() => console.log('회원탈퇴')}
            className="text-[#FF5A5F] hover:text-red-700 font-semibold transition-colors"
          >
            회원탈퇴
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPage;

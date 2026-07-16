import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS } from '@/constants/icons'; //

import Header from '@/components/layout/Header';
import { IconButton } from '@/components/common/IconButton';
import { Modal } from '@/components/common/Modal';
import postIcon from '@/assets/icons/post_icon.svg';
import exchangeIcon from '@/assets/icons/exchange_recommend_icon.svg';
import likeIcon from '@/assets/icons/like_icon.svg';
import bookmarkIcon from '@/assets/icons/bookmark_icon.svg';
import graduationIcon from '@/assets/icons/graduation_icon.svg';
import chatIcon from '@/assets/icons/chat_icon.svg';
import lockIcon from '@/assets/icons/lock_icon.svg';
import logoutIcon from '@/assets/icons/logout_icon.svg';
import deleteIcon from '@/assets/icons/delete_icon.svg';
import finalAlertIcon from '@/assets/icons/final_alert.svg';

interface MenuItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  fontSizeClass: string;
  badge?: string | number;
  onClick?: () => void; // 💡 각 메뉴별 클릭 이벤트 추가
}

const MyPage = () => {
  const navigate = useNavigate();
  const userEmail = 'su*******@sookmyung.ac.kr';

  // 상태 관리
  const [isAlertOn, setIsAlertOn] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // 탈퇴 모달 2가지를 제어하기 위한 상태
  const [isWithdrawBlockModalOpen, setIsWithdrawBlockModalOpen] =
    useState(false); // 교환 진행 중일 때 뜨는 모달
  const [isWithdrawConfirmModalOpen, setIsWithdrawConfirmModalOpen] =
    useState(false); // 최종 확인 모달

  // 🛠️ 테스트용 변수 (백엔드 연동 전까지 화면 확인용)
  // true로 두면 왼쪽 시안(교환 중 알림)이 먼저 뜨고, 파란 버튼을 누르면 오른쪽 시안이 뜹니다.
  const hasOngoingExchange = true;

  // 1. 교환 활동 섹션
  const exchangeMenus: MenuItem[] = [
    {
      icon: (
        <img
          src={postIcon}
          alt="내 교환 게시글"
          className="w-[18px] h-[18px]"
        />
      ),
      title: '내 교환 게시글',
      description: '등록한 교환 게시글 관리',
      fontSizeClass: 'text-[15px]',
      onClick: () => navigate('/my/posts'),
    },
    {
      icon: (
        <img src={exchangeIcon} alt="교환 추천 매칭함" className="w-6 h-6" />
      ),
      title: '교환 추천 매칭함',
      description: '나에게 맞는 교환 게시글 추천',
      fontSizeClass: 'text-[15px]',
      badge: 'new',
    },
    {
      icon: <img src={chatIcon} alt="교환 요청함" className="w-5 h-[19px]" />,
      title: '교환 요청함',
      description: '받은 요청 및 보낸 요청',
      fontSizeClass: 'text-[15px]',
      badge: 3,
    },
    {
      icon: <img src={likeIcon} alt="찜 목록" className="w-5 h-5" />,
      title: '찜 목록',
      description: '관심 있는 교환 게시글 모아보기',
      fontSizeClass: 'text-[15px]',
      onClick: () => navigate('/my/likes'),
    },
    {
      icon: (
        <img
          src={graduationIcon}
          alt="졸업요건 과목 등록"
          className="w-[18px] h-[15px]"
        />
      ),
      title: '졸업요건 과목 등록',
      description: '졸업에 필요한 과목 등록 및 관리',
      fontSizeClass: 'text-[16px]',
      onClick: () => navigate('/my/graduation'),
    },
  ];

  // 2. 라운지 섹션 메뉴
  const loungeMenus: MenuItem[] = [
    {
      icon: <img src={postIcon} alt="내 라운지 게시글" className="size-5" />,
      title: '내 라운지 게시글',
      description: '등록한 라운지 게시글 관리',
      fontSizeClass: 'text-[16px]',
      onClick: () => navigate('/my/lounge'),
    },
    {
      icon: (
        <img src={bookmarkIcon} alt="북마크 목록" className="w-[11px] h-4" />
      ),
      title: '북마크 목록',
      description: '관심있는 라운지 게시글 모아보기',
      fontSizeClass: 'text-[16px]',
      onClick: () => navigate('/my/bookmark'),
    },
  ];

  // 3. 계정 설정 전용 비밀번호 메뉴 사양
  const passwordMenuIcon = (
    <img src={lockIcon} alt="비밀번호 변경" className="w-6 h-6" />
  );

  const renderMenuItem = (
    item: MenuItem,
    index: number,
    isLast: boolean,
    onClick?: () => void,
  ) => (
    <div
      key={index}
      onClick={onClick} // 💡 추가된 부분: 메뉴 클릭 시 실행
      className={`flex items-center justify-between py-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors ${
        isLast ? '' : 'border-b border-gray-100'
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className="p-2 rounded-full transition-colors duration-200 hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center overflow-visible min-w-[40px] min-h-[40px]">
          {item.icon}
        </div>
        <div>
          <h4
            className={`${item.fontSizeClass} font-medium text-black leading-[20px] tracking-[0.08px]`}
          >
            {item.title}
          </h4>
          {item.description && (
            <p className="text-[14px] font-light text-[#61646B] leading-[20px] tracking-[0.4px] mt-0.5">
              {item.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {item.badge === 'new' && (
          <span className="w-9 h-4 bg-brand-lightBlue rounded-[20px] text-white text-xs font-normal leading-5 tracking-wide flex items-center justify-center antialiased subpixel-antialiased">
            new
          </span>
        )}
        {typeof item.badge === 'number' && (
          <span className="size-5 bg-brand-lightBlue rounded-full text-white text-xs font-normal leading-5 tracking-wide flex items-center justify-center antialiased subpixel-antialiased">
            {item.badge}
          </span>
        )}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="text-gray-400"
        >
          <path
            d="M8.59063 18.1598L14.2506 12.4998L8.59063 6.83984L7.89062 7.54984L12.8406 12.4998L7.89062 17.4498L8.59063 18.1598Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );

  return (
    <div
      style={{
        fontFamily:
          "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif",
      }}
      className="w-full bg-[#FBFBFB] text-gray-800 flex flex-col antialiased min-h-full relative"
    >
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');
      `}</style>

      {/* 헤더 바 */}
      <div className="sticky top-0 z-40 bg-[#FBFBFB]">
        <Header
          leftNode={
            <IconButton icon={ICONS.BACK} onClick={() => navigate(-1)} />
          }
          title={
            <div className="text-left whitespace-nowrap transform -translate-x-20 text-black/70 text-xl font-semibold leading-5 tracking-wide">
              마이페이지
            </div>
          }
          rightNode={
            <IconButton
              icon={ICONS.BELL}
              onClick={() => navigate('/notifications')}
              className="text-brand-lightBlue"
            />
          }
        />
      </div>

      <div className="px-5 pb-12 flex flex-col flex-1">
        {/* 프로필 영역 */}
        <div className="py-6 flex items-center space-x-4 border-b border-gray-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 42 42"
            fill="none"
            style={{ width: '42px', height: '42px' }}
            className="flex-shrink-0"
          >
            <circle cx="20.916" cy="20.916" r="20.916" fill="#D9D9D9" />
            <path
              d="M20.9154 7.28809C22.6646 7.28809 24.3421 7.98295 25.579 9.21983C26.8159 10.4567 27.5107 12.1343 27.5107 13.8835C27.5107 15.6327 26.8159 17.3102 25.579 18.5471C24.3421 19.784 22.6646 20.4788 20.9154 20.4788C19.1662 20.4788 17.4886 19.784 16.2517 18.5471C15.0149 17.3102 14.32 15.6327 14.32 13.8835C14.32 12.1343 15.0149 10.4567 16.2517 9.21983C17.4886 7.98295 19.1662 7.28809 20.9154 7.28809ZM20.9154 23.7765C28.2033 23.7765 34.1061 26.728 34.1061 30.3719V33.6696H7.72461V30.3719C7.72461 26.728 13.6275 23.7765 20.9154 23.7765Z"
              fill="white"
            />
          </svg>
          <div>
            <h2 className="text-[16px] font-medium text-black leading-[20px] tracking-[0.4px]">
              {userEmail}
            </h2>
            <p className="text-[11px] font-normal text-black leading-[20px] tracking-[0.4px] flex items-center gap-1 mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 12 12"
                fill="none"
                style={{ width: '11.133px', height: '11.133px' }}
                className="flex-shrink-0"
              >
                <circle
                  cx="5.56641"
                  cy="5.56641"
                  r="5.31641"
                  fill="#D2EBFC"
                  stroke="#4C9DD1"
                  strokeWidth="0.5"
                />
                <path
                  d="M4.20115 7.21533L2.42656 5.44074L1.82227 6.04078L4.20115 8.41967L9.30789 3.31293L8.70785 2.71289L4.20115 7.21533Z"
                  fill="#4C9DD1"
                />
              </svg>
              숙명여자대학교 인증 계정
            </p>
          </div>
        </div>

        {/* 교환 활동 섹션 */}
        <div className="mt-6">
          <div className="h-5 flex items-center text-slate-500 text-base font-bold leading-5 tracking-wide mb-3">
            교환 활동
          </div>
          <div className="flex flex-col">
            {exchangeMenus.map((menu, idx) =>
              renderMenuItem(
                menu,
                idx,
                idx === exchangeMenus.length - 1,
                menu.onClick,
              ),
            )}
          </div>
        </div>
        <div className="w-full border-b border-gray-200 mt-2" />

        {/* 라운지 섹션 */}
        <div className="mt-6">
          <div className="h-5 flex items-center text-slate-500 text-base font-bold leading-5 tracking-wide mb-3">
            라운지
          </div>
          <div className="flex flex-col">
            {loungeMenus.map((menu, idx) =>
              renderMenuItem(
                menu,
                idx,
                idx === exchangeMenus.length - 1,
                menu.onClick,
              ),
            )}
          </div>
        </div>
        <div className="w-full border-b border-gray-200 mt-2" />

        {/* 계정 설정 섹션 */}
        <div className="mt-6">
          <div className="h-5 flex items-center text-slate-500 text-base font-bold leading-5 tracking-wide mb-3">
            계정
          </div>
          <div className="flex flex-col">
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full transition-colors duration-200 hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center text-brand-lightBlue overflow-visible min-w-[40px] min-h-[40px]">
                  <div className="size-6 relative overflow-visible flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="size-5.5 text-brand-lightBlue"
                    >
                      <path
                        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9zm-4.27 13a2 2 0 0 1-3.46 0"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="text-[16px] font-medium text-black leading-[20px] tracking-[0.08px]">
                    알림 받기
                  </h4>
                  <p className="text-[14px] font-light text-[#61646B] leading-[20px] tracking-[0.4px] mt-0.5">
                    교환 요청, 매칭 알림 관리
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAlertOn(!isAlertOn)}
                className={`w-[44px] h-[24px] flex items-center rounded-full p-0.5 transition-colors duration-300 ${isAlertOn ? 'bg-brand-lightBlue' : 'bg-gray-300'}`}
              >
                <div
                  className={`bg-white w-[20px] h-[20px] rounded-full shadow transform transition-transform duration-300 ${isAlertOn ? 'translate-x-[20px]' : 'translate-x-0'}`}
                />
              </button>
            </div>
            {renderMenuItem(
              {
                icon: passwordMenuIcon,
                title: '비밀번호 변경',
                description: '',
                fontSizeClass: 'text-[16px]',
              },
              0,
              true,
              () => navigate('/my/password-change'), // 👈 여기에 클릭 함수 전달
            )}
            <div className="w-full border-b border-[#E6E7EA] mt-2" />
          </div>
        </div>

        {/* 로그아웃 & 회원탈퇴 */}
        <div className="mt-auto pt-10 pb-4 flex flex-col gap-6">
          {/* 로그아웃하기 */}
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center space-x-4 text-left w-full"
          >
            <div className="min-w-[40px] min-h-[40px] flex items-center justify-center flex-shrink-0">
              <img src={logoutIcon} alt="로그아웃" className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="text-black text-base font-medium font-['Pretendard'] leading-5 tracking-tight">
                로그아웃하기
              </div>
              <div className="text-neutral-500 text-sm font-light font-['Work_Sans'] leading-5 tracking-tight">
                현재 계정에서 로그아웃합니다
              </div>
            </div>
          </button>

          {/* 회원탈퇴하기 */}
          <button
            onClick={() => {
              if (hasOngoingExchange) {
                setIsWithdrawBlockModalOpen(true);
              } else {
                setIsWithdrawConfirmModalOpen(true);
              }
            }}
            className="flex items-center space-x-4 text-left w-full"
          >
            <div className="min-w-[40px] min-h-[40px] flex items-center justify-center flex-shrink-0">
              <img src={deleteIcon} alt="회원 탈퇴" className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="text-black text-base font-medium font-['Pretendard'] leading-5 tracking-tight">
                회원 탈퇴하기
              </div>
              <div className="text-neutral-500 text-sm font-light font-['Work_Sans'] leading-5 tracking-tight">
                회원 탈퇴 후 계정이 삭제됩니다
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* --- 공통 모달 영역 --- */}

      {/* 1. 로그아웃 모달 */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        icon={
          <div className="size-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-2 mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </div>
        }
        title="로그아웃 하시겠습니까?"
        footer={
          <div className="flex w-full gap-3 mt-2">
            <button
              onClick={() => setIsLogoutModalOpen(false)}
              className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full font-medium transition-colors"
            >
              취소
            </button>
            <button
              onClick={() => {
                setIsLogoutModalOpen(false);
                navigate('/login');
              }}
              className="flex-1 py-3.5 bg-[#FF5A5F] hover:bg-red-500 text-white rounded-full font-medium transition-colors"
            >
              로그아웃
            </button>
          </div>
        }
      >
        {'계정에서 로그아웃하면\n알림을 받을 수 없습니다.'}
      </Modal>

      {/* 2. 교환 진행 중으로 인한 탈퇴 불가 알림 */}
      <Modal
        isOpen={isWithdrawBlockModalOpen}
        onClose={() => setIsWithdrawBlockModalOpen(false)}
        footer={
          <div className="flex flex-col w-full gap-[8.91px] mt-[21.64px]">
            {/* 교환 중 게시글 삭제하고 탈퇴하기 */}
            <button
              onClick={() => {
                setIsWithdrawBlockModalOpen(false);
                setIsWithdrawConfirmModalOpen(true);
              }}
              className="w-full py-3 px-5 bg-brand-lightBlue rounded-full flex justify-center items-center transition-colors"
            >
              {/* 💡 text-sm -> text-base 로 폰트 사이즈 키움! */}
              <span className="text-white text-base font-light font-['Pretendard'] leading-6 tracking-tight">
                교환 중 게시글 삭제하고 탈퇴하기
              </span>
            </button>

            {/* 취소 */}
            <button
              onClick={() => setIsWithdrawBlockModalOpen(false)}
              className="w-full py-3 px-5 rounded-3xl outline outline-[0.50px] outline-offset-[-0.50px] outline-gray-300 flex justify-center items-center transition-colors"
            >
              <span className="text-cyan-900 text-base font-medium font-['Pretendard'] leading-6 tracking-tight">
                취소
              </span>
            </button>
          </div>
        }
      >
        {/* 💡 text-[15px] -> text-[17px] 로 본문 크기 키우고 중앙 정렬 추가! */}
        <div
          className="w-72 mx-auto text-center 
        justify-center text-cyan-1000 text-base font-medium 
        font-['Pretendard'] leading-5 tracking-wide pt-4 pb-2 translate-y-5"
        >
          진행 중인 교환이 있습니다.
          <br />
          교환을 완료하거나 취소한 후<br />
          탈퇴할 수 있습니다.
        </div>
      </Modal>

      {/* 3. 최종 회원 탈퇴 확인 창 (오른쪽 시안) */}
      <Modal
        isOpen={isWithdrawConfirmModalOpen}
        onClose={() => setIsWithdrawConfirmModalOpen(false)}
        icon={
          <div className="flex items-center justify-center mb-1">
            <img src={finalAlertIcon} alt="" className="w-[34px] h-[34px]" />
          </div>
        }

        footer={
          <div className="flex w-full gap-3 mt-4">
            {/* 💡 취소 버튼 (전달해주신 폰트/아웃라인 속성 적용) */}
            <button
              onClick={() => setIsWithdrawConfirmModalOpen(false)}
              className="flex-1 h-11 flex justify-center items-center rounded-full outline outline-1 outline-offset-[-1px] outline-gray-300 bg-white transition-colors"
            >
              <span className="text-black text-sm font-medium font-['Pretendard'] leading-5 tracking-tight">
                취소
              </span>
            </button>

            {/* 💡 탈퇴 버튼 (전달해주신 bg-rose-500 색상 및 폰트 적용) */}
            <button
              onClick={() => {
                console.log('최종 탈퇴 처리 로직');
                setIsWithdrawConfirmModalOpen(false);
              }}
              className="flex-1 h-11 flex justify-center items-center bg-rose-500 rounded-full transition-colors"
            >
              <span className="text-white text-sm font-light font-['Pretendard'] leading-5 tracking-tight">
                탈퇴
              </span>
            </button>
          </div>
        }
      >
        <div className="flex flex-col items-center gap-2 mt-1">
          <div className="text-center justify-center text-black text-lg font-semibold font-['Pretendard'] leading-5 tracking-wide">
            정말 탈퇴하시겠어요?
          </div>
          <div className="w-full max-w-[24rem] text-center justify-center text-black text-sm font-light font-['Pretendard'] leading-5 tracking-wide">
            탈퇴 시 계정은 삭제되며 복구되지 않습니다.
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyPage;

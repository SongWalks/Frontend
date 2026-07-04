import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  // 💡 메뉴 데이터 배열 (주소와 아이콘 매핑)
  // 아이콘은 시안과 가장 유사한 ph(Phosphor) 및 mdi 계열로 임시 세팅했습니다.
  const navItems = [
    { id: 'home', label: '홈', path: '/', icon: 'ph:house-fill' },
    {
      id: 'board',
      label: '게시판',
      path: '/board',
      icon: 'mdi:text-box-outline',
    },
    {
      id: 'chat',
      label: '교환채팅방',
      path: '/chat',
      icon: 'ph:chat-circle-dots-fill',
    },
    { id: 'lounge', label: '라운지', path: '/lounge', icon: 'mdi:snowflake' },
    { id: 'my', label: '마이페이지', path: '/my', icon: 'ph:user' },
  ];

  return (
    <nav className="w-full h-[84px] bg-white border-t border-gray-200 flex justify-around items-center px-2">
      {navItems.map((item) => {
        // 현재 주소와 메뉴의 path가 일치하는지 확인 (활성화 여부)
        // (단, '/' 홈 경로는 정확히 일치할 때만 활성화하고, 나머지는 포함되면 활성화)
        const isActive =
          item.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.path);

        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center justify-center gap-1 w-16"
          >
            {/* 아이콘 영역 (활성화 시 파란색 동그라미 배경 + 흰색 아이콘) */}
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 ${
                isActive
                  ? 'bg-brand-lightBlue text-white' // 활성화: 파란 원 배경, 흰색 아이콘 (아까 쓰신 색상 변수명)
                  : 'bg-transparent text-gray-400' // 비활성화: 투명 배경, 회색 아이콘
              }`}
            >
              <Icon icon={item.icon} className="text-[24px]" />
            </div>

            {/* 텍스트 영역 (활성화 시 파란색 글씨) */}
            <span
              className={`text-[10px] font-medium ${
                isActive
                  ? 'text-brand-lightBlue font-semibold'
                  : 'text-gray-400'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

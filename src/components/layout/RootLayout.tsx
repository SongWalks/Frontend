// src/components/layout/RootLayout.tsx
import { Outlet } from 'react-router-dom';

export default function RootLayout() {
  // 1. PC/태블릿 접속 시 남는 배경 (어두운 회색)
  return (
    <div className="min-h-screen bg-gray-200 flex justify-center font-sans text-gray-900">
      {/* 2. 모바일 앱 규격(375px) 컨테이너 */}
      <div className="w-full max-w-[402px] min-h-screen bg-gray-50 shadow-xl relative flex flex-col overflow-hidden">
        {/* 자식 라우트(DefaultLayout 또는 FullScreenLayout)가 렌더링될 자리 */}
        <Outlet />
      </div>
    </div>
  );
}

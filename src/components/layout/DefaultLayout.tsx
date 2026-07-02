// DefaultLayout.tsx 예시
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function DefaultLayout() {
  return (
    <div className="flex flex-col h-screen">
      {/* 화면 내용이 들어갈 자리 (스크롤 영역) */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* 항상 고정된 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
}

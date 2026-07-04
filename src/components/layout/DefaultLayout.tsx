import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav'; // 💡 방금 만든 컴포넌트 불러오기

export default function DefaultLayout() {
  return (
    // 전체 컨테이너는 화면 꽉 차게 (h-screen)
    <div className="flex flex-col h-screen w-full relative">
      {/* 위쪽 메인 내용 영역 (flex-1로 남는 공간 다 차지하고 스크롤 생김) */}
      <main className="flex-1 overflow-y-auto w-full">
        <Outlet />
      </main>

      <div className="w-full shrink-0">
        <BottomNav />
      </div>
    </div>
  );
}

import { Outlet } from 'react-router-dom';

export default function FullScreenLayout() {
  return (
    <div className="flex flex-col h-screen w-full relative">
      <main className="flex-1 overflow-y-auto w-full">
        <Outlet />
      </main>

      {/* 하단 네비게이션 대신 페이지 내부에서 입력창을 렌더링하도록 비워둠 */}
    </div>
  );
}

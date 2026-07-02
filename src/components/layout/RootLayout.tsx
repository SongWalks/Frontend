// 모바일 화면 비율(가운데 정렬, 최대 너비)을 잡아주는 가장 바깥 틀
import { Outlet } from 'react-router-dom';

function RootLayout() {
  return (
    <div className="max-w-md mx-auto">
      <Outlet />
    </div>
  );
}

export default RootLayout;

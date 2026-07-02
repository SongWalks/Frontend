import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes/router';

export default function App() {
  return (
    <>
      {/* 추후 전역 UI(Toast 알림, 모달 등)나 
        React Query 같은 Provider가 추가된다면 이곳에 감싸게 됩니다. 
      */}
      <RouterProvider router={router} />
    </>
  );
}

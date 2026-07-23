import { createBrowserRouter } from 'react-router-dom';

// --- 1. 레이아웃 불러오기 ---
import RootLayout from '@/components/layout/RootLayout';
import DefaultLayout from '@/components/layout/DefaultLayout';
import FullScreenLayout from '@/components/layout/FullScreenLayout';

// --- 2. 페이지 불러오기  ---
import HomePage from '@/pages/home/HomePage';
import ReportPage from '@/pages/report/ReportPage';
import ReportSuccessPage from '@/pages/report/ReportSuccessPage';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        // ==========================================
        // 💡 1번 그룹: 하단 네비게이션(BottomNav)이 있는 화면들
        // ==========================================
        element: <DefaultLayout />,
        children: [{ path: '/', element: <HomePage /> }],
      },
      {
        // ==========================================
        // 💡 2번 그룹: 하단 바 없이 전체 화면을 쓰는 화면들
        // ==========================================
        element: <FullScreenLayout />,
        children: [
          { path: '/report', element: <ReportPage /> },
          { path: '/report/success', element: <ReportSuccessPage /> }, // 신고 완료 페이지 (임시)
        ],
      },
    ],
  },
]);

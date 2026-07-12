import { createBrowserRouter } from 'react-router-dom';

// --- 1. 레이아웃 불러오기 ---
import RootLayout from '@/components/layout/RootLayout';
import DefaultLayout from '@/components/layout/DefaultLayout';
import FullScreenLayout from '@/components/layout/FullScreenLayout';

// --- 2. 페이지 불러오기 ---
import { TestButton } from '../pages/TestButton';
import { TestHeader } from '../pages/TestHeader';
import { TestInput } from '../pages/TestInput';
import { TestModal } from '../pages/TestModal';
import { TestTabs } from '../pages/TestTabs';
import { TestCard } from '../pages/TestCard';
import { TestExtra } from '../pages/TestExtra';
import { TestAvatar } from '../pages/TestAvatar';
import { TestLoading } from '../pages/TestLoading';

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
        path: '/',
        element: <DefaultLayout />,
        children: [
          // 예시: { path: 'board', element: <BoardPage /> },    // /board (교환게시판)
          { path: '/test-input', element: <TestInput /> },
          { path: '/test-modal', element: <TestModal /> },
          { path: '/test-button', element: <TestButton /> },
          { path: '/test-header', element: <TestHeader /> },
          { path: '/test-tabs', element: <TestTabs /> },
          { path: '/test-card', element: <TestCard /> },
          { path: '/test-extra', element: <TestExtra /> },
          { path: '/test-avatar', element: <TestAvatar /> },
          { path: '/test-loading', element: <TestLoading /> },

          { path: '/', element: <HomePage /> },
        ],
      },
      {
        // ==========================================
        // 💡 2번 그룹: 하단 바 없이 전체 화면을 쓰는 화면들
        // ==========================================
        path: '/',
        element: <FullScreenLayout />,
        children: [
          { path: '/report', element: <ReportPage /> },
          { path: '/report/success', element: <ReportSuccessPage /> }, // 신고 완료 페이지 (임시)
        ],
      },
    ],
  },
]);

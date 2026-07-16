import { createBrowserRouter } from 'react-router-dom';

// --- 1. 레이아웃 불러오기 ---
import RootLayout from '@/components/layout/RootLayout';
import DefaultLayout from '@/components/layout/DefaultLayout';
import FullScreenLayout from '@/components/layout/FullScreenLayout';

// --- 2. 페이지 불러오기 ---
// 💡 마이페이지 컴포넌트를 정상적으로 임포트해 줍니다! (폴더 경로명이 소문자/대문자일 수 있으니 확인해 주세요)
import Mypage from '../pages/Mypage/Mypage';
import PasswordChangepage from '../pages/Mypage/PasswordChangepage';
import MyPostpage from '../pages/Mypage/MyPostpage';
import LikeListPage from '@/pages/Mypage/LikeListPage';
import GraduationPage from '@/pages/Mypage/GraduationPage';
import MyLoungePostsPage from '@/pages/Mypage/MyLoungePostsPage';
import MyBookmarkPage from '@/pages/Mypage/MyBookmarkPage';

import { TestButton } from '../pages/TestButton';
import { TestHeader } from '../pages/TestHeader';
import { TestInput } from '../pages/TestInput';
import { TestModal } from '../pages/TestModal';
import { TestTabs } from '../pages/TestTabs';
import { TestCard } from '../pages/TestCard';
import { TestExtra } from '../pages/TestExtra';
import { TestAvatar } from '../pages/TestAvatar';
import { TestLoading } from '../pages/TestLoading';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        // ==========================================
        // 💡 1번 그룹: 하단 네비게이션(BottomNav)이 있는 화면들
        // ==========================================
        element: <DefaultLayout />,
        children: [
          {
            path: 'my',
            children: [
              { index: true, element: <Mypage /> },
              { path: 'password-change', element: <PasswordChangepage /> },
              { path: 'posts', element: <MyPostpage /> },
              { path: 'likes', element: <LikeListPage /> },
              { path: 'lounge', element: <MyLoungePostsPage /> },
              { path: 'bookmarks', element: <MyBookmarkPage /> }, // 추가된 경로
            ],
          },
          { path: '/test-input', element: <TestInput /> },
          { path: '/test-modal', element: <TestModal /> },
          { path: '/test-button', element: <TestButton /> },
          { path: '/test-header', element: <TestHeader /> },
          { path: '/test-tabs', element: <TestTabs /> },
          { path: '/test-card', element: <TestCard /> },
          { path: '/test-extra', element: <TestExtra /> },
          { path: '/test-avatar', element: <TestAvatar /> },
          { path: '/test-loading', element: <TestLoading /> },
        ],
      },
      {
        // ==========================================
        // 💡 2번 그룹: 하단 바 없이 전체 화면을 쓰는 화면들
        // ==========================================
        element: <FullScreenLayout />,
        children: [
          { path: '/my/graduation', element: <GraduationPage /> },
          // 상세페이지 등은 여기에 등록됩니다.
        ],
      },
    ],
  },
]);

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Tabs } from '../components/common/Tabs';

export const TestTabs = () => {
  // 1번 라인 탭 상태 관리
  const [activeRequestTab, setActiveRequestTab] = useState('received');

  // 2번 알약 탭 상태 관리
  const [activeFilterTab, setActiveFilterTab] = useState('all');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 gap-10">
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold text-gray-900">
          Tabs UI 테스트 도화지 🗂️
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          상단 메뉴용 라인 타입과 필터용 알약 타입 검증
        </p>
      </div>

      {/* 모바일 화면(402px) 규격 컨테이너 */}
      <div className="flex flex-col w-full max-w-[402px] bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden min-h-[400px]">
        {/* =========================================
            💡 케이스 1: 교환 요청함 (Line 타입)
        ========================================= */}
        <div className="flex flex-col bg-white pb-4 mb-6">
          <p className="text-xs font-semibold text-gray-400 p-4 pb-2">
            1. 라인(Line) 타입 - 상단 메뉴용
          </p>

          <Tabs
            variant="line"
            activeTabId={activeRequestTab}
            onTabChange={setActiveRequestTab}
            tabs={[
              { id: 'received', label: '받은 요청' },
              { id: 'sent', label: '보낸 요청' },
            ]}
          />

          {/* 탭 내용이 바뀌는 영역 임시 구현 */}
          <div className="p-10 flex justify-center items-center text-gray-400 text-sm">
            {activeRequestTab === 'received'
              ? '📥 받은 요청 내역이 없습니다.'
              : '📤 보낸 요청 내역이 없습니다.'}
          </div>
        </div>

        <div className="w-full h-px bg-gray-100"></div>

        {/* =========================================
            💡 케이스 2: 교환준비방 필터 (Pill 타입)
        ========================================= */}
        <div className="flex flex-col bg-white p-4 pb-10">
          <p className="text-xs font-semibold text-gray-400 pb-4">
            2. 알약(Pill) 타입 - 필터/토글용
          </p>

          <div className="flex items-center gap-2">
            {/* 좌측 필터 아이콘 (시안 참고) */}
            <button className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 text-gray-500">
              <Icon icon="ph:faders" className="text-lg" />
            </button>

            <Tabs
              variant="pill"
              activeTabId={activeFilterTab}
              onTabChange={setActiveFilterTab}
              tabs={[
                { id: 'all', label: '전체' },
                { id: 'unread', label: '안읽음' },
              ]}
            />
          </div>

          <div className="pt-10 flex justify-center items-center text-gray-400 text-sm">
            {activeFilterTab === 'all'
              ? '👀 모든 채팅방을 보여줍니다.'
              : '🔴 안 읽은 메세지만 보여줍니다.'}
          </div>
        </div>
      </div>
    </div>
  );
};

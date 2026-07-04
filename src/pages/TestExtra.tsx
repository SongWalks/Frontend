import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Dropdown } from '../components/common/Dropdown';
import { EmptyState } from '../components/common/EmptyState';
import { FAB } from '../components/common/FAB';
import { Toast } from '../components/common/Toast';
import Button from '../components/common/Button';
import Header from '../components/layout/Header';
import { ICONS } from '../constants/icons';
import { IconButton } from '../components/common/IconButton';

export const TestExtra = () => {
  // 1. 드롭다운 상태 관리
  const [filterValue, setFilterValue] = useState('all');

  // 2. 토스트 상태 관리
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastIcon, setToastIcon] = useState('ph:check-bold');

  // 토스트 띄우기 도우미 함수
  const showToast = (message: string, icon: string = 'ph:check-bold') => {
    setToastMessage(message);
    setToastIcon(icon);
    setIsToastVisible(false); // 연타 시 타이머 초기화를 위해 한번 껐다가 켭니다
    setTimeout(() => setIsToastVisible(true), 10);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 gap-8 pb-20">
      <div className="text-center mt-6">
        <h1 className="text-2xl font-bold text-gray-900">
          기타 컴포넌트 테스트 🧩
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          드롭다운, 빈 화면, 토스트, 그리고 플로팅 버튼
        </p>
      </div>

      {/* 💡 모바일 화면 규격 (스크롤 테스트를 위해 높이와 overflow 속성 추가) */}
      <div className="relative w-full max-w-[402px] h-[650px] bg-gray-50 shadow-xl rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
        {/* =========================================
            💡 공통 Header 컴포넌트 적용 완료
        ========================================= */}
        <Header
          leftNode={<IconButton icon={ICONS.BACK} />}
          title="컴포넌트 테스트"
          rightNode={<IconButton icon={ICONS.BELL} />}
        />

        {/* 스크롤 가능한 메인 영역 */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-10 pb-32">
          {/* =========================================
              💡 1. Dropdown (드롭다운 필터) 테스트
          ========================================= */}
          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-gray-500">
              1. 드롭다운 필터 (z-index 테스트)
            </h3>
            <div className="flex justify-end">
              <Dropdown
                className="w-32" // 너비를 좁게 설정
                value={filterValue}
                onChange={setFilterValue}
                options={[
                  { value: 'all', label: '전체' },
                  { value: 'offline', label: '대면' },
                  { value: 'online', label: '비대면' },
                ]}
              />
            </div>
            <p className="text-xs text-right text-gray-400 mt-1">
              현재 선택된 값:{' '}
              <strong className="text-brand-blue">{filterValue}</strong>
            </p>
          </section>

          <div className="w-full h-px bg-gray-200"></div>

          {/* =========================================
              💡 2. EmptyState (빈 화면) 테스트
          ========================================= */}
          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-gray-500">
              2. 텅 빈 화면 안내
            </h3>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <EmptyState
                icon={<Icon icon="ph:warning" className="text-[#8FB6D9]" />} // 시안의 연파란색 느낌
                title="아직 등록한 교환 게시글이 없어요."
                description="교환하려는 과목을 등록하고 원하는 과목을 찾아보세요!"
                action={
                  <button className="text-[#3DA5F5] underline text-sm mt-2 font-medium">
                    교환 매칭 추천함가기 &gt;
                  </button>
                }
              />
            </div>
          </section>

          <div className="w-full h-px bg-gray-200"></div>

          {/* =========================================
              💡 3. Toast (토스트 알림) 테스트
          ========================================= */}
          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-gray-500">
              3. 토스트 알림 띄우기
            </h3>
            <div className="flex flex-col gap-2">
              <Button
                variant="primary"
                onClick={() => showToast('교환 요청이 완료되었습니다.')}
              >
                성공 메시지 띄우기
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  showToast(
                    '비밀번호가 일치하지 않습니다.',
                    'ph:warning-circle',
                  )
                }
              >
                경고 메시지 띄우기
              </Button>
            </div>
          </section>

          {/* 스크롤 길이를 늘리기 위한 가짜 여백 */}
          <div className="h-40 flex items-center justify-center text-gray-300 text-sm">
            (스크롤 영역)
          </div>
        </div>

        {/* =========================================
            💡 4. FAB (플로팅 버튼) 테스트
        ========================================= */}
        {/* 기본 동그라미 FAB (+ 아이콘) : 겹치지 않게 위치 조정 */}
        <FAB
          onClick={() => alert('+ 아이콘 클릭!')}
          className="bottom-28" // 원래 위치
        />

        {/* 알약 모양 FAB (+ 글쓰기) : 겹치지 않게 위치 조정 */}
        <FAB
          onClick={() => alert('글쓰기 클릭!')}
          text="글쓰기"
          className="bottom-8" // 아래로 조금 내림
        />

        {/* =========================================
            💡 5. 실제 렌더링되는 Toast 컴포넌트
        ========================================= */}
        <Toast
          isVisible={isToastVisible}
          message={toastMessage}
          onClose={() => setIsToastVisible(false)}
          icon={toastIcon}
        />
      </div>
    </div>
  );
};

import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { IconButton } from '@/components/common/IconButton';
import { Toast } from '@/components/common/Toast';
import { ICONS } from '@/constants/icons';

// 💡 알림 타입별 아이콘 - src/assets/icons 안의 실제 파일명으로 교체하세요.
import matchIcon from '@/assets/icons/matchoffer.svg';
import likeIcon from '@/assets/icons/dibs.svg';
import checkIcon from '@/assets/icons/matched.svg';
import clockIcon from '@/assets/icons/hands.svg';
import cancelIcon from '@/assets/icons/matched.svg';
import systemIcon from '@/assets/icons/dibs.svg';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';
const API = {
  UNREAD_COUNT: `${API_BASE}/api/notifications/unread-count`,
  LIST: `${API_BASE}/api/notifications`,
  READ_ONE: (id) => `${API_BASE}/api/notifications/${id}/read`,
  READ_ALL: `${API_BASE}/api/notifications/read-all`,
};

const PAGE_SIZE = 20;

const USE_MOCK = true;

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'MATCH_PROPOSAL',
    title: '마케팅과 소비자이슈 1순위 매칭 제안',
    body: '마케팅과소비자이슈의 1순위 과목을 찾았습니다!\n교환을 제안해보세요!',
    deepLink: null,
    isRead: false,
    createdAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    type: 'MATCH_PROPOSAL',
    title: '마케팅과 소비자이슈 2순위 매칭 제안',
    body: '마케팅과소비자이슈의 2순위 과목을 찾았습니다!\n교환을 제안해보세요!',
    deepLink: null,
    isRead: false,
    createdAt: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    type: 'LIKE',
    title: '찜 알림',
    body: '누군가 회원님의 [데이터베이스] 과목을 찜했습니다!\n상대방이 버리는 과목을 확인해 볼까요?',
    deepLink: null,
    isRead: true,
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    type: 'MATCH_ACCEPTED',
    title: '매칭완료',
    body: '매칭이 성사되었습니다!\n교환 채팅방으로 이동하여 시간을 조율해 주세요',
    deepLink: null,
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    type: 'EXCHANGE_SCHEDULED',
    title: '매칭 시간 확정',
    body: '오후 2시 15분으로 교환 시간이 확정되었습니다.\n교환 5분 전 과목 보유 인증이 진행됩니다. 약속 시간을 꼭 지켜주세요.',
    deepLink: null,
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

const TYPE_ICON_MAP = {
  MATCH_PROPOSAL: { icon: matchIcon, bg: 'bg-blue-100' },
  MATCH_REQUESTED: { icon: matchIcon, bg: 'bg-blue-100' },
  MATCH_ACCEPTED: { icon: checkIcon, bg: 'bg-blue-100' },
  MATCH_REJECTED: { icon: cancelIcon, bg: 'bg-gray-100' },
  MATCH_TIMEOUT: { icon: cancelIcon, bg: 'bg-gray-100' },
  EXCHANGE_SCHEDULED: { icon: clockIcon, bg: 'bg-blue-100' },
  VERIFY_30MIN: { icon: clockIcon, bg: 'bg-blue-100' },
  VERIFY_10MIN: { icon: clockIcon, bg: 'bg-blue-100' },
  VERIFY_5MIN: { icon: clockIcon, bg: 'bg-blue-100' },
  SWAP_RESULT: { icon: checkIcon, bg: 'bg-blue-100' },
  CANCEL: { icon: cancelIcon, bg: 'bg-gray-100' },
  LIKE: { icon: likeIcon, bg: 'bg-pink-50' },
  PENALTY: { icon: systemIcon, bg: 'bg-gray-100' },
  SYSTEM: { icon: systemIcon, bg: 'bg-gray-100' },
};

const TOAST_BY_TYPE = {
  EXPIRED_POST: '존재하지 않거나 삭제된 게시글입니다.',
  EXPIRED_MATCH: '만료된 매칭 제안입니다.',
  LOAD_FAILED: '알림을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
};

const formatRelativeTime = (iso) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  return `${Math.floor(diffHour / 24)}일 전`;
};

const getJson = async (url) => {
  const res = await fetch(url, { credentials: 'include' });
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
};

const patchJson = async (url) => {
  const res = await fetch(url, { method: 'PATCH', credentials: 'include' });
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
};

export default function AlertPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const pageRef = useRef(0);
  const listRef = useRef(null);

  useEffect(() => {
    fetchNotifications({ reset: true });
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setIsToastVisible(true);
  };

  // page: 알림 목록 조회 (page/size 파라미터로 페이지네이션)
  const fetchNotifications = async ({ reset = false } = {}) => {
    const page = reset ? 0 : pageRef.current;

    if (reset) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 300));
        setNotifications(MOCK_NOTIFICATIONS);
        setHasMore(false);
        return;
      }

      const { status, data } = await getJson(
        `${API.LIST}?page=${page}&size=${PAGE_SIZE}`,
      );

      if (status === 200 && data?.success) {
        const fetched = data.data.notifications ?? [];
        setNotifications((prev) => (reset ? fetched : [...prev, ...fetched]));
        setHasMore(fetched.length === PAGE_SIZE);
        pageRef.current = page + 1;
      } else {
        showToast(TOAST_BY_TYPE.LOAD_FAILED);
      }
    } catch {
      showToast(TOAST_BY_TYPE.LOAD_FAILED);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // 리스트를 끝까지 스크롤하면 다음 페이지 로드 (기존 "불러오는 중..." 표시를 그대로 재사용)
  const handleScroll = () => {
    if (USE_MOCK || isLoading || isLoadingMore || !hasMore) return;
    const el = listRef.current;
    if (!el) return;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 80;
    if (nearBottom) {
      fetchNotifications({ reset: false });
    }
  };

  const handleBack = () => navigate(-1);

  const handleNotificationClick = async (item) => {
    if (!item.isRead) {
      if (USE_MOCK) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)),
        );
      } else {
        try {
          const { status } = await patchJson(API.READ_ONE(item.id));
          if (status === 200) {
            setNotifications((prev) =>
              prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)),
            );
          }
        } catch {
          // 읽음 처리 실패는 조용히 무시 (다음 진입 시 재시도됨)
        }
      }
    }

    if (!item.deepLink) return;

    // 3번 API(알림 목록 조회) 명세에 정의된 두 케이스만 만료/삭제로 취급한다.
    // 그 외 네트워크 오류 등은 "삭제됨"으로 단정할 근거가 없으므로 일단 이동시킨다.
    try {
      const res = await fetch(item.deepLink, { credentials: 'include' });
      if (res.status === 404) {
        showToast(TOAST_BY_TYPE.EXPIRED_POST);
        return;
      }
      if (res.status === 410) {
        showToast(TOAST_BY_TYPE.EXPIRED_MATCH);
        return;
      }
      navigate(item.deepLink);
    } catch {
      navigate(item.deepLink);
    }
  };

  // 👇 실제 푸시 서버 없이도 "알림 오는 거" 눈으로 확인하기 위한 mock 발송 버튼
  // 브라우저 알림 권한만 허용돼 있으면, 서버 없이 Service Worker의 showNotification을
  // 직접 호출해서 진짜 OS 알림창을 띄울 수 있습니다.
  const handleSendMockPush = async () => {
    const registration = await navigator.serviceWorker.ready;
    registration.showNotification('✨ 새로운 매칭 제안', {
      body: '데이터베이스 의 1순위 과목을 찾았습니다!\n교환을 제안해보세요!',
      icon: '/icons/icon-192.png',
      badge: '/icons/badge-72.png',
      data: { url: '/alert' },
    });
  };

  return (
    <div className="relative bg-[#fbfbfb] mx-auto overflow-hidden font-['Pretendard'] h-full flex flex-col">
      <div className="sticky top-0 z-20 bg-[#fbfbfb]">
        <Header
          leftNode={
            <div
              style={{
                position: 'absolute',
                top: 19,
                left: 12,
                opacity: 0.6,
                transform: 'scale(1.1)',
                transformOrigin: 'top left',
              }}
              className="z-10"
            >
              <IconButton icon={ICONS.BACK} onClick={handleBack} />
            </div>
          }
          title={<span style={{ color: '#000000B2' }}>알림</span>}
        />
      </div>

      {/* 개발 확인용 mock 발송 버튼 - 실제 배포 전엔 삭제하거나 조건부로 숨기세요 */}
      {/* 우측 하단 테스트용 버튼 */}
      <button
        type="button"
        onClick={handleSendMockPush}
        className="
          fixed
          bottom-20
          right-6
          w-14
          h-14
          rounded-full
          bg-blue-500
          items-center
          justify-center
        "
        aria-label="테스트 알림 보내기"
      >
        🔔
      </button>

      <div
        ref={listRef}
        onScroll={handleScroll}
        className="flex flex-col overflow-y-auto flex-1 min-h-0 bg-[#fbfbfb]"
      >
        {isLoading && (
          <div className="flex justify-center items-center py-10 text-gray-400 text-sm">
            불러오는 중...
          </div>
        )}
        {!isLoading && notifications.length === 0 && (
          <div className="flex justify-center items-center py-20 text-gray-400 text-sm">
            새로운 알림이 없습니다.
          </div>
        )}

        {notifications.map((item) => {
          const { icon, bg } = TYPE_ICON_MAP[item.type] ?? TYPE_ICON_MAP.SYSTEM;
          const [mainLine, subLine] = item.body.split('\n');

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNotificationClick(item)}
              className={`flex items-start gap-3 px-5 py-4 text-left border-b border-gray-100 transition-colors ${
                item.isRead ? 'bg-[#fbfbfb]' : 'bg-[#F1F7FB]'
              }`}
            >
              <span
                className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${bg}`}
              >
                <img src={icon} alt="" className="w-5 h-5" />
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-base font-bold text-brand-navy truncate">
                    {item.title}
                  </span>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {formatRelativeTime(item.createdAt)}
                  </span>
                </div>
                <p className="text-sm mt-1" style={{ color: '#19191B' }}>
                  {mainLine}
                </p>
                {subLine && (
                  <p className="text-xs mt-0.5" style={{ color: '#61646B' }}>
                    {subLine}
                  </p>
                )}
              </div>
            </button>
          );
        })}

        {!isLoading && isLoadingMore && (
          <div className="flex justify-center items-center py-10 text-gray-400 text-sm">
            불러오는 중...
          </div>
        )}
      </div>

      <Toast
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
        icon={ICONS.CLOSE}
      />
    </div>
  );
}

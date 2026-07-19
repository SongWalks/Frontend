// pages/chat/ChatRoomPage.tsx (crp.tsx)
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Header from '@/components/layout/Header';
import { IconButton } from '@/components/common/IconButton';
import { Input } from '@/components/common/Input';
import Button from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { ICONS } from '@/constants/icons';
import { useScheduledAt } from '../mockChat';
import { mockExchangeStore, useExchangeState } from '../mockExcn';
import sendIcon from '@/assets/icons/send.svg';
import disputeIcon from '@/assets/icons/dispute.svg';

const HEADER_H = 80;
const CURRENT_USER_ID = 1; // TODO: 실제 로그인 유저 id로 교체
const COUNTERPART_ID = 2;

const VERIFY_WINDOW_SECONDS = 5 * 60;
const COUNTDOWN_START = 10;
const COUNTDOWN_RED_THRESHOLD = 3;

interface ChatMessage {
  id: number;
  senderId: number;
  content: string;
  createdAt: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    senderId: CURRENT_USER_ID,
    content: '내일 오전 4시에 교환해요',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    senderId: COUNTERPART_ID,
    content: '좋아요',
    createdAt: new Date().toISOString(),
  },
];

// TODO: 실제 room 상세 API로 대체 (내 과목명 / 상대 과목명)
const MOCK_ROOM_COURSES: Record<string, { my: string; counterpart: string }> = {
  '1': { my: '마케팅과 소비자 이슈', counterpart: '프로그래밍언어론' },
  '2': { my: '자바프로그래밍', counterpart: '소비자 경제' },
};

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

const formatScheduledDate = (iso: string) => {
  const d = new Date(iso);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
};

// 채팅방 내부에서 전환되는 화면 단계
// CHAT: 평소 채팅 화면
// GUIDE: 캡쳐 인증 방법 안내 화면
// VERIFY: 5분 전 강의 보유 인증 (이미지1)
// COUNTDOWN: 카운트다운 + 성공/실패 선택 (이미지2, 전체 오버레이)
// DISPUTE: 분쟁 조정(사후 인증) (이미지3)
//
// ⚠️ 위 단계들은 "페이지 전환"이 아니라 채팅방이라는 하나의 화면 위에
// 카드 형태로 얹히는 콘텐츠일 뿐이다. 따라서 헤더/푸터는 flowStep과
// 무관하게 항상 기본으로 노출되어야 한다. (COUNTDOWN도 예외 아님 -
// 다만 카운트다운 중에는 Modal 오버레이가 위에 뜨면서 헤더/푸터는
// "보이기만" 하고 기능은 동작하지 않아도 된다.)
type FlowStep = 'CHAT' | 'GUIDE' | 'VERIFY' | 'COUNTDOWN' | 'DISPUTE';
type VerifySubStep =
  | 'INTRO'
  | 'CAPTURING'
  | 'WAITING_COUNTERPART'
  | 'CONFIRM_COUNTERPART'
  | 'READY';
type CountdownPhase = 'COUNTING' | 'RESULT_SELECT';
// DISPUTE 화면 내부 단계 - CAPTURE: 인증 시작 카드, SUBMITTED: 인증 제출 완료 카드
type DisputeSubStep = 'CAPTURE' | 'SUBMITTED';

const GUIDE_STEPS = [
  {
    title: '1. 수강신청 내역 페이지를 열어주세요.',
    desc: '학교 수강신청 시스템에서 현재 신청한 강의 목록이 보이는 화면을 준비해주세요.',
    caption: '실제 수강신청 페이지 예시 · 강의 목록이 표시된 상태',
  },
  {
    title: '2. 인증 QR 코드가 보이도록 화면을 배치해주세요.',
    desc: '수강신청 내역과 인증 QR 코드가 한 화면에 함께 보이도록 창 크기를 조정해주세요.',
    caption: '왼쪽: 학교 수강신청 페이지 · 오른쪽: 서비스의 인증 QR 코드',
  },
  {
    title: '3. [인증 시작] 버튼을 눌러주세요.',
    desc: '버튼을 누르면 화면 공유 창이 나타납니다.',
    caption: '"인증 시작" 버튼이 강조된 화면',
  },
  {
    title: '4. 전체 화면을 선택해주세요.',
    desc: '화면 공유 창에서 "전체 화면"을 선택한 후 [공유] 버튼을 눌러주세요.',
    caption: '브라우저의 화면 공유 선택 창 · "전체 화면" 선택 부분 강조 표시',
  },
  {
    title: '5. 자동 인증이 진행됩니다.',
    desc: '공유가 시작되면 시스템이 현재 화면을 자동으로 촬영하여 인증을 진행합니다.\n※ 촬영 후 화면 공유는 자동으로 종료됩니다.',
    caption: '"인증 진행 중..." 로딩 화면',
  },
  {
    title: '6. 촬영된 이미지를 확인해주세요.',
    desc: '촬영된 이미지에서 교환하려는 강의가 정상적으로 보이는지 확인해주세요.',
    caption: '실제 촬영된 결과 예시 · 강의 목록과 QR 코드가 함께 보이는 화면',
  },
  {
    title: '7. 인증 완료',
    desc: '인증이 완료되면 다음 단계로 이동할 수 있습니다.',
    caption: '"인증이 완료되었습니다" 완료 화면 · "카운트다운 시작" 버튼',
  },
];

export default function ChatRoomPage() {
  const navigate = useNavigate();
  const { roomId = '' } = useParams();
  const scheduledAt = useScheduledAt(roomId);
  const exchange = useExchangeState(roomId);

  const myCourseName = MOCK_ROOM_COURSES[roomId]?.my ?? '알 수 없음';
  const counterpartCourseName =
    MOCK_ROOM_COURSES[roomId]?.counterpart ?? '알 수 없음';

  const [messages, setMessages] = useState<ChatMessage[]>(
    scheduledAt ? INITIAL_MESSAGES : [],
  );
  const [inputValue, setInputValue] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isComposingRef = useRef(false);

  // 💡 왼쪽(상대)/오른쪽(나) 채팅을 둘 다 테스트할 수 있도록 하는 개발용 토글
  const [senderRole, setSenderRole] = useState<'ME' | 'OTHER'>('ME');

  // ===== 화면 전환 state =====
  const [flowStep, setFlowStep] = useState<FlowStep>('CHAT');

  // 카드(GUIDE/VERIFY/DISPUTE)가 대화 타임라인의 어느 시점에 끼어들었는지 기록.
  // 이 인덱스 "이전" 메시지들만 접혀서 "이전 채팅 보기" 안에 들어가고,
  // 이 인덱스 "이후"에 보낸 새 메시지는 카드 아래에 항상 펼쳐진 채로 보인다.
  const [cardInsertIndex, setCardInsertIndex] = useState(0);

  // "교환 시간 확정" 카드가 대화 타임라인의 어느 시점에 끼어들었는지 기록.
  // 이 인덱스 이전 메시지 -> 확정 카드 -> 이후에 보낸 새 메시지 순으로 CHAT 화면에 렌더링한다.
  const [scheduleInsertIndex, setScheduleInsertIndex] = useState(() =>
    scheduledAt ? INITIAL_MESSAGES.length : 0,
  );
  const prevScheduledAtRef = useRef(scheduledAt);

  // ----- 이전 채팅 보기 토글 (GUIDE / VERIFY / DISPUTE 화면 공통) -----
  const [showPreviousChat, setShowPreviousChat] = useState(false);

  // ----- VERIFY 관련 state -----
  const [verifyStep, setVerifyStep] = useState<VerifySubStep>('INTRO');
  const [verifySecondsLeft, setVerifySecondsLeft] = useState(
    VERIFY_WINDOW_SECONDS,
  );
  const [isCaptureFailModalOpen, setIsCaptureFailModalOpen] = useState(false);
  const [isCounterpartConfirmedChecked, setIsCounterpartConfirmedChecked] =
    useState(false);
  const [mockCaptureSucceeds, setMockCaptureSucceeds] = useState(true); // 💡 개발용

  // ----- COUNTDOWN 관련 state -----
  const [countdownPhase, setCountdownPhase] =
    useState<CountdownPhase>('COUNTING');
  const [countdownSecondsLeft, setCountdownSecondsLeft] =
    useState(COUNTDOWN_START);

  // ----- DISPUTE 관련 state -----
  const [isDisputeSubmitting, setIsDisputeSubmitting] = useState(false);
  const [disputeStep, setDisputeStep] = useState<DisputeSubStep>('CAPTURE');

  // 교환 시간이 방금 확정된 시점(false -> true 전환)의 메시지 개수를 기록해
  // "확정 카드" 위/아래로 메시지를 나눠 보여줄 수 있게 한다.
  useEffect(() => {
    if (!prevScheduledAtRef.current && scheduledAt) {
      setScheduleInsertIndex(messages.length);
    }
    prevScheduledAtRef.current = scheduledAt;
  }, [scheduledAt]);

  // 새 카드/메시지가 생기면 맨 아래로 자동 스크롤한다.
  // 단, GUIDE(강의 보유 인증 안내)로 "막 진입"한 순간에는 안내문을 위에서부터
  // 볼 수 있도록 예외적으로 맨 위로 스크롤한다.
  const prevFlowStepRef = useRef(flowStep);
  useEffect(() => {
    const justEnteredGuide =
      flowStep === 'GUIDE' && prevFlowStepRef.current !== 'GUIDE';
    if (justEnteredGuide) {
      scrollRef.current?.scrollTo({ top: 0 });
    } else {
      scrollRef.current?.scrollTo({ top: scrollRef.current?.scrollHeight });
    }
    prevFlowStepRef.current = flowStep;
  }, [
    messages,
    scheduledAt,
    flowStep,
    verifyStep,
    disputeStep,
    countdownPhase,
    cardInsertIndex,
    showPreviousChat,
    scheduleInsertIndex,
  ]);

  const handleBack = () => {
    // VERIFY/GUIDE/COUNTDOWN/DISPUTE 등 어떤 화면이든 뒤로가기는
    // 항상 채팅방을 나가서 목록 화면으로 이동
    navigate(-1);
  };

  const handleSend = () => {
    const content = inputValue.trim();
    if (!content) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        senderId: senderRole === 'ME' ? CURRENT_USER_ID : COUNTERPART_ID,
        content,
        createdAt: new Date().toISOString(),
      },
    ]);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposingRef.current && e.keyCode !== 229) {
      handleSend();
    }
  };

  const handleCloseGuide = () => {
    setFlowStep('CHAT');
  };

  const handleGoSchedule = () => {
    setIsMenuOpen(false);
    navigate(`/chat/${roomId}/schedule`);
  };

  const handleTerminateDeal = () => {
    setIsMenuOpen(false);
    navigate(`/chat/${roomId}/terminate`);
  };

  const handleReport = () => {
    setIsMenuOpen(false);
    // TODO: 신고하기 - 다음 단계에서 구현
  };

  // 메시지 리스트 렌더링 (카드 삽입 전/후 구간을 나눠서 재사용)
  const renderMessages = (msgs: ChatMessage[] = messages) =>
    msgs.map((msg) => {
      const isMine = msg.senderId === CURRENT_USER_ID;
      const timeNode = (
        <span className="text-[10px] text-gray-400 flex-shrink-0">
          {formatTime(msg.createdAt)}
        </span>
      );
      return (
        <div
          key={msg.id}
          className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}
        >
          {isMine && timeNode}
          <div
            className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
              isMine
                ? 'bg-brand-lightBlue text-white rounded-br-sm'
                : 'bg-gray-100 text-gray-900 rounded-bl-sm'
            }`}
          >
            {msg.content}
          </div>
          {!isMine && timeNode}
        </div>
      );
    });

  // 교환 시간 확정 노란 박스 (CHAT 화면 + VERIFY/DISPUTE의 "이전 채팅 보기"에서 재사용)
  const renderScheduledBox = () =>
    scheduledAt && (
      <div className="mx-4 mt-7 bg-yellow-light border-[0.70px] border-[#D1B422] rounded-lg px-4 py-8 flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <span className="w-12 h-12 rounded-full border border-[#D1B422] bg-[#FFF3B6] flex items-center justify-center flex-shrink-0">
            <Icon
              icon="mdi:calendar-check-outline"
              className="text-[30px] text-[#D1B422]"
            />
          </span>
          <div>
            <p className="text-xs font-semibold text-[#D1B422]">
              교환 시간 확정
            </p>
            <p className="text-sm font-bold text-gray-700">
              날짜 : {formatScheduledDate(scheduledAt)}
            </p>
            <p className="text-sm font-bold text-gray-700">
              시간 : {formatTime(scheduledAt)}
            </p>
          </div>
        </div>

        <ul className="flex flex-col gap-1.5">
          {[
            '교환 5분 전 강의 보유 인증이 진행됩니다',
            'PC에서 수강신청(내역) 페이지를 미리 열어주세요',
            '모바일 인증은 지원되지 않습니다',
          ].map((text) => (
            <li
              key={text}
              className="flex items-start gap-1.5 text-xs text-gray-700"
            >
              <Icon
                icon="mdi:check-circle-outline"
                className="text-[14px] bg-[#FFF3B6] rounded-full text-[#D1B422] mt-0.5 flex-shrink-0"
              />
              {text}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={handleShowGuide}
          className="w-full py-2.5 border-[0.70px] border-[#D1B422] rounded-xl bg-[#FCEFAF] text-[#D1B422] text-sm font-semibold"
        >
          캡쳐 인증 방법 확인하기
        </button>
      </div>
    );

  // VERIFY/DISPUTE의 "이전 채팅 보기"에서 쓰는 히스토리 렌더링.
  // 단순히 메시지 다 보여주고 확정 카드를 맨 뒤에 붙이는 게 아니라,
  // 확정 카드가 실제로 끼어든 시점(scheduleInsertIndex)을 기준으로
  // 메시지 사이 정확한 위치에 카드를 끼워 넣는다.
  const renderPreviousChatHistory = (uptoIndex: number) => {
    const boxIndex = Math.min(scheduleInsertIndex, uptoIndex);
    return (
      <>
        {renderMessages(messages.slice(0, boxIndex))}
        {boxIndex === scheduleInsertIndex && renderScheduledBox()}
        {renderMessages(messages.slice(boxIndex, uptoIndex))}
      </>
    );
  };

  // ============ GUIDE 로직 (캡쳐 인증 방법 안내) ============
  const handleShowGuide = () => {
    setCardInsertIndex(messages.length);
    setShowPreviousChat(false);
    setFlowStep('GUIDE');
  };

  // ============ VERIFY 로직 (이미지1) ============
  const handleEnterVerify = () => {
    setCardInsertIndex(messages.length);
    setShowPreviousChat(false);
    setFlowStep('VERIFY');
    setVerifyStep('INTRO');
    setVerifySecondsLeft(VERIFY_WINDOW_SECONDS);
    mockExchangeStore.generateQrToken(roomId);
    mockExchangeStore.setStatus(roomId, 'VERIFYING');
  };

  useEffect(() => {
    if (flowStep !== 'VERIFY' || verifyStep !== 'INTRO') return;
    const timer = setInterval(
      () => setVerifySecondsLeft((prev) => (prev > 0 ? prev - 1 : 0)),
      1000,
    );
    return () => clearInterval(timer);
  }, [flowStep, verifyStep]);

  useEffect(() => {
    if (flowStep !== 'VERIFY') return;
    if (exchange.myVerified && exchange.counterpartVerified) {
      if (verifyStep === 'WAITING_COUNTERPART')
        setVerifyStep('CONFIRM_COUNTERPART');
    } else if (exchange.myVerified) {
      if (verifyStep === 'INTRO' || verifyStep === 'CAPTURING')
        setVerifyStep('WAITING_COUNTERPART');
    }
  }, [flowStep, exchange.myVerified, exchange.counterpartVerified, verifyStep]);

  const formatVerifyTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // 💡 실제 화면 캡처 로직 - 백엔드 업로드 API 붙으면 아래 주석 블록 해제
  const startRealCapture = async (): Promise<boolean> => {
    /*
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const video = document.createElement('video');
    video.srcObject = stream;
    await video.play();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    stream.getTracks().forEach((track) => track.stop());
    if (!blob) return false;

    const formData = new FormData();
    formData.append('image', blob);
    const res = await fetch(`${API_BASE}/api/exchange/${roomId}/verify-capture`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    const data = await res.json();
    return Boolean(data?.data?.qrValid);
    */
    return mockCaptureSucceeds;
  };

  const handleStartCapture = async () => {
    setVerifyStep('CAPTURING');
    await new Promise((r) => setTimeout(r, 1200));
    const ok = await startRealCapture();
    if (!ok) {
      setIsCaptureFailModalOpen(true);
      setVerifyStep('INTRO');
      return;
    }
    mockExchangeStore.setMyVerified(roomId, true);
  };

  const handleConfirmCounterpart = () => {
    mockExchangeStore.setStatus(roomId, 'READY');
    setVerifyStep('READY');
  };

  const handleToggleCounterpartVerified = () => {
    mockExchangeStore.setCounterpartVerified(
      roomId,
      !exchange.counterpartVerified,
    );
  };

  // ============ COUNTDOWN 로직 (이미지2) ============
  const handleEnterCountdown = () => {
    setFlowStep('COUNTDOWN');
    setCountdownPhase('COUNTING');
    setCountdownSecondsLeft(COUNTDOWN_START);
    mockExchangeStore.setStatus(roomId, 'COUNTDOWN');
  };

  useEffect(() => {
    if (flowStep !== 'COUNTDOWN' || countdownPhase !== 'COUNTING') return;
    if (countdownSecondsLeft <= 0) {
      setCountdownPhase('RESULT_SELECT');
      mockExchangeStore.setStatus(roomId, 'RESULT_SELECT');
      return;
    }
    const timer = setTimeout(
      () => setCountdownSecondsLeft((prev) => prev - 1),
      1000,
    );
    return () => clearTimeout(timer);
  }, [flowStep, countdownPhase, countdownSecondsLeft, roomId]);

  const handleExchangeResult = (result: 'SUCCESS' | 'FAIL') => {
    // TODO: 실제로는 5번 API(교환 결과 선택) 호출 { result }
    if (result === 'SUCCESS') {
      mockExchangeStore.setStatus(roomId, 'COMPLETED');
      setFlowStep('CHAT');
    } else {
      mockExchangeStore.setStatus(roomId, 'DISPUTE');
      setCardInsertIndex(messages.length);
      setShowPreviousChat(false);
      setFlowStep('DISPUTE');
    }
  };

  // ============ DISPUTE 로직 (이미지3) ============
  const handleEnterDispute = () => {
    setCardInsertIndex(messages.length);
    setShowPreviousChat(false);
    setFlowStep('DISPUTE');
    setDisputeStep('CAPTURE');
  };

  const handleStartDisputeCapture = async () => {
    setIsDisputeSubmitting(true);
    // TODO: 실제로는 getDisplayMedia 캡처 + 1번 API(캡처 업로드-QR 검증) 호출
    await new Promise((r) => setTimeout(r, 1000));
    mockExchangeStore.setMyDisputeVerified(roomId, true);
    setIsDisputeSubmitting(false);
    setDisputeStep('SUBMITTED');
  };

  const handleConfirmDisputeSubmitted = () => {
    mockExchangeStore.setStatus(roomId, 'DISPUTE_SUBMITTED');
    setFlowStep('CHAT');
  };

  return (
    <div className="relative bg-[#fbfbfb] mx-auto overflow-hidden h-full flex flex-col">
      {/* ============ 헤더 (모든 flowStep 공통 디폴트) ============ */}
      <div
        style={{ '--header-h': `${HEADER_H}px` } as React.CSSProperties}
        className="[&>header]:!h-[var(--header-h)] sticky top-0 z-20 bg-[#fbfbfb]"
      >
        <Header
          leftNode={
            <div className="flex items-center gap-1">
              <IconButton
                icon={ICONS.BACK}
                onClick={handleBack}
                className="!p-1 opacity-60"
              />
              <div className="flex flex-col items-start leading-tight ml-1 mt-1">
                <span className="text-xl font-semibold leading-5 text-[#000000B2]">
                  {myCourseName}
                </span>
                <span className="text-xs text-[#727272] font-light mt-1">
                  ↔ {counterpartCourseName}
                </span>
              </div>
            </div>
          }
          rightNode={
            <IconButton
              icon={ICONS.MENU}
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="!opacity-60"
            />
          }
        />
      </div>

      {/* 햄버거 드롭다운 메뉴 - 평소 채팅 화면에서만 노출 */}
      {isMenuOpen && flowStep === 'CHAT' && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute top-[84px] right-4 z-40 w-56 bg-white rounded-xl border border-gray-100 py-2">
            <button
              type="button"
              onClick={handleGoSchedule}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Icon icon="mdi:clock-outline" className="text-[18px]" />
              교환시간 결정하기
            </button>
            <button
              type="button"
              onClick={handleTerminateDeal}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Icon icon="mdi:alert-circle-outline" className="text-[18px]" />
              거래 파기하기/원상복구하기
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Icon icon="mdi:alert-outline" className="text-[18px]" />
              신고하기
            </button>
          </div>
        </>
      )}

      {/* ============ CHAT 화면 ============ */}
      {flowStep === 'CHAT' && (
        <div
          ref={scrollRef}
          className="flex-1 min-h-0 overflow-y-auto px-5 py-4 flex flex-col gap-4 bg-[#fbfbfb]"
        >
          <p className="text-center text-xs text-[#727272] font-light font-['Pretendard'] mt-2 mb-2">
            {myCourseName.replace(' ', '')} 교환 준비방이 생성되었습니다
          </p>

          {!scheduledAt && (
            <div className="mx-4 bg-yellow-light border-[0.70px] border-[#D1B422] rounded-lg px-4 py-8 flex flex-col items-center text-center gap-5">
              <p className="text-sm font-bold text-[#194059BF] leading-relaxed">
                강의를 교환할 시간을 정해
                <br />
                교환 시간 결정 버튼을 눌러 확정해주세요
              </p>
              <p className="text-xs text-gray-700">
                다른 학우들이 수강 정정을
                <br />
                활발히 하지 않는 새벽 시간대를 추천해요.
              </p>
              <button
                type="button"
                onClick={handleGoSchedule}
                className="w-3/4 py-2.5 rounded-md bg-yellow-main border-[0.50px] border-[#D1B422] text-[#D1B422] text-sm font-semibold"
              >
                교환시간 결정하기
              </button>
            </div>
          )}

          {renderMessages(messages.slice(0, scheduleInsertIndex))}

          {renderScheduledBox()}

          {renderMessages(messages.slice(scheduleInsertIndex))}

          {/* 개발용: 발신자 전환 + 단계 바로가기 - 실배포 전 삭제 */}
          <div className="flex flex-wrap justify-end gap-1.5 pt-2">
            <button
              type="button"
              onClick={() =>
                setSenderRole((prev) => (prev === 'ME' ? 'OTHER' : 'ME'))
              }
              className="text-[10px] px-2 py-1 rounded-full bg-gray-800 text-white opacity-70"
            >
              테스트 발신자:{' '}
              {senderRole === 'ME' ? '나 (오른쪽)' : '상대방 (왼쪽)'}
            </button>
            <button
              type="button"
              onClick={handleShowGuide}
              className="text-[10px] px-2 py-1 rounded-full bg-gray-800 text-white opacity-70"
            >
              [TEST] 인증 안내
            </button>
            <button
              type="button"
              onClick={handleEnterVerify}
              className="text-[10px] px-2 py-1 rounded-full bg-gray-800 text-white opacity-70"
            >
              [TEST] 5분전 인증
            </button>
            <button
              type="button"
              onClick={handleEnterCountdown}
              className="text-[10px] px-2 py-1 rounded-full bg-gray-800 text-white opacity-70"
            >
              [TEST] 카운트다운
            </button>
            <button
              type="button"
              onClick={handleEnterDispute}
              className="text-[10px] px-2 py-1 rounded-full bg-gray-800 text-white opacity-70"
            >
              [TEST] 분쟁조정
            </button>
          </div>
        </div>
      )}

      {/* ============ GUIDE 화면 (캡쳐 인증 방법 안내) ============ */}
      {/* 인증 안내 카드는 처음 보는 안내문이므로 이전 채팅을 숨기지 않고 그냥 노출하지 않는다 (요청: 이전 채팅 안 보이게) */}
      {flowStep === 'GUIDE' && (
        <div
          ref={scrollRef}
          className="flex-1 min-h-0 overflow-y-auto px-5 py-6 flex flex-col gap-6 bg-[#fbfbfb] font-['Pretendard']"
        >
          <div className="mx-4 flex flex-col gap-2">
            <h1 className="text-lg font-bold text-gray-900">
              강의 보유 인증 안내
            </h1>
            <p className="text-xs text-gray-600 leading-relaxed">
              안전한 강의 교환을 위해 본인이 실제로 해당 강의를 보유하고 있는지
              확인하는 절차를 진행합니다.
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              인증은 교환 예정 시간 5분 전부터 가능합니다.
            </p>
            <p className="text-xs text-point-red leading-relaxed">
              인증 시작 후 5분 이내에 절차를 완료하지 않으면 거래가 자동
              취소되며 페널티가 부여될 수 있습니다. 교환 시간을 반드시 준수해
              주세요.
            </p>
          </div>

          <div className="mx-4 h-px bg-gray-200" />

          <div className="mx-4 flex flex-col gap-6">
            <h2 className="text-sm font-bold text-gray-900">인증 방법</h2>

            {GUIDE_STEPS.map((step, i) => (
              <div key={step.title} className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-gray-900">
                  {step.title}
                </p>
                <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                  {step.desc}
                </p>

                {i === 5 ? (
                  <div className="pointer-events-none opacity-80 bg-white border border-gray-200 rounded-lg px-4 py-4 flex flex-col gap-3">
                    <div className="w-full h-28 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      <Icon icon="mdi:image-outline" className="text-[28px]" />
                    </div>
                    <label className="flex items-center gap-2 text-xs text-gray-700">
                      <input type="checkbox" checked readOnly />
                      촬영된 이미지에 교환하려는 강의가 포함되어 있음을
                      확인했습니다.
                    </label>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 rounded-md border border-gray-300 text-xs text-gray-600">
                        다시 촬영
                      </button>
                      <button className="flex-1 py-2 rounded-md bg-yellow-main text-xs text-[#D1B422] font-semibold">
                        확인 완료
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-28 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    <Icon icon="mdi:image-outline" className="text-[28px]" />
                  </div>
                )}

                <span className="text-[11px] text-gray-400">
                  {step.caption}
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCloseGuide}
            className="mx-4 mt-2 py-2.5 rounded-md bg-yellow-main border-[0.50px] border-[#D1B422] text-[#D1B422] text-sm font-semibold"
          >
            확인했어요, 인증 시작하기
          </button>

          {/* 인증 안내가 뜬 이후에 보낸 새 메시지 - 카드 아래에 계속 이어짐 */}
          {messages.slice(cardInsertIndex).length > 0 && (
            <div className="mx-4 flex flex-col gap-4 pt-2">
              {renderMessages(messages.slice(cardInsertIndex))}
            </div>
          )}
        </div>
      )}

      {/* ============ VERIFY 화면 (이미지1) ============ */}
      {flowStep === 'VERIFY' && (
        <>
          <div className="fixed top-3 right-3 z-50 flex flex-col gap-1 items-end">
            <button
              type="button"
              onClick={() => setMockCaptureSucceeds((prev) => !prev)}
              className="text-[10px] px-2 py-1 rounded-full bg-gray-800 text-white opacity-70"
            >
              캡처 mock: {mockCaptureSucceeds ? '성공' : '실패'}
            </button>
            <button
              type="button"
              onClick={handleToggleCounterpartVerified}
              className="text-[10px] px-2 py-1 rounded-full bg-gray-800 text-white opacity-70"
            >
              상대방 인증: {exchange.counterpartVerified ? '완료' : '대기'}
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 min-h-0 overflow-y-auto px-5 py-4 flex flex-col gap-4"
          >
            {!showPreviousChat && (
              <button
                type="button"
                onClick={() => setShowPreviousChat(true)}
                className="w-full flex items-center justify-center gap-1 text-xs text-gray-400 py-2"
              >
                이전 채팅 보기
                <Icon icon="mdi:chevron-down" className="text-[14px]" />
              </button>
            )}
            {showPreviousChat && (
              <>
                <div className="flex flex-col gap-4 pb-2">
                  {renderPreviousChatHistory(cardInsertIndex)}
                </div>
                <button
                  type="button"
                  onClick={() => setShowPreviousChat(false)}
                  className="w-full flex items-center justify-center gap-1 text-xs text-gray-400 py-2"
                >
                  이전 채팅 보기
                  <Icon icon="mdi:chevron-up" className="text-[14px]" />
                </button>
              </>
            )}

            {(verifyStep === 'INTRO' || verifyStep === 'CAPTURING') && (
              <div className="mx-4 bg-yellow-light border-[0.7px] border-[#D1B422] rounded-lg px-5 py-6 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-[#FFF3B6] flex items-center justify-center">
                    <Icon
                      icon="mdi:calendar-check-outline"
                      className="text-[23px] text-[#D1B422]"
                    />
                  </span>
                  <p className="text-base font-bold text-gray-700">
                    교환 5분 전! 강의 보유 인증 시작
                  </p>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  안전한 교환을 위해 현재 해당 강의를 보유하고 있는지
                  확인합니다. 5분 이내에 진행해주세요.
                </p>

                <div className="h-px bg-[#EADB93]" />

                <ul className="flex flex-col gap-1.5">
                  {[
                    'PC에 수강신청(내역) 페이지를 띄워주세요.',
                    '[인증 시작] 버튼을 누른 후 화면 공유를 허용해주세요.',
                    '수강신청(내역) 페이지와 아래 QR 코드가 함께 보이도록 전체 화면을 공유해주세요.',
                  ].map((text) => (
                    <li
                      key={text}
                      className="flex items-start gap-1.5 text-xs text-gray-700"
                    >
                      <Icon
                        icon="mdi:check-circle-outline"
                        className="text-[14px] text-[#D1B422] bg-[#FFF3B6] rounded-full mt-0.5 flex-shrink-0"
                      />
                      {text}
                    </li>
                  ))}
                </ul>

                <p className="text-[11px] text-[#D1B422]">
                  ※ 수강신청(내역) 페이지와 QR 코드가 동시에 확인되어야 인증이
                  완료됩니다.
                </p>

                {exchange.qrToken && (
                  <div className="flex justify-center py-2">
                    <div className="w-36 h-36 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                      <Icon
                        icon="mdi:qrcode"
                        className="text-[100px] text-gray-800"
                      />
                    </div>
                  </div>
                )}

                <Button
                  variant="warning"
                  size="lg"
                  disabled={verifyStep === 'CAPTURING'}
                  onClick={handleStartCapture}
                  className="!bg-yellow-main !text-[#D1B422] border-[0.70px] border-[#D1B422]"
                >
                  {verifyStep === 'CAPTURING'
                    ? '인증 확인 중...'
                    : `인증 시작하기 ${formatVerifyTimer(verifySecondsLeft)}`}
                </Button>
              </div>
            )}

            {verifyStep === 'WAITING_COUNTERPART' && (
              <div className="mx-4 bg-yellow-light border-[0.7px] border-[#D1B422] rounded-lg px-5 py-8 flex flex-col items-center gap-3 text-center">
                <Icon
                  icon="mdi:check-circle"
                  className="text-[32px] text-[#D1B422]"
                />
                <p className="text-sm font-bold text-gray-700">
                  QR 코드 인증이 완료되었습니다.
                </p>
                <p className="text-xs text-gray-600">
                  상대방의 인증을 기다리고 있어요.
                </p>
              </div>
            )}

            {verifyStep === 'CONFIRM_COUNTERPART' && (
              <div className="mx-4 bg-yellow-light border-[0.7px] border-[#D1B422] rounded-lg px-5 py-6 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-[#FFF3B6] flex items-center justify-center">
                    <Icon
                      icon="mdi:calendar-check-outline"
                      className="text-[18px] text-[#D1B422]"
                    />
                  </span>
                  <p className="text-base font-bold text-gray-700">
                    교환 대상 강의 확인
                  </p>
                </div>

                <div className="bg-white rounded-xl h-32 flex flex-col items-center justify-center gap-1 text-gray-400">
                  <Icon icon="mdi:monitor" className="text-[36px]" />
                  <span className="text-sm">상대방의 공유 화면</span>
                </div>

                <p className="text-xs text-[#727272] leading-relaxed">
                  QR 코드 인증이 완료되었습니다.
                  <br />
                  상대방이 보유한 강의 정보를 확인해주세요.
                </p>
                <p className="text-xs text-gray-700">
                  교환을 진행할 준비가 되었다면 아래 버튼을 눌러주세요.
                </p>

                <label className="flex items-center gap-2 text-xs text-[#D1B422]">
                  <input
                    type="checkbox"
                    checked={isCounterpartConfirmedChecked}
                    onChange={(e) =>
                      setIsCounterpartConfirmedChecked(e.target.checked)
                    }
                    className="accent-[#D1B422]"
                  />
                  상대방의 강의 정보를 확인했습니다
                </label>

                <Button
                  variant="warning"
                  size="lg"
                  disabled={!isCounterpartConfirmedChecked}
                  onClick={handleConfirmCounterpart}
                  className="!bg-yellow-main !border !border-[#D1B422] !text-[#D1B422]"
                >
                  교환 준비 완료
                </Button>
              </div>
            )}

            {verifyStep === 'READY' && (
              <div className="mx-4 bg-yellow-light border-[0.7px] border-[#D1B422] rounded-lg px-5 py-8 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-[#FFF3B6] flex items-center justify-center">
                    <Icon
                      icon="mdi:check-circle-outline"
                      className="text-[18px] text-[#D1B422]"
                    />
                  </span>
                  <p className="text-base font-bold text-gray-700">
                    교환 준비 완료
                  </p>
                </div>

                <p className="text-xs text-[#727272] leading-relaxed">
                  양측이 모두 [카운트다운 시작] 버튼을 누르면
                  <br />
                  10초 후 강의 교환이 시작됩니다
                </p>
                <p className="text-xs text-[#727272] leading-relaxed">
                  카운트다운이 종료되면 현재 강의를 버리고
                  <br />
                  상대방의 강의를 신청해 주세요!
                </p>
                <p className="text-[11px] text-[#D1B422]">
                  ※ 카운트다운이 시작되면 취소할 수 없습니다
                </p>

                <label className="flex items-center gap-2 text-xs text-[#D1B422]">
                  <input
                    className="accent-[#D1B422]"
                    type="checkbox"
                    checked
                    readOnly
                  />
                  강의를 버리고 잡을 준비가 되었습니다
                </label>

                <Button
                  variant="warning"
                  size="lg"
                  onClick={handleEnterCountdown}
                  className="!bg-yellow-main border-[0.70px] border-[#D1B422] !text-[#D1B422] "
                >
                  카운트다운 시작
                </Button>
              </div>
            )}

            {/* 5분 전 인증이 뜬 이후에 보낸 새 메시지 - 카드 아래에 계속 이어짐 */}
            {messages.slice(cardInsertIndex).length > 0 && (
              <div className="flex flex-col gap-4 pt-2">
                {renderMessages(messages.slice(cardInsertIndex))}
              </div>
            )}
          </div>

          <Modal
            isOpen={isCaptureFailModalOpen}
            onClose={() => setIsCaptureFailModalOpen(false)}
            icon={
              <span className="w-10 h-10 rounded-full bg-point-red/10 flex items-center justify-center">
                <Icon
                  icon="mdi:alert-circle"
                  className="text-[28px] text-point-red"
                />
              </span>
            }
            title="인증에 실패했습니다"
            footer={
              <Button
                variant="danger"
                size="md"
                onClick={() => setIsCaptureFailModalOpen(false)}
              >
                다시 인증하기
              </Button>
            }
          >
            {'\n'}인증 QR 코드를 확인할 수 없습니다.{'\n\n'}
            수강신청(내역) 페이지와 인증 QR 코드가{'\n'}한 화면에 모두 보이도록
            한 뒤{'\n'}
            다시 인증을 진행해주세요.
          </Modal>
        </>
      )}

      {/* ============ DISPUTE 화면 (이미지3) ============ */}
      {flowStep === 'DISPUTE' && (
        <div
          ref={scrollRef}
          className="flex-1 min-h-0 overflow-y-auto px-5 py-4"
        >
          {!showPreviousChat && (
            <button
              type="button"
              onClick={() => setShowPreviousChat(true)}
              className="w-full flex items-center justify-center gap-1 text-xs text-gray-400 py-2"
            >
              이전 채팅 보기
              <Icon icon="mdi:chevron-down" className="text-[14px]" />
            </button>
          )}
          {showPreviousChat && (
            <>
              <div className="flex flex-col gap-4 pb-2">
                {renderPreviousChatHistory(cardInsertIndex)}
              </div>
              <button
                type="button"
                onClick={() => setShowPreviousChat(false)}
                className="w-full flex items-center justify-center gap-1 text-xs text-gray-400 py-2"
              >
                이전 채팅 보기
                <Icon icon="mdi:chevron-up" className="text-[14px]" />
              </button>
            </>
          )}

          {/* ---- 1단계: 인증 시작 카드 ---- */}
          {disputeStep === 'CAPTURE' && (
            <div className="mx-4 bg-point-red/5 border border-point-red rounded-lg px-5 py-6 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-full bg-point-red/10 border-[0.70px] border-point-red flex items-center justify-center">
                  <img src={disputeIcon} alt="" className="w-6 h-6" />
                </span>
                <p className="text-base font-bold text-gray-700">
                  교환 실패로 인한 분쟁 조정 진행
                </p>
              </div>

              <p className="text-xs text-gray-700 leading-relaxed">
                교환 실패로 인해 분쟁 조정 절차가 시작되었습니다. 양측 모두 수강
                취소 여부를 확인하기 위해 수강 취소 내역 인증을 진행합니다.
              </p>

              <div className="h-px bg-red-100" />

              <ul className="flex flex-col gap-1.5">
                {[
                  'PC에 수강신청(내역) 페이지를 띄워주세요.',
                  '[인증 시작] 버튼을 누른 후 화면 공유를 허용해주세요.',
                  '수강신청(내역) 페이지와 아래 QR 코드가 함께 보이도록 전체 화면을 공유해주세요.',
                ].map((text) => (
                  <li
                    key={text}
                    className="flex items-start gap-1.5 text-xs text-gray-700"
                  >
                    <Icon
                      icon="mdi:check-circle-outline"
                      className="text-[14px] text-point-red mt-0.5 flex-shrink-0"
                    />
                    {text}
                  </li>
                ))}
              </ul>

              <p className="text-[11px] text-point-red font-bold">
                ※ 수강신청(내역) 페이지와 QR 코드가 동시에 확인되어야 인증이
                완료됩니다.
                <br />※ 5분 이내에 인증을 완료하지 않을 경우 거래 결과 판정에
                불이익이 발생할 수 있습니다
              </p>

              <div className="flex justify-center py-2">
                <div className="w-36 h-36 bg-white border border-red-100 rounded-lg flex items-center justify-center">
                  <Icon
                    icon="mdi:qrcode"
                    className="text-[100px] text-point-red"
                  />
                </div>
              </div>

              <Button
                variant="danger"
                size="lg"
                disabled={isDisputeSubmitting}
                onClick={handleStartDisputeCapture}
              >
                {isDisputeSubmitting ? '확인 중...' : '인증 시작'}
              </Button>
            </div>
          )}

          {/* ---- 2단계: 인증 제출 완료 카드 (모달 아님, 인라인) ---- */}
          {disputeStep === 'SUBMITTED' && (
            <div className="mx-4 bg-point-red/5 border border-point-red rounded-lg px-5 py-8 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-full bg-point-red/10 border-[0.70px] border-point-red flex items-center justify-center">
                  <Icon
                    icon="mdi:check"
                    className="text-[22px] text-point-red"
                  />
                </span>
                <p className="text-base font-bold text-gray-700">
                  인증 제출 완료
                </p>
              </div>

              <p className="text-xs text-gray-700 leading-relaxed">
                분쟁 조정 결과는 양측의 인증을 관리자가 확인한 후 알림을 통해
                확인할 수 있습니다.
              </p>

              <div className="h-px bg-red-100" />

              <ul className="flex flex-col gap-2">
                {[
                  '양측 모두 정상적으로 수강 취소를 진행한 것으로 확인될 경우, 해당 거래는 사기가 아닌 교환 실패로 처리됩니다.',
                  '수강신청 결과는 학교 시스템 및 제3자의 신청 상황에 따라 달라질 수 있으며, 이로 인해 발생한 교환 실패에 대해서는 결과를 보장할 수 없습니다.',
                  '교환 실패로 판정된 경우 양측 모두 페널티 없이 거래가 종료됩니다.',
                ].map((text) => (
                  <li
                    key={text}
                    className="flex items-start gap-1.5 text-xs text-gray-700"
                  >
                    <Icon
                      icon="mdi:check-circle-outline"
                      className="text-[14px] text-point-red mt-0.5 flex-shrink-0"
                    />
                    {text}
                  </li>
                ))}
              </ul>

              <Button
                variant="danger"
                size="lg"
                onClick={handleConfirmDisputeSubmitted}
              >
                확인
              </Button>
            </div>
          )}

          {/* 분쟁 조정이 뜬 이후에 보낸 새 메시지 - 카드 아래에 계속 이어짐 */}
          {messages.slice(cardInsertIndex).length > 0 && (
            <div className="flex flex-col gap-4 pt-2">
              {renderMessages(messages.slice(cardInsertIndex))}
            </div>
          )}
        </div>
      )}

      {/* ============ COUNTDOWN 배경 (헤더/푸터 사이 flex-1을 채워 레이아웃 유지) ============ */}
      {/* 이 컨테이너가 없으면 헤더-푸터 사이가 비어 푸터가 헤더 바로 아래로 붙어버린다. */}
      {flowStep === 'COUNTDOWN' && (
        <div
          ref={scrollRef}
          className="flex-1 min-h-0 overflow-y-auto px-5 py-4 flex flex-col gap-4 bg-[#fbfbfb]"
        >
          {renderPreviousChatHistory(messages.length)}
        </div>
      )}

      {/* ============ COUNTDOWN 오버레이 (이미지2) - Modal 컴포넌트 재사용 ============ */}
      {/* Modal은 헤더/푸터 위에 오버레이로 뜨므로, 아래 기본 헤더/푸터는 "보이기만" 하고
          이 동안은 기능(전송 등)이 굳이 동작하지 않아도 된다. */}
      {flowStep === 'COUNTDOWN' && countdownPhase === 'COUNTING' && (
        <Modal isOpen title="교환 시작까지">
          <div className="flex flex-col items-center gap-4 translate-y-6">
            <p
              className={`text-5xl !font-['Paperozi'] font-extrabold mb-5 ${
                countdownSecondsLeft <= COUNTDOWN_RED_THRESHOLD
                  ? 'text-point-red'
                  : 'text-black'
              }`}
            >
              {countdownSecondsLeft}초
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              상대방도 준비를 완료했습니다.
              <br />
              강의를 버리고 잡을 준비를 해주세요.
            </p>
          </div>
        </Modal>
      )}

      {flowStep === 'COUNTDOWN' && countdownPhase === 'RESULT_SELECT' && (
        <Modal
          isOpen
          title={<span className="text-point-red">지금 교환하세요</span>}
          footer={
            <div className="w-full flex flex-col gap-2">
              <Button
                variant="danger"
                size="lg"
                onClick={() => handleExchangeResult('SUCCESS')}
              >
                교환성공
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleExchangeResult('FAIL')}
              >
                교환 실패
              </Button>
            </div>
          }
        >
          <div className="flex flex-col gap-3 py-1">
            <div className="text-sm text-gray-700 leading-relaxed text-left">
              <p>1. 현재 강의를 취소하세요.</p>
              <p>2. 상대방의 강의를 신청하세요.</p>
            </div>
            <p className="text-sm text-left text-gray-700">
              강의 신청이 완료되면
              <br />
              결과에 따라 아래 버튼을 선택해주세요.
            </p>
          </div>
        </Modal>
      )}

      {/* ============ 푸터 (모든 flowStep 공통 디폴트) ============ */}
      {/* 헤더와 동일하게 flowStep과 무관하게 항상 렌더링된다.
          COUNTDOWN 단계에서는 위에 Modal 오버레이가 덮이므로 "보이기만" 하는 상태가 된다. */}
      <div className="px-6 py-3 bg-[#fbfbfb]">
        <Input
          variant="pill"
          placeholder="메세지 보내기"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onCompositionStart={() => (isComposingRef.current = true)}
          onCompositionEnd={() => (isComposingRef.current = false)}
          onKeyDown={handleKeyDown}
          rightNode={
            <button type="button" onClick={handleSend} aria-label="전송">
              {<img src={sendIcon} alt="" className="w-7 h-7" />}
            </button>
          }
        />
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Icon } from '@iconify/react';
import Header from '@/components/layout/Header';
import { Badge } from '@/components/common/Badge';
import { IconButton } from '@/components/common/IconButton';
import { ICONS } from '@/constants/icons';

// 💡 새롭게 만든 Avatar와 Input 컴포넌트를 import 해주세요.
// (경로는 프로젝트 구조에 맞게 수정해 주세요)
import { Avatar } from '@/components/common/Avatar';
import { Input } from '@/components/common/Input';

export const PostDetailPage = () => {
  // 우측 상단 더보기(점 세 개) 메뉴 모달 상태
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // 댓글 입력 상태
  const [commentInput, setCommentInput] = useState('');

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* =========================================================
          1. 상단 헤더 영역
         ========================================================= */}
      <div className="shrink-0 w-full z-30 relative">
        <Header
          leftNode={
            <IconButton
              icon={ICONS.BACK}
              onClick={() => window.history.back()}
            />
          }
          title="게시글 상세"
          rightNode={
            <div className="relative">
              <IconButton
                icon={ICONS.MORE_VERTICAL}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              />

              {/* ⭕ 더보기 드롭다운 모달 (점 세 개 클릭 시 노출) */}
              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute top-full right-2 mt-1 w-[160px] bg-white border border-gray-200 shadow-sm z-50 flex flex-col text-[14px] text-gray-700">
                    <button className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-left">
                      <Icon
                        icon={ICONS.CLOSE}
                        className="text-[16px] text-gray-400"
                      />
                      삭제하기
                    </button>
                    <button className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-left">
                      {/* 수정 아이콘은 ICONS에 없으므로 임시로 직접 텍스트를 넣거나 나중에 ICONS.EDIT 등을 추가해서 쓰시면 됩니다! */}
                      <Icon
                        icon="ph:pencil-simple"
                        className="text-[16px] text-gray-400"
                      />
                      게시글 수정하기
                    </button>
                  </div>
                </>
              )}
            </div>
          }
        />
      </div>

      {/* =========================================================
          2. 스크롤 가능한 본문 및 댓글 영역
         ========================================================= */}
      <div className="flex-1 overflow-y-auto pb-[90px]">
        {/* 본문 컨텐츠 */}
        <div className="px-5 pt-4 pb-6">
          {/* 배지 */}
          <div className="flex gap-2 mb-4">
            <Badge variant="primary">강의 꿀팁</Badge>
            <Badge variant="secondary">데이터베이스</Badge>
          </div>

          {/* 작성자 정보 */}
          <div className="flex items-center gap-3 mb-5">
            <Avatar size="md" className="!rounded-xl" /> {/* 💡 여기! */}
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 text-[15px]">송이</span>
              <span className="text-[13px] text-gray-500">05/08 18:02</span>
            </div>
          </div>

          {/* 게시글 제목 및 내용 */}
          <h1 className="text-[18px] font-bold text-gray-900 mb-3">
            데이터베이스 001분반 증원
          </h1>
          <p className="text-[15px] text-gray-600 leading-relaxed mb-6">
            증원된 거 확인하세요
          </p>

          {/* 본문 등록 시간 */}
          <div className="flex items-center justify-end gap-1 text-[13px] text-gray-400">
            <Icon icon="ph:clock-fill" className="text-[14px]" />
            <span>6/29 19:37</span>
          </div>
        </div>

        {/* 액션 바 (공감 / 댓글 / 스크랩) */}
        <div className="flex border-y border-gray-100 py-3 mx-4 text-[14px] text-gray-400">
          <button className="flex-1 flex items-center justify-center gap-1.5 hover:text-gray-600 transition-colors">
            <Icon icon="ph:heart" className="text-[18px]" />
            공감 12
          </button>
          <div className="w-[1px] bg-gray-200" />
          <button className="flex-1 flex items-center justify-center gap-1.5 hover:text-gray-600 transition-colors">
            <Icon icon="ph:chat-circle" className="text-[18px]" />
            댓글 2
          </button>
          <div className="w-[1px] bg-gray-200" />
          <button className="flex-1 flex items-center justify-center gap-1.5 hover:text-gray-600 transition-colors">
            <Icon icon="ph:bookmark-simple" className="text-[18px]" />
            스크랩 0
          </button>
        </div>

        {/* 댓글 목록 영역 */}
        <div className="px-5 py-6">
          <div className="flex items-center gap-1.5 font-bold text-brand-navy mb-6">
            <Icon icon="ph:chat-circle" className="text-[18px]" />
            <span>댓글 2</span>
          </div>

          <div className="space-y-6">
            {/* 댓글 1 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Avatar size="sm" className="!rounded-xl" /> {/* 💡 여기! */}
                  <span className="font-semibold text-gray-900 text-[14px]">
                    송이1
                  </span>
                </div>
                <span className="text-[12px] text-gray-400">10분 전</span>
              </div>
              <p className="text-[15px] text-gray-900 pl-10">바로 신청했다</p>
            </div>

            {/* 댓글 2 (내 댓글인 경우 '삭제' 버튼 표시) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Avatar size="sm" className="!rounded-xl" /> {/* 💡 여기! */}
                  <span className="font-semibold text-gray-900 text-[14px]">
                    송이2
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[12px] text-gray-400">
                  <span>10분 전</span>
                  <button className="hover:text-gray-600">삭제</button>
                </div>
              </div>
              <p className="text-[15px] text-gray-900 pl-10">바로 신청했다</p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          3. 하단 댓글 입력창 (고정)
         ========================================================= */}
      <div className="absolute bottom-0 left-0 w-full px-4 py-3 pb-safe z-30">
        {/* 💡 하단 인풋창을 Input 컴포넌트(pill 스타일)로 교체하고 rightNode에 버튼을 배치했습니다. */}
        <Input
          variant="pill"
          placeholder="댓글을 입력하세요"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}

          className="!bg-[#F6F6F6] !border-transparent focus:!border-gray-300"

          rightNode={
            <button
              className="text-black flex items-center justify-center disabled:opacity-30"
              disabled={!commentInput.trim()}
            >
              <Icon icon="mingcute:send-plane-fill" className="text-[22px]" />
            </button>
          }
        />
      </div>
    </div>
  );
};

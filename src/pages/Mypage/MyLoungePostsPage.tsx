import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { IconButton } from '@/components/common/IconButton';
import { ICONS } from '@/constants/icons';

import cautionBlueIcon from '@/assets/icons/caution_blue.svg';

// 💡 1. API 연동을 위한 데이터 인터페이스 정의
interface CategoryTag {
  label: string;
  style: string; // Tailwind 클래스를 직접 주입하여 카테고리별 다채로운 스타일 구현
}

interface LoungePost {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  categoryTag: CategoryTag;
  subjectTag: string;
  likeCount: number;
  commentCount: number;
  isBookmarked: boolean;
}

// 💡 2. 테스트용 목업 데이터 (API 연동 시 이 부분을 서버 데이터로 교체하세요!)
const MOCK_LOUNGE_POSTS: LoungePost[] = [
  {
    id: 1,
    title: '데이터베이스 001분반 증원',
    content: '증원된 거 확인하세요',
    createdAt: '6/29 19:37',
    categoryTag: {
      label: '강의꿀팁',
      style: 'bg-blue-400 text-white border-transparent',
    },
    subjectTag: '데이터베이스',
    likeCount: 12,
    commentCount: 2,
    isBookmarked: false,
  },
  {
    id: 2,
    title: '운영체제 2분반 폐강위기',
    content: '현재 수강 인원 7명 3명만 더',
    createdAt: '6/29 19:37',
    categoryTag: {
      label: '교양필수',
      style: 'bg-yellow-100 text-zinc-900 border-yellow-500 border-[0.5px]',
    },
    subjectTag: '운영체제',
    likeCount: 12,
    commentCount: 2,
    isBookmarked: false,
  },
];

const MyLoungePostsPage: React.FC = () => {
  const navigate = useNavigate();

  // 테스트용 게시글 데이터 상태 (MOCK 데이터로 초기화)
  const [posts, setPosts] = useState<LoungePost[]>(MOCK_LOUNGE_POSTS);

  return (
    <div className="w-full min-h-screen bg-neutral-50 flex flex-col font-['Pretendard']">
      {/* 상단 헤더 영역 고정 */}
      <div className="sticky top-0 z-50 bg-neutral-50">
        <Header
          leftNode={
            <IconButton
              icon={ICONS.BACK}
              onClick={() => navigate(-1)}
              className="text-black/40"
            />
          }
          title={
            <div className="text-left whitespace-nowrap transform -translate-x-16 text-black/70 text-xl font-semibold leading-5 tracking-wide">
              내 라운지 게시글
            </div>
          }
          rightNode={
            <IconButton
              icon={ICONS.BELL}
              onClick={() => navigate('/notifications')}
              className="text-black/40"
            />
          }
        />
      </div>

      {/* 중앙 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col px-4 pt-4 pb-10">
        {posts.length === 0 ? (
          // 게시글이 없을 때 (Empty State)
          <div className="flex-1 flex flex-col items-center justify-center transform -translate-y-10">
            <img
              src={cautionBlueIcon}
              alt="No posts caution"
              className="w-12 h-12 mb-6 select-none"
            />
            <div className="text-sm font-medium text-black leading-5 tracking-wide">
              아직 등록한 라운지 게시글이 없어요.
            </div>
          </div>
        ) : (
          // 게시글이 있을 때 (List State)
          <div className="flex flex-col gap-3">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => navigate(`/lounge/${post.id}`)}
                className="w-full bg-white rounded-lg border border-zinc-300 p-[15px] flex flex-col cursor-pointer hover:bg-neutral-50 transition-colors"
              >
                {/* 1. 상단: 제목 & 작성 시간 */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-zinc-900 text-base font-bold leading-5 tracking-wide line-clamp-1">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-1 text-neutral-500 text-xs font-normal shrink-0 ml-2">
                    {/* 시계 아이콘 */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-3.5 h-3.5 text-zinc-400"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{post.createdAt}</span>
                  </div>
                </div>

                {/* 2. 중단: 본문 내용 (미리보기) */}
                <p className="text-neutral-500 text-xs font-light leading-5 tracking-wide mb-4 line-clamp-1">
                  {post.content}
                </p>

                {/* 3. 하단: 태그 & 리액션(좋아요, 북마크, 댓글) */}
                <div className="flex justify-between items-end">
                  {/* 왼쪽 태그 그룹 */}
                  <div className="flex items-center gap-1.5">
                    {/* 카테고리 태그 (스타일 동적 적용) */}
                    <div
                      className={`px-[11px] py-[2.5px] rounded-lg border ${post.categoryTag.style} flex items-center justify-center`}
                    >
                      <span className="text-xs font-normal leading-5 tracking-wide">
                        {post.categoryTag.label}
                      </span>
                    </div>
                    {/* 과목 태그 (회색 고정) */}
                    <div className="px-[11px] py-[2.5px] rounded-lg bg-gray-200 border border-transparent flex items-center justify-center">
                      <span className="text-zinc-900 text-xs font-normal leading-5 tracking-wide">
                        {post.subjectTag}
                      </span>
                    </div>
                  </div>

                  {/* 오른쪽 리액션 아이콘 그룹 */}
                  <div className="flex items-center gap-3 text-neutral-500 text-xs font-normal">
                    {/* 좋아요 */}
                    <div className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-[15px] h-[15px]"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                      </svg>
                      <span>{post.likeCount}</span>
                    </div>
                    {/* 북마크 */}
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-[15px] h-[15px]"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                        />
                      </svg>
                    </div>
                    {/* 댓글 */}
                    <div className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-[15px] h-[15px]"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                        />
                      </svg>
                      <span>{post.commentCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLoungePostsPage;

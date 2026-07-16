import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { IconButton } from '@/components/common/IconButton';
import { ICONS } from '@/constants/icons';
import { Tabs } from '../../components/common/Tabs';
import { EmptyState } from '../../components/common/EmptyState';
import axiosInstance from '@/api/axiosInstance';

import searchIcon from '@/assets/icons/search_icon.svg';
import redHeartIcon from '@/assets/icons/red_heart.svg';
import grayHeartIcon from '@/assets/icons/gray_heart.svg';

interface CourseInfo {
  courseId: number;
  name: string;
}

interface WantedCourseItem {
  priority: number;
  course: CourseInfo;
}

interface WishPostItem {
  postId: number;
  status: 'MATCHABLE' | 'CLOSED' | string;
  blinded: boolean;
  blindReason?: 'DELETED' | 'MATCHED' | string;
  discardCourse: CourseInfo;
  wantedCourses: WantedCourseItem[];
  requestCount?: number;
}

// 💡 [테스트용 데이터] 3번은 교환 완료, 4번은 삭제된 게시글
const MOCK_WISH_POSTS: WishPostItem[] = [
  {
    postId: 1,
    status: 'MATCHABLE',
    blinded: false,
    discardCourse: { courseId: 101, name: '마케팅과 소비자이슈' },
    wantedCourses: [
      { priority: 1, course: { courseId: 201, name: '운영체제' } },
      { priority: 2, course: { courseId: 202, name: '소프트웨어이해' } },
      { priority: 3, course: { courseId: 203, name: '프로그래밍언어론' } },
    ],
    requestCount: 3,
  },
  {
    postId: 2,
    status: 'MATCHABLE',
    blinded: false,
    discardCourse: { courseId: 102, name: '교양필라테스' },
    wantedCourses: [
      { priority: 1, course: { courseId: 301, name: '교양 요가' } },
      { priority: 2, course: { courseId: 302, name: '발레를 통한 자세교정' } },
      { priority: 3, course: { courseId: 303, name: '교양 웨이트 트레이닝' } },
    ],
    requestCount: 3,
  },
  {
    postId: 3,
    status: 'CLOSED',
    blinded: true,
    blindReason: 'MATCHED', // 교환 완료
    discardCourse: { courseId: 103, name: 'SM리더특강' },
    wantedCourses: [
      { priority: 1, course: { courseId: 201, name: '운영체제' } },
      { priority: 2, course: { courseId: 202, name: '소프트웨어이해' } },
      { priority: 3, course: { courseId: 203, name: '프로그래밍언어론' } },
    ],
  },
  {
    postId: 4,
    status: 'CLOSED',
    blinded: true,
    blindReason: 'DELETED', // 삭제됨
    discardCourse: { courseId: 104, name: 'SM리더특강' }, // 피그마 시안 동일 과목명 테스트
    wantedCourses: [
      { priority: 1, course: { courseId: 401, name: '운영체제' } },
      { priority: 2, course: { courseId: 402, name: '소프트웨어이해' } },
      { priority: 3, course: { courseId: 403, name: '프로그래밍언어론' } },
    ],
  },
];

const LikeListPage = () => {
  const navigate = useNavigate();
  const [activeTabId, setActiveTabId] = useState<string>('모집중');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [wishPosts, setWishPosts] = useState<WishPostItem[]>(MOCK_WISH_POSTS);

  const [unlikedPostIds, setUnlikedPostIds] = useState<number[]>([]);
  const [showToast, setShowToast] = useState<boolean>(false);

  const tabs = [
    { id: '모집중', label: '모집중' },
    { id: '마감', label: '마감' },
  ];

  const handleToggleLike = async (e: React.MouseEvent, postId: number) => {
    e.stopPropagation();
    if (unlikedPostIds.includes(postId)) return;

    setUnlikedPostIds((prev) => [...prev, postId]);
    setShowToast(true);

    setTimeout(() => {
      setWishPosts((prev) => prev.filter((item) => item.postId !== postId));
      setUnlikedPostIds((prev) => prev.filter((id) => id !== postId));
      setShowToast(false);
    }, 5000);
  };

  const filteredPosts = wishPosts.filter((post) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      post.discardCourse?.name.toLowerCase().includes(query) ||
      post.wantedCourses?.some((w) =>
        w.course?.name.toLowerCase().includes(query),
      );

    return matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-[#FBFBFB] flex flex-col font-['Pretendard'] relative pb-20">
      {/* 1. 헤더 & 탭 */}
      <div className="sticky top-0 z-40 bg-[#FBFBFB]">
        <Header
          leftNode={
            <IconButton icon={ICONS.BACK} onClick={() => navigate(-1)} />
          }
          title={
            <div className="text-left whitespace-nowrap transform -translate-x-24 text-black/70 text-xl font-semibold leading-5 tracking-wide">
              찜 목록
            </div>
          }
          rightNode={
            <IconButton
              icon={ICONS.BELL}
              onClick={() => navigate('/notifications')}
              className="text-brand-lightBlue"
            />
          }
        />
        <Tabs
          tabs={tabs}
          activeTabId={activeTabId}
          onTabChange={(id) => setActiveTabId(id)}
          variant="line"
        />
      </div>

      {/* 2. 검색 인풋 */}
      <div className="px-5 pt-4 pb-2 bg-[#FBFBFB]">
        <div className="w-full h-11 bg-white rounded-3xl border border-gray-200 px-5 flex items-center justify-between">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="검색어를 입력해주세요"
            className="flex-1 bg-transparent border-none outline-none text-sm font-light text-black placeholder-neutral-400 leading-5 tracking-wide"
          />
          <img
            src={searchIcon}
            alt="검색"
            className="w-[18px] h-[18px] cursor-pointer"
          />
        </div>
      </div>

      {/* 3. 리스트 영역 */}
      <div className="flex-1 px-5 pt-2">
        {filteredPosts.length === 0 ? (
          <EmptyState
            title="아직 등록한 교환 게시글이 없어요."
            description={`교환하려는 과목을 등록하고\n원하는 과목을 찾아보세요!`}
            className="h-[50vh] justify-center"
            action={
              <button
                onClick={() => navigate('/board')}
                className="text-brand-lightBlue text-base font-medium underline leading-5 tracking-wide hover:opacity-80 transition-opacity"
              >
                교환 게시판가기 &gt;
              </button>
            }
          />
        ) : (
          <div className="flex flex-col divide-y divide-gray-200 pb-10">
            {filteredPosts.map((post) => {
              const isBlind = post.blinded;
              const isUnliking = unlikedPostIds.includes(post.postId);
              const isGrayedOut = isBlind || isUnliking;

              // 💡 피그마 시안 기반 컬러 값 완벽 매핑
              const titleColor = isGrayedOut
                ? 'text-neutral-400'
                : 'text-black';
              // 숫자 동그라미 뱃지 배경: 블라인드일 땐 bg-neutral-400
              const badgeBgColor = isGrayedOut
                ? 'bg-neutral-400'
                : 'bg-blue-100';
              const badgeTextColor = isGrayedOut
                ? 'text-black/60'
                : 'text-black/60';
              // 과목 텍스트 컬러: 블라인드일 땐 text-neutral-400
              const subTextColor = isGrayedOut
                ? 'text-neutral-400'
                : 'text-black/70';

              return (
                <div
                  key={post.postId}
                  onClick={() => {
                    if (!isGrayedOut) navigate(`/board/${post.postId}`);
                  }}
                  className={`py-5 relative flex flex-col transition-all duration-300 ${
                    isGrayedOut
                      ? 'cursor-not-allowed'
                      : 'cursor-pointer hover:bg-black/[0.01]'
                  }`}
                >
                  {/* 상단: 버리는 과목명 + 하트 아이콘 */}
                  <div className="flex items-start justify-between mb-3">
                    <h3
                      className={`text-lg font-medium leading-5 tracking-wide transition-colors ${titleColor}`}
                    >
                      {post.discardCourse?.name}
                    </h3>

                    {/* 하트 아이콘 (블라인드된 게시글은 무조건 회색 하트) */}
                    <button
                      onClick={(e) => handleToggleLike(e, post.postId)}
                      disabled={isGrayedOut}
                      className="p-1 -mr-1 transition-transform active:scale-95 disabled:active:scale-100 z-10"
                      aria-label="찜 해제"
                    >
                      <img
                        src={isGrayedOut ? grayHeartIcon : redHeartIcon}
                        alt="Heart"
                        className="w-[22px] h-[22px]"
                      />
                    </button>
                  </div>

                  {/* 중단: 희망 과목 리스트 */}
                  <div className="flex flex-col gap-1.5 pl-0.5 relative">
                    {post.wantedCourses?.map((item) => (
                      <div
                        key={item.priority}
                        className="flex items-center gap-2"
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8.5px] font-light shrink-0 transition-colors ${badgeBgColor} ${badgeTextColor}`}
                        >
                          {item.priority}
                        </div>
                        <span
                          className={`text-xs font-light leading-5 tracking-wide transition-colors ${subTextColor}`}
                        >
                          {item.course?.name}
                        </span>
                      </div>
                    ))}

                    {/* 일반 상태: "받은 요청 N개 >" */}
                    {!isBlind && post.requestCount && !isUnliking && (
                      <div className="absolute right-0 bottom-0 flex items-center text-xs font-light tracking-wide text-neutral-400 cursor-pointer">
                        받은 요청 {post.requestCount}개
                        <svg
                          className="w-3 h-3 ml-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    )}

                    {/* 💡 피그마 시안 맞춤형: "교환 완료된 게시글" & "삭제된 게시글" 둥근 뱃지 */}
                    {isBlind && (
                      <div className="absolute right-0 bottom-0 px-4 h-7 flex items-center justify-center bg-gray-200 rounded-[20px] border-[0.5px] border-neutral-500">
                        <span className="text-neutral-500 text-xs font-light tracking-wide">
                          {post.blindReason === 'DELETED'
                            ? '삭제된 게시글'
                            : '교환 완료된 게시글'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 캡처를 위한 5초 토스트 유지 */}
      {showToast && (
        <div className="fixed bottom-[100px] left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-up">
          <div className="bg-[#3b82f6] text-white text-sm font-medium px-16 py-3 rounded-full shadow-md whitespace-nowrap">
            찜 목록에서 삭제되었습니다.
          </div>
        </div>
      )}
    </div>
  );
};

export default LikeListPage;

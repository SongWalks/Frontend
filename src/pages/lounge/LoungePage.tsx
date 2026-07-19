import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { FAB } from '@/components/common/FAB';
import { Tabs } from '@/components/common/Tabs';
import { EmptyState } from '@/components/common/EmptyState';
import { Badge } from '@/components/common/Badge';
import Header from '@/components/layout/Header';
import { Input } from '@/components/common/Input';
import { CourseCard } from '@/components/common/CourseCard';
import { FilterChip } from '@/components/common/FilterChip';
import { useLounge } from './useLounge';
import { ICONS } from '@/constants/icons';
import { IconButton } from '@/components/common/IconButton';

export const LoungePage = () => {
  const navigate = useNavigate();

  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedType,
    selectedCourses,
    hasActiveFilters,
    filteredPosts,
    handleResetFilters,
    handleRemoveCourse,
    handleToggleType,
  } = useLounge();

  return (
    <div className="absolute top-0 left-0 w-full h-full flex flex-col overflow-hidden">
      {/* 1. 상단 헤더 영역 */}
      <div className="shrink-0 w-full z-20">
        <div className="[&>header]:!border-none">
          <Header
            title="라운지"
            rightNode={
              <IconButton
                icon={ICONS.BELL}
                onClick={() => {}}
                className="text-gray-800"
              />
            }
          />
        </div>
      </div>

      {/* 2. 상단 TABS 영역 */}
      <div className="px-4 shrink-0 z-20 border-b border-gray-100">
        <Tabs
          variant="line"
          activeTabId={activeTab}
          onTabChange={setActiveTab}
          tabs={[
            { id: 'target', label: '내 타겟 과목' },
            { id: 'drop', label: '내 버릴 과목' },
          ]}
        />
      </div>

      {/* 3. 콘텐츠 영역 (스크롤) */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative pb-24">
        {/* 일반 라운지 모드 컨트롤 */}
        <div className="px-4 py-4 space-y-3">
          <Input
            variant="pill"
            placeholder="검색어를 입력해주세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            rightNode={
              <Icon icon={ICONS.SEARCH} className="text-[20px] text-gray-400" />
            }
          />
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="shrink-0 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Icon icon="ph:arrow-counter-clockwise" className="text-xl" />
              </button>
            )}
            <FilterChip
              label="강의꿀팁"
              isActive={selectedType === '강의꿀팁'}
              onClick={() => handleToggleType('강의꿀팁')}
            />
            <FilterChip
              label="폐강과목"
              isActive={selectedType === '폐강과목'}
              onClick={() => handleToggleType('폐강과목')}
            />
            {selectedCourses.map((course) => (
              <FilterChip
                key={course}
                label={course}
                isActive={true}
                hasClose
                onClose={() => handleRemoveCourse(course)}
              />
            ))}
            {/* 💡 필터 페이지로 이동 */}
            <button
              onClick={() => navigate('/lounge/filter')}
              className="bg-brand-bg shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full border border-brand-lightBlue text-brand-lightBlue text-[14px] whitespace-nowrap"
            >
              과목 필터
              <Icon icon="ph:caret-down" className="text-[14px]" />
            </button>
          </div>
        </div>

        {/* 게시글 리스트 영역 */}
        <div className="px-4 py-4 space-y-3">
          {filteredPosts.length === 0 ? (
            <EmptyState title="검색 결과가 없습니다" />
          ) : (
            filteredPosts.map((post) => (
              <CourseCard
                key={post.id}
                onClick={() => navigate(`/post/${post.id}`)}
                title={
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-900 text-[16px]">
                      {post.title}
                    </span>
                    <span className="font-normal text-[14px] text-gray-500 line-clamp-2">
                      {post.content}
                    </span>
                  </div>
                }
                rightNode={
                  <div className="flex flex-col items-end gap-3 text-gray-500 text-[13px] h-full justify-between pt-1">
                    <div className="flex items-center gap-1 text-[12px] whitespace-nowrap text-gray-400">
                      <Icon icon="ph:clock-fill" className="text-[14px]" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex gap-2.5 text-gray-400">
                      <div className="flex items-center gap-0.5">
                        <Icon icon="ph:heart" className="text-[16px]" />
                        <span>{post.likes}</span>
                      </div>
                      <Icon icon="ph:bookmark-simple" className="text-[16px]" />
                      <div className="flex items-center gap-0.5">
                        <Icon icon="ph:chat-circle" className="text-[16px]" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </div>
                }
                badges={
                  <>
                    {post.postType === '강의꿀팁' && (
                      <Badge variant="primary">강의꿀팁</Badge>
                    )}
                    {post.badgeType === '교양필수' && (
                      <Badge variant="lightYellow">교양필수</Badge>
                    )}
                    <Badge variant="secondary">{post.courseTag}</Badge>
                  </>
                }
                className="shadow-sm"
              />
            ))
          )}
        </div>
      </div>

      {/* FAB 버튼 */}
      <FAB icon={ICONS.PLUS} onClick={() => navigate('/lounge/write')} />
    </div>
  );
};

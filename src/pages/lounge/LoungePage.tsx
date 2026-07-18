import { useState } from 'react';
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
import { Dropdown } from '@/components/common/Dropdown';
import { useLounge } from './useLounge';
import { ICONS } from '@/constants/icons';
import { IconButton } from '@/components/common/IconButton';

const COLLEGE_OPTIONS = [
  { value: 'software', label: '소프트웨어융합대학' },
  { value: 'engineering', label: '공과대학' },
];

const MAJOR_OPTIONS: Record<string, { value: string; label: string }[]> = {
  software: [
    { value: '데이터베이스', label: '데이터베이스' },
    { value: '운영체제', label: '운영체제' },
    { value: '소프트웨어융합전공', label: '소프트웨어융합전공' },
  ],
  engineering: [{ value: '기계공학', label: '기계공학' }],
};

export const LoungePage = () => {
  // 💡 navigate 함수 초기화
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
    handleAddCourse,
    isFilterModalOpen,
    setIsFilterModalOpen,
  } = useLounge();

  // 필터 박스 내부 상태
  const [college, setCollege] = useState('');
  const [major, setMajor] = useState('');

  // 적용하기 버튼 클릭 핸들러
  const handleApplyFilter = () => {
    if (major) {
      handleAddCourse(major);
      setIsFilterModalOpen(false); // 필터 칩에 추가 후 일반 모드로 돌아감
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full flex flex-col bg-[#FBFBFB] overflow-hidden">
      {/* 1. 상단 헤더 영역 */}
      <div className="shrink-0 w-full z-20">
        {isFilterModalOpen ? (
          /* ⭕ 필터 모드: 커스텀 헤더 (뒤로가기 + 넓은 검색창) */
          <div className="flex items-center px-4 h-[60px] gap-2 bg-[#FBFBFB]">
            <IconButton
              icon={ICONS.BACK}
              onClick={() => setIsFilterModalOpen(false)}
              className="-ml-2"
            />
            <div className="flex-1">
              <Input
                variant="pill"
                placeholder="검색어를 입력해주세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                rightNode={
                  <Icon
                    icon={ICONS.SEARCH}
                    className="text-[20px] text-gray-400"
                  />
                }
              />
            </div>
          </div>
        ) : (
          /* ❌ 일반 모드: 기본 헤더 */
          <div className="[&>header]:!border-none">
            <Header
              leftNode={
                <IconButton
                  icon={ICONS.BACK}
                  onClick={() => window.history.back()}
                />
              }
              title="라운지"
              rightNode={<IconButton icon={ICONS.BELL} onClick={() => {}} />}
            />
          </div>
        )}
      </div>

      {/* 2. 상단 TABS 영역 */}
      <div className="px-4 shrink-0 bg-[#FBFBFB] z-20">
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

      {/* 3. 콘텐츠 영역 (스크롤 가능) */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-24 relative">
        {/* 상단 컨트롤 (필터박스 OR 일반 검색/칩) */}
        <div className="px-4 py-3 shrink-0 z-10">
          {isFilterModalOpen ? (
            /* ⭕ 필터 모드: 위아래 배치된 필터 폼 박스 */
            <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* 단과대 드롭다운 */}
              <div className="space-y-1.5">
                <label className="block text-[14px] font-bold text-gray-900">
                  단과대
                </label>
                <Dropdown
                  options={COLLEGE_OPTIONS}
                  value={college}
                  onChange={(val) => {
                    setCollege(val);
                    setMajor(''); // 단과대 변경 시 전공 초기화
                  }}
                  placeholder="단과대 선택"
                />
              </div>

              {/* 전공 드롭다운 */}
              <div className="space-y-1.5">
                <label className="block text-[14px] font-bold text-gray-900">
                  전공
                </label>
                <Dropdown
                  options={college ? MAJOR_OPTIONS[college] : []}
                  value={major}
                  onChange={setMajor}
                  placeholder="전공 선택"
                />
              </div>

              {/* 적용하기 버튼 */}
              <button
                onClick={handleApplyFilter}
                disabled={!major}
                className={`w-full py-3.5 rounded-xl font-bold text-[15px] transition-colors mt-2 ${
                  major
                    ? 'bg-brand-lightBlue text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                적용하기
              </button>
            </div>
          ) : (
            /* ❌ 일반 모드: 검색창 + 가로 스크롤 필터 칩 */
            <div className="space-y-3">
              <Input
                variant="pill"
                placeholder="검색어를 입력해주세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                rightNode={
                  <Icon
                    icon={ICONS.SEARCH}
                    className="text-[20px] text-gray-400"
                  />
                }
              />
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="shrink-0 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Icon
                      icon="ph:arrow-counter-clockwise"
                      className="text-xl"
                    />
                  </button>
                )}
                <FilterChip
                  label="강의꿀팁"
                  isActive={selectedType === '강의꿀팁'}
                  onClick={() => handleToggleType('강의꿀팁')}
                />
                <FilterChip
                  label="폐강 과목"
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
                <button
                  onClick={() => setIsFilterModalOpen(true)}
                  className="bg-[#F3F7FC] shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full border border-brand-lightBlue text-brand-lightBlue text-[14px] whitespace-nowrap"
                >
                  과목 필터
                  <Icon icon="ph:caret-down" className="text-[14px]" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 게시글 목록 */}
        <div className="px-4 pb-6 space-y-3">
          {filteredPosts.length === 0 ? (
            <EmptyState title="검색 결과가 없습니다" />
          ) : (
            filteredPosts.map((post) => (
              <CourseCard
                key={post.id}

                // TODO: [API 연동] 현재는 mockdata의 id를 사용하여 라우팅하고 있습니다.
                // 실제 백엔드 연동 시, 올바른 상세 페이지 경로와 실제 게시글 ID로 수정해야 합니다.
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
                    <div className="flex items-center gap-1 text-[12px] whitespace-nowrap text-gray-500">
                      <Icon icon="ph:clock-fill" className="text-[14px]" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex gap-2.5">
                      <div className="flex items-center gap-0.5">
                        <Icon icon="ph:heart" className="text-[16px]" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Icon icon="ph:chat-circle" className="text-[16px]" />
                        <span>{post.comments}</span>
                      </div>
                      <Icon icon="ph:bookmark-simple" className="text-[16px]" />
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

      {/* FAB 버튼 고정 */}
      <div className="absolute bottom-6 right-4 z-[100]">
        {/* 💡 onClick 이벤트에 글쓰기 페이지로 이동하는 navigate 추가 */}
        <FAB icon={ICONS.PLUS} onClick={() => navigate('/lounge/write')} />
      </div>
    </div>
  );
};

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { FAB } from '@/components/common/FAB';
import { Tabs } from '@/components/common/Tabs';
import { EmptyState } from '@/components/common/EmptyState';
import { Badge } from '@/components/common/Badge';
import Header from '@/components/layout/Header';
import { Input } from '@/components/common/Input';
import { ICONS } from '@/constants/icons';

// --- 모의 데이터 ---
const MOCK_POSTS = [
  {
    id: '1',
    title: '데이터베이스 001분반 증원',
    content: '증원된 거 확인하세요',
    postType: '강의꿀팁',
    courseTag: '데이터베이스',
    date: '6/29 19:37',
    likes: 12,
    comments: 2,
    isBookmarked: false,
  },
  {
    id: '2',
    title: '운영체제 2분반 폐강위기',
    content: '현재 수강 인원 7명 3명만 더',
    postType: '폐강과목',
    badgeType: '교양필수',
    courseTag: '운영체제',
    date: '6/29 19:37',
    likes: 12,
    comments: 2,
    isBookmarked: false,
  },
];

export const LoungePage = () => {
  const [activeTab, setActiveTab] = useState('target');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const hasActiveFilters = selectedType !== null || selectedCourses.length > 0;

  const handleResetFilters = () => {
    setSelectedType(null);
    setSelectedCourses([]);
  };

  const handleRemoveCourse = (courseToRemove: string) => {
    setSelectedCourses((prev) => prev.filter((c) => c !== courseToRemove));
  };

  const handleToggleType = (type: string) => {
    setSelectedType((prev) => (prev === type ? null : type));
  };

  const filteredPosts = MOCK_POSTS.filter((post) => {
    const matchSearch =
      post.title.includes(searchQuery) || post.content.includes(searchQuery);
    const matchType = selectedType ? post.postType === selectedType : true;
    const matchCourse =
      selectedCourses.length > 0
        ? selectedCourses.includes(post.courseTag)
        : true;
    return matchSearch && matchType && matchCourse;
  });

  return (
    // 💡 1. h-[100dvh] 대신 부모 컨테이너(모바일 화면 틀)에 완벽히 고정!
    <div className="absolute top-0 left-0 w-full h-full flex flex-col bg-white overflow-hidden">
      {/* 💡 2. Header가 찌그러지지 않도록 shrink-0 래퍼로 한 번 더 감싸줍니다 */}
      <div className="shrink-0 w-full z-20">
        <Header
          leftNode={
            <button className="p-1 -ml-2 text-gray-800">
              <Icon icon="ph:caret-left" className="text-[24px]" />
            </button>
          }
          title="라운지"
          rightNode={
            <button className="p-1 text-gray-800">
              <Icon icon="ph:bell" className="text-[24px]" />
            </button>
          }
        />
      </div>

      {/* 상단 탭 */}
      <div className="px-4 shrink-0 bg-white z-20">
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

      {/* 내부 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-24 min-h-0 relative">
        <div className="px-4 py-4 space-y-3 sticky top-0 bg-white z-10">
          <Input
            variant="pill"
            placeholder="검색어를 입력해주세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            rightNode={
              <Icon
                icon="ph:magnifying-glass"
                className="text-[20px] text-gray-400"
              />
            }
          />

          {/* 필터 칩 목록 */}
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
              onClick={() => {
                if (!selectedCourses.includes('데이터베이스')) {
                  setSelectedCourses([...selectedCourses, '데이터베이스']);
                }
              }}
              className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full border border-brand-lightBlue text-brand-lightBlue text-[14px] bg-white whitespace-nowrap"
            >
              과목 필터
              <Icon icon="ph:caret-down" className="text-[14px]" />
            </button>
          </div>
        </div>

        {/* 게시글 목록 영역 */}
        <div className="px-4 pb-6 space-y-3">
          {filteredPosts.length === 0 ? (
            <EmptyState
              icon={<Icon icon="ph:warning" />}
              title="검색 결과가 없습니다"
              className="mt-20"
            />
          ) : (
            filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </div>

      {/* 💡 3. FAB 고정 (이제 전체 창이 스크롤되지 않으므로 absolute로 놔두면 제자리에 예쁘게 붙어있습니다) */}
      <div className="absolute bottom-6 right-4 z-[100]">
        <FAB
          icon="ph:plus-bold"
          onClick={() => {
            console.log('글쓰기 페이지로 이동');
          }}
        />
      </div>
    </div>
  );
};

// --- 하위 컴포넌트 유지 ---
interface FilterChipProps {
  label: string;
  isActive?: boolean;
  hasClose?: boolean;
  onClick?: () => void;
  onClose?: () => void;
}

const FilterChip = ({
  label,
  isActive,
  hasClose,
  onClick,
  onClose,
}: FilterChipProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-[14px] whitespace-nowrap transition-colors
        ${
          isActive
            ? 'bg-brand-lightBlue text-white border border-brand-lightBlue'
            : 'bg-white text-brand-lightBlue border border-brand-lightBlue'
        }
      `}
    >
      {label}
      {hasClose && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
          className="ml-0.5 p-0.5 -mr-1 rounded-full hover:bg-white/20"
        >
          <Icon icon="ph:x" className="text-[12px]" />
        </span>
      )}
    </button>
  );
};

interface PostCardProps {
  post: any;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm active:bg-gray-50 transition-colors cursor-pointer">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-[16px] font-bold text-gray-900 leading-tight pr-4">
          {post.title}
        </h3>
        <span className="text-[12px] text-gray-400 whitespace-nowrap shrink-0 mt-0.5">
          {post.date}
        </span>
      </div>

      <p className="text-[14px] text-gray-500 mb-4 line-clamp-2">
        {post.content}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {post.postType === '강의꿀팁' && (
            <Badge variant="primary">강의꿀팁</Badge>
          )}
          {post.badgeType === '교양필수' && (
            <Badge variant="lightYellow">교양필수</Badge>
          )}
          <Badge variant="secondary">{post.courseTag}</Badge>
        </div>

        <div className="flex items-center gap-3 text-gray-400 text-[13px]">
          <div className="flex items-center gap-1">
            <Icon icon="ph:heart" className="text-[16px]" />
            <span>{post.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon icon="ph:bookmark-simple" className="text-[16px]" />
          </div>
          <div className="flex items-center gap-1">
            <Icon icon="ph:chat-circle" className="text-[16px]" />
            <span>{post.comments}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

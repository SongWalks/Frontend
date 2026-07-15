import { useState } from 'react';

// 모의 데이터 (필요 시 따로 mock폴더 등으로 옮겨도 좋습니다)
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

export const useLounge = () => {
  const [activeTab, setActiveTab] = useState('target');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

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

  const handleAddCourse = (course: string) => {
    if (!selectedCourses.includes(course)) {
      setSelectedCourses((prev) => [...prev, course]);
    }
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

  return {
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
  };
};

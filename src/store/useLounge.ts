import { create } from 'zustand';

// 모의 데이터
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

// 1. Zustand 스토어 타입 정의
interface LoungeState {
  activeTab: string;
  searchQuery: string;
  selectedType: string | null;
  selectedCourses: string[];
  isFilterModalOpen: boolean;

  setActiveTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedType: (type: string | null) => void;
  setSelectedCourses: (courses: string[]) => void;
  setIsFilterModalOpen: (isOpen: boolean) => void;

  handleResetFilters: () => void;
  handleRemoveCourse: (course: string) => void;
  handleToggleType: (type: string) => void;
  handleAddCourse: (course: string) => void;
}

// 2. Zustand 스토어 생성
const useLoungeStore = create<LoungeState>((set) => ({
  activeTab: 'target',
  searchQuery: '',
  selectedType: null,
  selectedCourses: [],
  isFilterModalOpen: false,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedType: (type) => set({ selectedType: type }),
  setSelectedCourses: (courses) => set({ selectedCourses: courses }),
  setIsFilterModalOpen: (isOpen) => set({ isFilterModalOpen: isOpen }),

  handleResetFilters: () => set({ selectedType: null, selectedCourses: [] }),

  handleRemoveCourse: (courseToRemove) =>
    set((state) => ({
      selectedCourses: state.selectedCourses.filter(
        (c) => c !== courseToRemove,
      ),
    })),

  handleToggleType: (type) =>
    set((state) => ({
      selectedType: state.selectedType === type ? null : type,
    })),

  handleAddCourse: (course) =>
    set((state) => ({
      selectedCourses: state.selectedCourses.includes(course)
        ? state.selectedCourses
        : [...state.selectedCourses, course],
    })),
}));

// 3. 기존 UI와 호환을 위한 Custom Hook
// 컴포넌트들에서 이 훅을 그대로 호출하여 사용하므로 기존 코드 수정 불필요
export const useLounge = () => {
  const store = useLoungeStore();

  const hasActiveFilters =
    store.selectedType !== null || store.selectedCourses.length > 0;

  const filteredPosts = MOCK_POSTS.filter((post) => {
    const matchSearch =
      post.title.includes(store.searchQuery) ||
      post.content.includes(store.searchQuery);
    const matchType = store.selectedType
      ? post.postType === store.selectedType
      : true;
    const matchCourse =
      store.selectedCourses.length > 0
        ? store.selectedCourses.includes(post.courseTag)
        : true;
    return matchSearch && matchType && matchCourse;
  });

  return {
    ...store,
    hasActiveFilters,
    filteredPosts,
  };
};

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Tabs } from '@/components/common/Tabs';
import { Badge } from '@/components/common/Badge';
import { Input } from '@/components/common/Input';
import { CourseCard } from '@/components/common/CourseCard';
import { Dropdown } from '@/components/common/Dropdown';
import { useLounge } from './useLounge';
import { ICONS } from '@/constants/icons';
import { IconButton } from '@/components/common/IconButton';

const TYPE_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'major', label: '대면' },
  { value: 'ge', label: '비대면' },
];

const DEPT_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'cs', label: '컴퓨터과학' },
  { value: 'software', label: '소프트웨어융합전공' },
];

const MOCK_COURSES = [
  {
    id: 1,
    title: '데이터베이스 001분반',
    professor: 'John Smith',
    time: '화목 10:30-11:45',
    badges: [{ label: '교양필수', variant: 'lightYellow' }],
  },
  {
    id: 2,
    title: '컴퓨터 구조',
    professor: 'John Smith',
    time: '화목 10:30-11:45',
    badges: [
      { label: '전공필수', variant: 'primary' },
      { label: '컴퓨터공학', variant: 'secondary' },
    ],
  },
  {
    id: 3,
    title: '영어회화',
    professor: 'John Smith',
    time: '화목 10:30-11:45',
    badges: [
      { label: '전공필수', variant: 'primary' },
      { label: '컴퓨터공학', variant: 'secondary' },
    ],
  },
];

export const LoungeFilterPage = () => {
  const navigate = useNavigate();
  const { activeTab, setActiveTab, searchQuery, setSearchQuery } = useLounge();

  const [lectureType, setLectureType] = useState('all');
  const [department, setDepartment] = useState('all');

  return (
    <div className="absolute top-0 left-0 w-full h-full flex flex-col overflow-hidden bg-white">
      {/* 1. 검색창 헤더 */}
      <div className="shrink-0 w-full z-20">
        <div className="flex items-center px-4 h-[60px] gap-2">
          <IconButton
            icon={ICONS.BACK}
            onClick={() => navigate(-1)}
            className="-ml-2 text-gray-500"
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

      {/* 3. 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative pb-[80px]">
        {/* 필터 컨트롤 박스 */}
        <div className="px-4 py-5 border-b border-gray-100">
          <button
            onClick={() => navigate(-1)}
            className="text-brand-lightBlue text-bold-16 mb-3 transition-colors hover:text-blue-600"
          >
            필터 닫기
          </button>
          <div className="p-4 bg-brand-bg border border-brand-lightBlue rounded-xl shadow-sm space-y-4 animate-in fade-in duration-200">
            <div className="space-y-2">
              <label className="block text-medium-12 text-gray-800">
                강의 종류
              </label>
              <Dropdown
                options={TYPE_OPTIONS}
                value={lectureType}
                onChange={setLectureType}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-medium-12 text-gray-800">
                학과/영역
              </label>
              <Dropdown
                options={DEPT_OPTIONS}
                value={department}
                onChange={setDepartment}
              />
            </div>
          </div>
        </div>

        {/* 임시 과목 리스트 */}
        <div className="px-4 py-4 space-y-3">
          {MOCK_COURSES.map((course) => (
            <CourseCard
              key={course.id}
              title={course.title}
              professor={course.professor}
              time={course.time}
              badges={
                <>
                  {course.badges.map((badge, idx) => (
                    <Badge key={idx} variant={badge.variant as any}>
                      {badge.label}
                    </Badge>
                  ))}
                </>
              }
              className="shadow-sm"
            />
          ))}
        </div>
      </div>

      {/* 4. 하단 고정 배너 */}
      <div className="absolute bottom-0 left-0 w-full h-[60px] bg-brand-soft flex items-center justify-center z-50">
        <p className="text-brand-navy text-[15px] font-medium tracking-tight">
          졸업 요건에 해당하는 과목이 상단에 표시됩니다
        </p>
      </div>
    </div>
  );
};

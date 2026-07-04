// src/components/common/CourseCard.tsx
import React from 'react';

interface CourseCardProps {
  title: string; // 과목명 (예: 영어회화)
  professor?: string; // 교수명 (예: John Smith)
  time?: string; // 시간 (예: 화목 10:30-11:45)
  badges?: React.ReactNode; // 하단 배지 영역
  leftNode?: React.ReactNode; // 좌측 요소 (순위 숫자, + 아이콘 등)
  rightNode?: React.ReactNode; // 우측 요소 (X 삭제 버튼 등)
  className?: string; // 전체 카드 배경색 변경 등 커스텀 용도
}

export const CourseCard = ({
  title,
  professor,
  time,
  badges,
  leftNode,
  rightNode,
  className = '',
}: CourseCardProps) => {
  return (
    // 기본적으로 회색 테두리의 둥근 박스입니다.
    <div
      className={`flex items-start p-4 bg-white rounded-xl border border-gray-200 ${className}`}
    >
      {/* 1. 좌측 아이콘 영역 (+버튼, 1순위 등) */}
      {leftNode && <div className="mr-3 mt-0.5 shrink-0">{leftNode}</div>}

      {/* 2. 중앙 텍스트 및 배지 영역 (flex-1로 남는 공간 다 차지함) */}
      <div className="flex flex-col flex-1 gap-1.5">
        <h4 className="font-bold text-gray-900 text-[15px]">{title}</h4>

        {/* 교수, 시간 정보가 있을 때만 렌더링 */}
        {(professor || time) && (
          <div className="text-xs text-gray-500 leading-tight">
            {professor && <p>교수 : {professor}</p>}
            {time && <p>시간 : {time}</p>}
          </div>
        )}

        {/* 하단 배지 묶음 영역 */}
        {badges && <div className="flex flex-wrap gap-1.5 mt-1">{badges}</div>}
      </div>

      {/* 3. 우측 아이콘 영역 (X버튼 등) */}
      {rightNode && <div className="ml-3 shrink-0">{rightNode}</div>}
    </div>
  );
};

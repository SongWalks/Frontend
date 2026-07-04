import { Icon } from '@iconify/react';
import { Badge } from '../components/common/Badge';
import { CourseCard } from '../components/common/CourseCard';

export const TestCard = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 gap-8 pb-20">
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold text-gray-900">
          과목 카드 & 배지 테스트 🪪
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          시안의 모든 카드 케이스 완벽 구현
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-[402px]">
        {/* 케이스 A: 찜 목록 (가장 단순한 형태 + 노란색 배지) */}
        <section className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-gray-500 px-2">
            1. 찜 목록 스타일
          </p>
          <CourseCard
            title="운영체제 2분반 폐강위기"
            professor="현재 수강 인원 7명 3명만 더" // 재사용의 묘미!
            badges={
              <>
                <Badge variant="lightYellow">교양필수</Badge>
                <Badge variant="secondary">운영체제</Badge>
              </>
            }
          />
        </section>

        {/* 케이스 B: 글쓰기 - 원하는 과목 선택 (+ 아이콘) */}
        <section className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-gray-500 px-2">
            2. 원하는 과목 선택 (+ 아이콘)
          </p>
          <CourseCard
            className="bg-gray-50/50" // 배경을 살짝 어둡게
            title="컴퓨터구조"
            professor="John Smith"
            time="화목 10:30-11:45"
            leftNode={
              <div className="w-6 h-6 rounded-full bg-blue-100 text-brand-blue flex items-center justify-center font-bold text-sm">
                +
              </div>
            }
            badges={
              <>
                <Badge variant="lightBlue">컴퓨터 과학</Badge>
                <Badge variant="lightBlue">전공필수</Badge>
              </>
            }
          />
        </section>

        {/* 케이스 C: 글쓰기 - 선택된 과목 삭제 (X 아이콘 + 우측 정렬 배지) */}
        <section className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-gray-500 px-2">
            3. 교환글 작성 (X 삭제 버튼)
          </p>
          <CourseCard
            title="영어회화"
            professor="John Smith"
            time="화목 10:30-11:45"
            rightNode={<Icon icon="ph:x" className="text-lg text-gray-400" />}
            badges={
              <div className="flex justify-end w-full">
                {' '}
                {/* 배지만 우측으로 밀기 */}
                <Badge variant="outlineGray">컴퓨터 과학</Badge>
                <Badge variant="outlineGray" className="ml-1">
                  전공필수
                </Badge>
              </div>
            }
          />
        </section>

        {/* 케이스 D: 게시글 상세 - 요청받은 내 게시글 (파란 테두리 배지) */}
        <section className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-gray-500 px-2">
            4. 상세 - 요청받은 게시글 (파란 테두리)
          </p>
          <CourseCard
            className="border-brand-blue/30 shadow-sm" // 강조용 테두리
            title="운영체제"
            professor="John Smith"
            time="화목 10:30-11:45"
            badges={
              <>
                <Badge variant="outlineBlue">전공필수</Badge>
                <Badge variant="outlineBlue">컴퓨터과학</Badge>
              </>
            }
          />
        </section>
      </div>
    </div>
  );
};

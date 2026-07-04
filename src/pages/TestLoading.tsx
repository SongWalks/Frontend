import { Spinner } from '../components/common/Spinner';
import { Skeleton } from '../components/common/Skeleton';

export const TestLoading = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 gap-8 pb-20">
      <div className="text-center mt-6">
        <h1 className="text-2xl font-bold text-gray-900">로딩 UI 테스트 ⏳</h1>
      </div>

      <div className="w-full max-w-[402px] flex flex-col gap-10">
        {/* =========================================
            💡 1. Spinner 테스트
        ========================================= */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col gap-6">
          <h2 className="text-sm font-bold text-gray-700 border-b pb-2">
            1. 스피너 (Spinner)
          </h2>
          <div className="flex items-center justify-around">
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </div>
        </section>

        {/* =========================================
            💡 2. Skeleton 테스트 (게시글 목록 흉내내기)
        ========================================= */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col gap-6">
          <h2 className="text-sm font-bold text-gray-700 border-b pb-2">
            2. 스켈레톤 (Skeleton)
          </h2>
          <p className="text-xs text-gray-500 mb-2">
            데이터를 불러오는 중입니다...
          </p>

          <div className="flex flex-col gap-4">
            {/* 가짜 게시글 1 */}
            <div className="flex items-center gap-3">
              {/* 프로필 이미지 스켈레톤 (원형) */}
              <Skeleton className="w-12 h-12 rounded-full shrink-0" />
              <div className="flex flex-col gap-2 w-full">
                {/* 제목 스켈레톤 */}
                <Skeleton className="w-3/4 h-4" />
                {/* 내용/시간 스켈레톤 */}
                <Skeleton className="w-1/2 h-3" />
              </div>
            </div>

            {/* 가짜 게시글 2 */}
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full shrink-0" />
              <div className="flex flex-col gap-2 w-full">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-2/3 h-3" />
              </div>
            </div>

            {/* 가짜 게시글 3 */}
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full shrink-0" />
              <div className="flex flex-col gap-2 w-full">
                <Skeleton className="w-5/6 h-4" />
                <Skeleton className="w-1/3 h-3" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

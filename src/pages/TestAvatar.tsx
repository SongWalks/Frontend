import { Avatar } from '../components/common/Avatar';

export const TestAvatar = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 gap-8">
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold text-gray-900">
          아바타 컴포넌트 테스트 👤
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          사이즈별 기본 상태와 이미지 적용 상태
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-[402px]">
        {/* 1. 사이즈별 기본 아바타 (이미지 없음) */}
        <section className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-2 border-b pb-2">
            1. 기본 프로필 (사이즈별)
          </h2>
          <div className="flex items-end justify-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <Avatar size="sm" />
              <span className="text-xs text-gray-500">sm (댓글용)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar size="md" />
              <span className="text-xs text-gray-500">md (기본용)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar size="lg" />
              <span className="text-xs text-gray-500">lg (마이페이지)</span>
            </div>
          </div>
        </section>

        {/* 2. 이미지가 들어온 경우 */}
        <section className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-2 border-b pb-2">
            2. 사진이 있을 경우 (src 전달)
          </h2>
          <div className="flex items-end justify-center gap-6">
            {/* 임시로 더미 이미지 URL을 넣어두었습니다 */}
            <Avatar
              size="sm"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
            />
            <Avatar
              size="md"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
            />
            <Avatar
              size="lg"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
            />
          </div>
        </section>

        {/* 3. 실제 시안 적용 예시 (게시글 상세 작성자 정보) */}
        <section className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-2 border-b pb-2">
            3. 실제 시안 흉내내기
          </h2>

          <div className="flex items-center gap-3 py-2">
            <Avatar size="md" />
            <div className="flex flex-col">
              <span className="font-bold text-gray-900">너송</span>
              <span className="text-xs text-gray-500">받은 요청 3개</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

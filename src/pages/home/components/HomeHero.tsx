import Button from '@/components/common/Button';

interface HomeHeroProps {
  state: 'empty' | 'active' | 'alert';
  userName?: string;
}

export const HomeHero = ({ state, userName = '송이' }: HomeHeroProps) => {
  return (
    <section className="relative w-full pt-4 pb-6 flex flex-col">
      {/* 마스코트 — 우측 상단 고정, 텍스트 위에 겹치게 */}
      <div
        className="absolute right-[-8px] top-[-8px]
        w-[160px] h-[170px] pointer-events-none z-10"
      >
        <img
          src="/src/assets/images/noonsong.png"
          alt="수강구조대 마스코트"
          className="w-full h-full object-contain drop-shadow-md"
        />
      </div>

      {/* 텍스트 영역 — 마스코트랑 안 겹치게 우측 패딩 */}
      <div
        className={`flex flex-col justify-center min-h-[140px]
        z-10 pr-[150px] ${state === 'empty' ? 'pt-16' : 'pt-0'}`}
      >
        {/* empty */}
        {state === 'empty' && (
          <>
            <h1 className="text-point-1 text-brand-navy">수강구조대</h1>
            <p className="text-medium-15 text-gray-700 mt-4">
              눈송이들의 안전한
              <br />
              수강 교환을 도와드립니다
            </p>
          </>
        )}

        {/* active */}
        {state === 'active' && (
          <>
            <span
              className="inline-block px-3 py-0.5 border border-brand-lightBlue
              text-brand-lightBlue rounded-full text-[11px] font-bold w-fit mb-2
              bg-white/60"
            >
              D-2
            </span>
            <h1 className="text-point-1 !leading-[32px] font-bold">
              <span className="text-brand-navy">안녕하세요,</span>
              <br />
              <span className="text-brand-blue">{userName}님!</span>
            </h1>
            <p className="text-gray-700 mt-2 text-medium-15 leading-relaxed">
              원하는 강의를 찾고
              <br />
              안전하게 교환해보세요
            </p>
          </>
        )}

        {/* alert */}
        {state === 'alert' && (
          <>
            <span
              className="inline-block px-3 py-0.5 border border-brand-lightBlue
              text-brand-lightBlue rounded-full text-[11px] font-bold w-fit mb-2
              bg-white/60"
            >
              D-2
            </span>
            <h1 className="text-point-1 text-brand-navy leading-none">
              2:00 AM
            </h1>
            <p className="text-gray-700 mt-3 text-medium-15 leading-relaxed">
              내일{' '}
              <strong className="text-[#0467A7]">마케팅과소비자이슈</strong>
              <br />
              교환이 있는 날이에요
            </p>
          </>
        )}
      </div>

      {/* 메인 액션 버튼 */}
      <Button
        variant="light"
        size="lg"
        className="mt-5 backdrop-blur-sm border border-[#A8D4EF]/50"
      >
        {state === 'empty' ? '교환 게시글 둘러보기' : '교환채팅방 입장하기'}
      </Button>
    </section>
  );
};

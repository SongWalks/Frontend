import { HomeHeader } from '@/pages/home/components/HomeHeader';
import { HomeHero } from '@/pages/home/components/HomeHero';
import { ReceivedRequestCard } from '@/pages/home/components/ReceivedRequestCard';
import { RecommendMatchItem } from '@/pages/home/components/RecommendMatchItem';

import sooWatermark from '@/assets/images/soo-watermark.png';

const HOME_STATE: 'empty' | 'active' | 'alert' = 'active';

export default function HomePage() {
  // 가짜(Mock) 데이터
  const receivedRequests =
    HOME_STATE === 'empty'
      ? []
      : [
          {
            id: 1,
            subject: '마케팅과 소비자 이슈',
            targetSubject: '프로그래밍언어론',
            time: '27m 32s',
            isUrgent: false,
          },
          {
            id: 2,
            subject: '마케팅과 소비자 이슈',
            targetSubject: '프로그래밍언어론',
            time: '15m 21s',
            isUrgent: true,
          },
        ];

  const recommendedMatches =
    HOME_STATE === 'empty'
      ? []
      : [
          {
            id: 1,
            subject: '마케팅과 소비자이슈',
            targetSubject: '프로그래밍언어론',
            time: '30m',
          },
          {
            id: 2,
            subject: '마케팅과 소비자이슈',
            targetSubject: '프로그래밍언어론',
            time: '30m',
          },
          {
            id: 3,
            subject: '마케팅과 소비자이슈',
            targetSubject: '프로그래밍언어론',
            time: '30m',
          },
        ];

  return (
    <div className="relative min-h-full pb-10 flex flex-col bg-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full min-h-full pointer-events-none z-0 overflow-hidden">
        {/* [Layer 1] 피그마 바탕 방사형 그라데이션 */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 240% 100% at 0% 100%, rgba(125,211,252,0.35) 0%, rgba(186,230,253,0.15) 50%, transparent 75%)',
          }}
        />

        {/* [Layer 2] 우측 중앙 푸른빛 회전 원 */}
        <div
          className="absolute w-96 h-96 left-[138.65px] top-[202.75px]
    origin-top-left -rotate-[61.65deg] rounded-full blur-[11px] opacity-70"
          style={{ background: 'linear-gradient(152deg, #E9F2F5, #CAE4FD)' }}
        />
      </div>

      {/* ── 2. SOO 워터마크 이미지 ── */}
      {/* 고정된 배경 레이어 바로 위에 올라타도록 하되, 글씨들보다는 뒤로 가게 z-0 세팅 */}
      <div className="absolute top-[65px] left-[90px] w-96 h-48 pointer-events-none z-0 select-none">
        <img
          src={sooWatermark}
          alt="SOO 워터마크"
          className="w-full h-full object-contain opacity-100"
        />
      </div>

      {/* ── 3. 실제 스크롤되는 본문 콘텐츠 영역 ── */}
      <div className="relative z-10 flex flex-col bg-transparent w-full">
        {/* 헤더 */}
        <HomeHeader />

        {/* 본문 패딩 영역 */}
        <div className="px-5 flex flex-col mt-2">
          <HomeHero state={HOME_STATE} />

          {/* 받은 요청함 */}
          <section className="flex flex-col gap-3 mt-8">
            <h2 className="text-[16px] font-bold text-[#5A9ECC]">
              받은 요청함
            </h2>
            {receivedRequests.length === 0 ? (
              <div
                className="w-full py-14 bg-white/70 rounded-2xl
                border border-[#C5E4F8] flex justify-center items-center shadow-sm"
              >
                <span className="text-gray-400 text-sm font-medium">
                  아직 받은 요청이 없어요!
                </span>
              </div>
            ) : (
              <div
                className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory
                [-ms-overflow-style:none] [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden -mx-5 px-5"
              >
                {receivedRequests.map((req) => (
                  <ReceivedRequestCard key={req.id} {...req} />
                ))}
              </div>
            )}
          </section>

          {/* 추천 매칭 */}
          <section className="flex flex-col gap-3 mt-8">
            <h2 className="text-[16px] font-bold text-[#5A9ECC]">추천 매칭</h2>
            {recommendedMatches.length === 0 ? (
              <div
                className="w-full py-24 bg-white/70 rounded-2xl
                border border-[#C5E4F8] flex justify-center items-center shadow-sm"
              >
                <span className="text-gray-400 text-sm font-medium">
                  게시글을 등록하면 매칭을 추천 받을 수 있어요
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {recommendedMatches.map((match) => (
                  <RecommendMatchItem key={match.id} {...match} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { HomeHeader } from '@/pages/home/components/HomeHeader';
import { HomeHero } from '@/pages/home/components/HomeHero';
import { ReceivedRequestCard } from '@/pages/home/components/ReceivedRequestCard';
import { RecommendMatchItem } from '@/pages/home/components/RecommendMatchItem';

import sooWatermark from '@/assets/images/soo-watermark.png';

const HOME_STATE: 'empty' | 'active' | 'alert' = 'active';

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const sensorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // 센서가 화면 밖으로 나가면(스크롤을 내리면) 블러 효과 ON!
        setIsScrolled(!entry.isIntersecting);
      },
      { threshold: 0 }, // 0으로 설정하면 단 1px만 스크롤돼도 바로 반응합니다.
    );

    if (sensorRef.current) observer.observe(sensorRef.current);
    return () => observer.disconnect();
  }, []);

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
    <div className="relative min-h-full pb-10 flex flex-col bg-white">
      {/* 🚨 핵심: 화면 맨 위(top-0)에 투명한 1px짜리 센서를 붙여둡니다! */}
      <div
        ref={sensorRef}
        className="absolute top-0 left-0 w-full h-[1px] bg-transparent pointer-events-none z-50"
      />

      {/* 배경 레이어 (fixed로 잘 고정해두신 부분!) */}
      <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 240% 100% at 0% 100%, rgba(125,211,252,0.35) 0%, rgba(186,230,253,0.15) 50%, transparent 75%)',
          }}
        />
        <div
          className="absolute w-96 h-96 left-[138.65px] top-[202.75px] origin-top-left -rotate-[61.65deg] rounded-full blur-[11px] opacity-70"
          style={{ background: 'linear-gradient(152deg, #E9F2F5, #CAE4FD)' }}
        />
      </div>

      {/* 워터마크 (고정) */}
      <div className="fixed top-[65px] left-[90px] w-96 h-48 pointer-events-none z-0 select-none">
        <img
          src={sooWatermark}
          alt="SOO 워터마크"
          className="w-full h-full object-contain opacity-100"
        />
      </div>

      {/* 본문 콘텐츠 영역 */}
      <div className="relative z-10 flex flex-col bg-transparent w-full">
        {/* 🚨 여기서 Header에 isScrolled 값을 넘겨줍니다! */}
        <div className="fixed top-0 left-0 w-full z-50">
          <HomeHeader isScrolled={isScrolled} />
        </div>

        {/* 헤더 높이만큼 띄워주는 패딩 */}
        <div className="px-5 flex flex-col pt-[56px] mt-2">
          <HomeHero state={HOME_STATE} />

          {/* 받은 요청함 */}
          <section className="flex flex-col gap-3 mt-8">
            <h2 className="text-[16px] font-bold text-[#5A9ECC]">
              받은 요청함
            </h2>
            {receivedRequests.length === 0 ? (
              <div className="w-full py-14 bg-white/70 rounded-2xl border border-[#C5E4F8] flex justify-center items-center shadow-sm">
                <span className="text-gray-400 text-sm font-medium">
                  아직 받은 요청이 없어요!
                </span>
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-5 px-5">
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
              <div className="w-full py-24 bg-white/70 rounded-2xl border border-[#C5E4F8] flex justify-center items-center shadow-sm">
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

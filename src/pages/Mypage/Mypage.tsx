import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS } from '@/constants/icons'; //

import Header from '@/components/layout/Header';
import { IconButton } from '@/components/common/IconButton';

interface MenuItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  fontSizeClass: string;
  badge?: string | number;
}

const MyPage = () => {
  const navigate = useNavigate();
  const userEmail = 'su*******@sookmyung.ac.kr';
  const [isAlertOn, setIsAlertOn] = useState(false);

  // 1. 교환 활동 섹션
  const exchangeMenus: MenuItem[] = [
    {
      // 💡 내 교환 게시글: 캔버스 여백 확보로 잘림 방지
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          className="text-brand-lightBlue"
        >
          <g clipPath="url(#clip0_784_2356)">
            <rect width="17.2012" height="17.2012" fill="white" />
            <path
              d="M9.76769 16.6637H1.61218C1.32706 16.6637 1.05361 16.5504 0.851991 16.3488C0.650376 16.1472 0.537109 15.8738 0.537109 15.5886V1.61267C0.537109 1.32754 0.650376 1.05409 0.851991 0.852479C1.05361 0.650864 1.32706 0.537598 1.61218 0.537598H15.5881C15.8733 0.537598 16.1467 0.650864 16.3483 0.852479C16.5499 1.05409 16.6632 1.32754 16.6632 1.61267V9.76818C16.6631 10.0531 16.55 10.3264 16.3486 10.5279L10.5274 16.3491C10.3259 16.5505 10.0526 16.6636 9.76769 16.6637Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.2133 16.5669V11.2883C10.2133 11.0032 10.3265 10.7298 10.5281 10.5281C10.7298 10.3265 11.0032 10.2133 11.2883 10.2133H16.5669M4.83789 4.83789H13.4385M4.83789 8.06311H8.60065"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_784_2356">
              <rect width="17.2012" height="17.2012" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
      title: '내 교환 게시글',
      description: '등록한 교환 게시글 관리',
      fontSizeClass: 'text-[15px]',
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="text-brand-lightBlue"
        >
          <path
            d="M13.2127 8.28723C12.8979 7.97232 12.5242 7.72251 12.1128 7.55208C11.7014 7.38164 11.2605 7.29392 10.8152 7.29392C10.3699 7.29392 9.92903 7.38164 9.51766 7.55208C9.10629 7.72251 8.73253 7.97232 8.41772 8.28723L4.99272 11.7132C4.357 12.3491 3.99991 13.2114 4 14.1106C4.00009 15.0097 4.35737 15.872 4.99322 16.5077C5.62908 17.1435 6.49143 17.5006 7.39058 17.5005C8.28972 17.5004 9.152 17.1431 9.78772 16.5072L10.1087 16.2032M9.78772 11.7132C10.1025 12.0281 10.4763 12.278 10.8877 12.4484C11.299 12.6188 11.7399 12.7066 12.1852 12.7066C12.6305 12.7066 13.0714 12.6188 13.4828 12.4484C13.8942 12.278 14.2679 12.0281 14.5827 11.7132L18.0067 8.28723C18.6426 7.65151 18.9999 6.78923 18.9999 5.89009C19 4.99095 18.6429 4.12859 18.0072 3.49273C17.3715 2.85688 16.5092 2.49961 15.6101 2.49951C14.7109 2.49942 13.8486 2.85651 13.2127 3.49224L12.1847 4.45324"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: '교환 추천 매칭함',
      description: '나에게 맞는 교환 게시글 추천',
      fontSizeClass: 'text-[15px]',
      badge: 'new',
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="19"
          viewBox="0 0 16 15"
          fill="none"
          className="text-brand-lightBlue" // 👈 여기서 색 지정
        >
          <mask
            id="mask0_784_2440"
            style={{ maskType: 'luminance' }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="16"
            height="15"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 0H15.3301V14.5641H0V0Z"
              fill="white"
            />
          </mask>
          <g mask="url(#mask0_784_2440)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.64282 12.6543C4.05651 12.6543 4.44667 12.8033 4.85964 12.9612C7.38957 14.0725 10.3817 13.567 12.331 11.7158C14.903 9.27102 14.903 5.29421 12.331 2.8508C11.0857 1.66771 9.42949 1.01654 7.66632 1.01654C5.90243 1.01654 4.24553 1.66839 3.00089 2.85147C1.05084 4.70267 0.520175 7.54518 1.67922 9.92558C1.84612 10.3179 2.00732 10.7001 2.00732 11.0971C2.00732 11.4935 1.86396 11.8926 1.73771 12.245C1.63357 12.535 1.47594 12.9727 1.57723 13.0689C1.67637 13.1665 2.13999 13.0127 2.44598 12.9131C2.8133 12.7938 3.22985 12.657 3.64282 12.6543ZM7.6493 14.5643C6.55944 14.5643 5.46245 14.3454 4.43607 13.8941C4.13365 13.7789 3.85048 13.6705 3.64721 13.6705C3.41326 13.6719 3.09871 13.7749 2.79486 13.8745C2.17147 14.0777 1.39545 14.3312 0.821273 13.7877C0.249239 13.2436 0.513145 12.5084 0.725696 11.9169C0.830545 11.6255 0.938248 11.3247 0.938248 11.097C0.938248 10.91 0.843384 10.6715 0.697879 10.3279C-0.638055 7.58704 -0.0203727 4.28376 2.24565 2.1324C3.69214 0.757553 5.61723 0 7.66642 0C9.71561 0 11.6414 0.756875 13.0879 2.13172C16.0779 4.9722 16.0779 9.59341 13.0879 12.4339C11.6222 13.827 9.64857 14.5643 7.6493 14.5643Z"
              fill="currentColor" // 👈 currentColor로 교체
            />
          </g>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.4817 8.24142C10.088 8.24142 9.76562 7.93854 9.76562 7.56383C9.76562 7.18912 10.0816 6.88623 10.4753 6.88623H10.4817C10.8755 6.88623 11.195 7.18912 11.195 7.56383C11.195 7.93854 10.8755 8.24142 10.4817 8.24142Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.62236 8.24142C7.22864 8.24142 6.90625 7.93854 6.90625 7.56383C6.90625 7.18912 7.22151 6.88623 7.61594 6.88623H7.62236C8.01608 6.88623 8.33562 7.18912 8.33562 7.56383C8.33562 7.93854 8.01608 8.24142 7.62236 8.24142Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.76299 8.24142C4.36927 8.24142 4.04688 7.93854 4.04688 7.56383C4.04688 7.18912 4.36285 6.88623 4.75657 6.88623H4.76299C5.15671 6.88623 5.47625 7.18912 5.47625 7.56383C5.47625 7.93854 5.15671 8.24142 4.76299 8.24142Z"
            fill="currentColor"
          />
        </svg>
      ),

      title: '교환 요청함',
      description: '받은 요청 및 보낸 요청',
      fontSizeClass: 'text-[15px]',
      badge: 3,
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="-1.5 -1.5 19 18"
          fill="none"
          className="text-brand-lightBlue"
        >
          <path
            d="M1.7 1.767a4.25 4.25 0 0 1 6.014 0l.198.216.198-.216a4.25 4.25 0 0 1 6.013 0 4.54 4.54 0 0 1 0 6.336L7.912 13.5 1.7 8.103a4.54 4.54 0 0 1 0-6.336z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: '찜 목록',
      description: '관심 있는 교환 게시글 모아보기',
      fontSizeClass: 'text-[15px]',
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="15"
          viewBox="0 0 18 15"
          fill="none"
          className="text-brand-lightBlue"
        >
          <path
            d="M8.97401 0L0 3.76811L8.97401 8.79212L13.2482 6.39924L9.23852 5.0266C9.15595 5.07093 9.06558 5.09406 8.97401 5.09428C8.81093 5.09428 8.65453 5.02175 8.53922 4.89263C8.42391 4.76352 8.35912 4.5884 8.35912 4.40581C8.35912 4.22321 8.42391 4.0481 8.53922 3.91898C8.65453 3.78987 8.81093 3.71733 8.97401 3.71733L8.87232 4.08747L9.5847 4.33287L9.58501 4.33528L10.6362 4.69523L16.6216 6.75716V7.2798C16.5389 7.34286 16.4711 7.42761 16.4242 7.52667C16.3773 7.62573 16.3527 7.73611 16.3526 7.84822C16.3527 7.96291 16.3784 8.07574 16.4274 8.17648C16.4763 8.27722 16.547 8.36267 16.6329 8.42508C16.353 9.60947 16.3526 12.2967 16.3526 13.356C16.9675 13.8033 16.9675 13.8196 17.5824 13.356C17.5824 12.2968 17.5821 9.61012 17.3022 8.42547C17.3882 8.363 17.4589 8.27748 17.5078 8.17666C17.5567 8.07584 17.5824 7.96292 17.5824 7.84818C17.5824 7.73595 17.5579 7.62542 17.511 7.52622C17.4641 7.42702 17.3963 7.34216 17.3134 7.27903V6.18521L15.0335 5.39979L17.948 3.76811L8.97401 0ZM3.733 6.8585L3.22868 10.2467C4.23459 10.3939 5.43788 11.0486 6.54406 11.8227C7.17317 12.263 7.76242 12.7462 8.24099 13.2151C8.53352 13.5017 8.77813 13.7767 8.97401 14.0472C9.16989 13.7766 9.4145 13.5017 9.70703 13.2151C10.1856 12.7462 10.7748 12.263 11.404 11.8227C12.5101 11.0486 13.7134 10.3939 14.7193 10.2467L14.2149 6.8585H13.9747L8.97401 9.65814L3.97319 6.8585H3.733Z"
            fill="currentColor"
          />
        </svg>
      ),
      title: '졸업요건 과목 등록',
      description: '졸업에 필요한 과목 등록 및 관리',
      fontSizeClass: 'text-[16px]',
    },
  ];

  // 2. 라운지 섹션 메뉴
  const loungeMenus: MenuItem[] = [
    {
      /* 6. 내 라운지 게시글: 도서/게시글 형태의 정밀 미니멀 컴포넌트 */
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-1.5 -1.5 18 18"
          fill="none"
          className="size-5 text-brand-lightBlue"
        >
          <path
            d="M8.453 14.422H1.395A1.13 1.13 0 0 1 .465 13.49V1.396A1.13 1.13 0 0 1 1.395.465h12.096c.52 0 .93.41.93.93v7.058c0 .247-.1.484-.272.658l-5.038 5.038a.93.93 0 0 1-.658.273zm.387-.084V9.77c0-.513.41-.93.93-.93h4.568M4.188 4.187h7.443M4.188 6.978h3.256"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: '내 라운지 게시글',
      description: '등록한 라운지 게시글 관리',
      fontSizeClass: 'text-[16px]',
    },
    {
      /* 7. 북마크 목록: 사각형 블록 탈출, 진짜 리본 책갈피 양식 매칭 */
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="11"
          height="16"
          viewBox="0 0 11 16"
          fill="none"
          className="text-brand-lightBlue"
        >
          <path
            d="M2.29855 0H8.42801C9.03763 0 9.62227 0.265221 10.0533 0.737318C10.4844 1.20941 10.7266 1.84971 10.7266 2.51736V15.1042L5.36328 12.5868L0 15.1042V2.51736C0 1.84971 0.242168 1.20941 0.67323 0.737318C1.10429 0.265221 1.68894 0 2.29855 0ZM2.29855 0.83912C1.89214 0.83912 1.50238 1.01593 1.215 1.33067C0.927628 1.6454 0.766183 2.07226 0.766183 2.51736V13.8455L5.36328 11.6973L9.96038 13.8455V2.51736C9.96038 2.07226 9.79893 1.6454 9.51156 1.33067C9.22418 1.01593 8.83442 0.83912 8.42801 0.83912H2.29855Z"
            fill="currentColor"
          />
        </svg>
      ),
      title: '북마크 목록',
      description: '관심있는 라운지 게시글 모아보기',
      fontSizeClass: 'text-[16px]',
    },
  ];

  // 3. 계정 설정 전용 비밀번호 메뉴 사양 (진짜 자물쇠 디자인 주입)
  const passwordMenuIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="text-brand-lightBlue"
    >
      <g clipPath="url(#clip0_784_2430)">
        <path
          d="M13.5822 23.2599L13.5932 23.2579C13.6018 23.2593 13.6075 23.2653 13.6102 23.2759L13.6272 23.7029L13.6232 23.7199L13.6112 23.7359L13.5072 23.8099L13.4952 23.8139L13.4802 23.8099L13.3762 23.7359L13.3662 23.7229L13.3612 23.7029L13.3782 23.2749L13.3822 23.2649C13.3875 23.2583 13.3955 23.2566 13.4062 23.2599L13.4772 23.2949L13.4912 23.2989L13.5112 23.2949L13.5822 23.2599Z"
          fill="currentColor"
        />
        <path
          d="M13.8452 23.1469L13.8582 23.1449C13.8682 23.1476 13.8748 23.1549 13.8782 23.1669L13.9122 23.7809L13.9082 23.7949C13.9015 23.8036 13.8918 23.8063 13.8792 23.8029L13.6782 23.7099L13.6702 23.7029L13.6652 23.6909L13.6472 23.2609L13.6502 23.2499L13.6602 23.2399L13.8452 23.1469Z"
          fill="currentColor"
        />
        <path
          d="M13.1285 23.1445C13.1335 23.1434 13.1388 23.1443 13.1432 23.1469L13.3272 23.2389L13.3372 23.2489L13.3402 23.2609L13.3232 23.6909L13.3192 23.7019L13.3092 23.7099L13.1082 23.8029L13.0932 23.8049C13.0825 23.8009 13.0768 23.7929 13.0762 23.7809L13.1102 23.1669L13.1162 23.1529C13.119 23.1487 13.1234 23.1456 13.1285 23.1445Z"
          fill="currentColor"
        />
        <path
          d="M13 2C14.5524 1.99994 16.0444 2.60157 17.1625 3.67847C18.2806 4.75537 18.9378 6.22371 18.996 7.775L19 8H20C20.5046 7.99984 20.9906 8.19041 21.3605 8.5335C21.7305 8.87659 21.9572 9.34685 21.995 9.85L22 10V20C22.0002 20.5046 21.8096 20.9906 21.4665 21.3605C21.1234 21.7305 20.6532 21.9572 20.15 21.995L20 22H6C5.49542 22.0002 5.00943 21.8096 4.63945 21.4665C4.26947 21.1234 4.04284 20.6532 4.005 20.15L4 20V10C3.99984 9.49542 4.19041 9.00943 4.5335 8.63945C4.87659 8.26947 5.34684 8.04284 5.85 8.005L6 8H7C7 6.4087 7.63214 4.88258 8.75736 3.75736C9.88258 2.63214 11.4087 2 13 2ZM20 10H6V20H20V10ZM13 12C13.4266 12.0001 13.842 12.1367 14.1854 12.3896C14.5289 12.6426 14.7825 12.9988 14.9092 13.4062C15.0358 13.8135 15.0289 14.2507 14.8895 14.6538C14.75 15.057 14.4853 15.405 14.134 15.647L14 15.732V17C13.9997 17.2549 13.9021 17.5 13.7272 17.6854C13.5522 17.8707 13.313 17.9822 13.0586 17.9972C12.8042 18.0121 12.5536 17.9293 12.3582 17.7657C12.1627 17.6021 12.0371 17.3701 12.007 17.117L12 17V15.732C11.6187 15.5119 11.3208 15.1721 11.1523 14.7653C10.9838 14.3586 10.9543 13.9076 11.0682 13.4824C11.1822 13.0571 11.4333 12.6813 11.7825 12.4133C12.1318 12.1453 12.5597 12 13 12ZM13 4C11.9391 4 10.9217 4.42143 10.1716 5.17157C9.42143 5.92172 9 6.93913 9 8H17C17 6.93913 16.5786 5.92172 15.8284 5.17157C15.0783 4.42143 14.0609 4 13 4Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_784_2430">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );

  const renderMenuItem = (item: MenuItem, index: number, isLast: boolean) => (
    <div
      key={index}
      className={`flex items-center justify-between py-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors ${
        isLast ? '' : 'border-b border-gray-100'
      }`}
    >
      <div className="flex items-center space-x-4">
        {/* 💡 overflow-visible 처리로 굵어진 외곽 선 찌꺼기 잘림 완벽 방지 */}
        <div className="p-2 rounded-full transition-colors duration-200 hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center overflow-visible min-w-[40px] min-h-[40px]">
          {item.icon}
        </div>
        <div>
          <h4
            className={`${item.fontSizeClass} font-medium text-black leading-[20px] tracking-[0.08px]`}
          >
            {item.title}
          </h4>
          {item.description && (
            <p className="text-[14px] font-light text-[#61646B] leading-[20px] tracking-[0.4px] mt-0.5">
              {item.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {item.badge === 'new' && (
          <span className="w-9 h-4 bg-brand-lightBlue rounded-[20px] text-white text-xs font-normal leading-5 tracking-wide flex items-center justify-center antialiased subpixel-antialiased">
            new
          </span>
        )}
        {typeof item.badge === 'number' && (
          <span className="size-5 bg-brand-lightBlue rounded-full text-white text-xs font-normal leading-5 tracking-wide flex items-center justify-center antialiased subpixel-antialiased">
            {item.badge}
          </span>
        )}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="text-gray-400"
        >
          <path
            d="M8.59063 18.1598L14.2506 12.4998L8.59063 6.83984L7.89062 7.54984L12.8406 12.4998L7.89062 17.4498L8.59063 18.1598Z"
            fill="black" // 👈 fill="black" → currentColor로 교체
          />
        </svg>
      </div>
    </div>
  );

  return (
    <div
      style={{
        fontFamily:
          "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif",
      }}
      className="w-full bg-[#FBFBFB] text-gray-800 flex flex-col antialiased min-h-full"
    >
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');
      `}</style>

      {/* 헤더 바 */}
      <div className="sticky top-0 z-50 bg-[#FBFBFB]">
        <Header
          leftNode={
            <IconButton
              icon={ICONS.BACK} // 👈 'lucide:chevron-left' → ICONS.BACK
              onClick={() => navigate(-1)}
            />
          }
          title={
            <div className="justify-center text-black/70 text-xl font-semibold font-['Pretendard'] leading-5 tracking-wide">
              마이페이지
            </div>
          }

          rightNode={
            <IconButton
              icon={ICONS.BELL} // 👈 커스텀 SVG 전부 날리고 IconButton으로 교체
              onClick={() => navigate('/notifications')}
              className="text-brand-lightBlue"
            />
          }
        />
      </div>

      <div className="px-5 pb-12 flex flex-col flex-1">
        {/* 프로필 영역 */}
        <div className="py-6 flex items-center space-x-4 border-b border-gray-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 42 42"
            fill="none"
            style={{ width: '42px', height: '42px' }}
            className="flex-shrink-0"
          >
            <circle cx="20.916" cy="20.916" r="20.916" fill="#D9D9D9" />
            <path
              d="M20.9154 7.28809C22.6646 7.28809 24.3421 7.98295 25.579 9.21983C26.8159 10.4567 27.5107 12.1343 27.5107 13.8835C27.5107 15.6327 26.8159 17.3102 25.579 18.5471C24.3421 19.784 22.6646 20.4788 20.9154 20.4788C19.1662 20.4788 17.4886 19.784 16.2517 18.5471C15.0149 17.3102 14.32 15.6327 14.32 13.8835C14.32 12.1343 15.0149 10.4567 16.2517 9.21983C17.4886 7.98295 19.1662 7.28809 20.9154 7.28809ZM20.9154 23.7765C28.2033 23.7765 34.1061 26.728 34.1061 30.3719V33.6696H7.72461V30.3719C7.72461 26.728 13.6275 23.7765 20.9154 23.7765Z"
              fill="white"
            />
          </svg>
          <div>
            <h2 className="text-[16px] font-medium text-black leading-[20px] tracking-[0.4px]">
              {userEmail}
            </h2>
            <p className="text-[11px] font-normal text-black leading-[20px] tracking-[0.4px] flex items-center gap-1 mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 12 12"
                fill="none"
                style={{ width: '11.133px', height: '11.133px' }}
                className="flex-shrink-0"
              >
                <circle
                  cx="5.56641"
                  cy="5.56641"
                  r="5.31641"
                  fill="#D2EBFC"
                  stroke="#4C9DD1"
                  strokeWidth="0.5"
                />
                <path
                  d="M4.20115 7.21533L2.42656 5.44074L1.82227 6.04078L4.20115 8.41967L9.30789 3.31293L8.70785 2.71289L4.20115 7.21533Z"
                  fill="#4C9DD1"
                />
              </svg>
              숙명여자대학교 인증 계정
            </p>
          </div>
        </div>

        {/* 교환 활동 섹션 */}
        <div className="mt-6">
          <div className="h-5 flex items-center text-slate-500 text-base font-bold leading-5 tracking-wide mb-3">
            교환 활동
          </div>
          <div className="flex flex-col">
            {exchangeMenus.map((menu, idx) =>
              renderMenuItem(menu, idx, idx === exchangeMenus.length - 1),
            )}
          </div>
        </div>

        {/* 섹션 구분선 */}
        <div className="w-full border-b border-gray-200 mt-2" />

        {/* 라운지 섹션 */}
        <div className="mt-6">
          <div className="h-5 flex items-center text-slate-500 text-base font-bold leading-5 tracking-wide mb-3">
            라운지
          </div>
          <div className="flex flex-col">
            {loungeMenus.map((menu, idx) =>
              renderMenuItem(menu, idx, idx === loungeMenus.length - 1),
            )}
          </div>
        </div>

        {/* 섹션 구분선 */}
        <div className="w-full border-b border-gray-200 mt-2" />

        {/* 계정 설정 섹션 */}
        <div className="mt-6">
          <div className="h-5 flex items-center text-slate-500 text-base font-bold leading-5 tracking-wide mb-3">
            계정
          </div>
          <div className="flex flex-col">
            {/* 알림 설정 전용 행 */}
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full transition-colors duration-200 hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center text-brand-lightBlue overflow-visible min-w-[40px] min-h-[40px]">
                  <div className="size-6 relative overflow-visible flex items-center justify-center">
                    {/* 💡 계정 알림 설정 아이콘 교체 완료 */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="size-5.5 text-brand-lightBlue"
                    >
                      <path
                        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9zm-4.27 13a2 2 0 0 1-3.46 0"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="text-[16px] font-medium text-black leading-[20px] tracking-[0.08px]">
                    알림 받기
                  </h4>
                  <p className="text-[14px] font-light text-[#61646B] leading-[20px] tracking-[0.4px] mt-0.5">
                    교환 요청, 매칭 알림 관리
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAlertOn(!isAlertOn)}
                className={`w-[44px] h-[24px] flex items-center rounded-full p-0.5 transition-colors duration-300 ${isAlertOn ? 'bg-brand-lightBlue' : 'bg-gray-300'}`}
              >
                <div
                  className={`bg-white w-[20px] h-[20px] rounded-full shadow transform transition-transform duration-300 ${isAlertOn ? 'translate-x-[20px]' : 'translate-x-0'}`}
                />
              </button>
            </div>

            {/* 비밀번호 변경 행 */}
            {renderMenuItem(
              {
                icon: passwordMenuIcon,
                title: '비밀번호 변경',
                description: '',
                fontSizeClass: 'text-[16px]',
              },
              0,
              true,
            )}
          </div>
        </div>

        {/* 로그아웃 & 회원탈퇴 */}
        <div className="mt-auto pt-10 pb-4 flex justify-center items-center space-x-8 text-[14px]">
          <button
            onClick={() => console.log('로그아웃')}
            className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            로그아웃
          </button>
          <span className="text-gray-200">|</span>
          <button
            onClick={() => console.log('회원탈퇴')}
            className="text-[#FF5A5F] hover:text-red-700 font-semibold transition-colors"
          >
            회원탈퇴
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPage;

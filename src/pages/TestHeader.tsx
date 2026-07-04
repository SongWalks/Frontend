import { ICONS } from '../constants/icons';
import { IconButton } from '../components/common/IconButton';
import Header from '../components/layout/Header';

export const TestHeader = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 gap-10">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          헤더 UI 테스트 도화지 🎨
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          타이틀 중앙 정렬 및 가변 아이콘 검증
        </p>
      </div>

      {/* 모바일 화면(402px) 규격을 흉내 낸 컨테이너 */}
      <div className="flex flex-col gap-10 w-full max-w-[402px]">
        {/* 1번 시안: 게시글 상세 */}
        <section className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-gray-500 px-2">
            1. 게시글 상세 (타이틀 중앙 + 우측 점 3개)
          </p>
          <div className="relative w-full bg-white shadow-md rounded-t-2xl overflow-hidden border border-gray-200">
            <Header
              leftNode={
                <IconButton
                  icon={ICONS.BACK}
                  onClick={() => console.log('뒤로가기')}
                />
              }
              title="게시글 상세"
              rightNode={<IconButton icon={ICONS.MORE_VERTICAL} />}
            />
            {/* 헤더 아래 빈 내용 영역 */}
            <div className="h-32 bg-gray-50"></div>
          </div>
        </section>

        {/* 2번 시안: 교환 요청함 */}
        <section className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-gray-500 px-2">
            2. 교환 요청함 (기본 형태)
          </p>
          <div className="relative w-full bg-white shadow-md rounded-t-2xl overflow-hidden border border-gray-200">
            <Header
              leftNode={<IconButton icon={ICONS.BACK} />}
              title="교환 요청함"
              rightNode={<IconButton icon={ICONS.BELL} />}
            />
            <div className="h-32 bg-gray-50"></div>
          </div>
        </section>

        {/* 3번 시안: 메인 홈 */}
        <section className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-gray-500 px-2">
            3. 메인 홈 (좌측 로고 + 우측 멀티 아이콘)
          </p>
          <div className="relative w-full bg-white shadow-md rounded-t-2xl overflow-hidden border border-gray-200">
            <Header
              leftNode={
                <h1 className="text-2xl font-extrabold text-[#1B365D] pl-1 whitespace-nowrap">
                  교환해요
                </h1>
              }
              // title은 아예 비워둡니다
              rightNode={
                <>
                  {/* 💡 아이콘 두 개가 나란히 들어가도 알아서 예쁘게 배치됩니다 */}
                  <IconButton icon={ICONS.BELL} />
                  <IconButton icon={ICONS.MENU} />
                </>
              }
            />
            <div className="h-32 bg-gray-50"></div>
          </div>
        </section>
      </div>
    </div>
  );
};

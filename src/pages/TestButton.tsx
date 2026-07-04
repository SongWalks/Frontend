import Button from '../components/common/Button';

export const TestButton = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col gap-10 pb-20">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          버튼 UI 테스트 도화지 🎨
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          시안의 모든 케이스를 커버하는 만능 버튼 검증 페이지입니다.
        </p>
      </div>

      {/* 1. 새로운 색상(Variant) 테스트 */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-700">
          1. Variant (디자인 종류)
        </h2>
        <div className="flex flex-wrap items-center gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <Button variant="primary" size="md" fullWidth={false}>
            Primary
          </Button>
          <Button variant="danger" size="md" fullWidth={false}>
            Danger
          </Button>
          <Button variant="warning" size="md" fullWidth={false}>
            Warning (수락)
          </Button>
          <Button variant="light" size="md" fullWidth={false}>
            Light (입장)
          </Button>
          <Button variant="outline" size="md" fullWidth={false}>
            Outline
          </Button>
          <Button variant="ghost" size="md" fullWidth={false}>
            Ghost
          </Button>
        </div>
      </section>

      {/* 2. 실제 시안 레이아웃(Layout) 테스트 - 하이라이트 ✨ */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-700">
          2. 실제 시안 레이아웃 조립 테스트
        </h2>
        <div className="flex flex-col gap-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          {/* 케이스 A: 하단 고정 100% 버튼 */}
          <div>
            <p className="text-sm text-gray-400 mb-2 font-medium">
              ✅ 케이스 A: 회원가입, 시간등록 (기본 100%)
            </p>
            <Button>인증하기</Button>
          </div>

          {/* 케이스 B: 50:50 모달창 버튼 */}
          <div>
            <p className="text-sm text-gray-400 mb-2 font-medium">
              ✅ 케이스 B: 모달창 (취소/삭제 반반 나누기)
            </p>
            <div className="flex w-full gap-2">
              <Button variant="outline" className="flex-1">
                취소
              </Button>
              <Button variant="danger" className="flex-1">
                삭제
              </Button>
            </div>
          </div>

          {/* 케이스 C: 리스트 아이템 내부의 수락/거절 */}
          <div>
            <p className="text-sm text-gray-400 mb-2 font-medium">
              ✅ 케이스 C: 받은 요청함 (수락/거절 작은 버튼)
            </p>
            <div className="flex gap-2">
              <Button variant="warning" size="sm" className="flex-1">
                수락
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                거절
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 크기(Size) 테스트 */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-700">
          3. Size (크기 변화) - fullWidth={false} 기준
        </h2>
        <div className="flex items-center gap-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <Button size="lg" fullWidth={false}>
            lg 사이즈 (기본)
          </Button>
          <Button size="md" fullWidth={false}>
            md 사이즈
          </Button>
          <Button size="sm" fullWidth={false}>
            sm 사이즈
          </Button>
        </div>
      </section>

      {/* 4. 비활성화(Disabled) 테스트 */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-700">
          4. Disabled (비활성화 상태)
        </h2>
        <div className="flex flex-wrap items-center gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <Button disabled fullWidth={false}>
            내용 입력 전
          </Button>
          <Button variant="warning" disabled fullWidth={false}>
            수락 불가
          </Button>
          <Button variant="outline" disabled fullWidth={false}>
            선택 불가
          </Button>
        </div>
      </section>
    </div>
  );
};

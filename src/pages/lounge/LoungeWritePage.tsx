import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Header from '@/components/layout/Header';
import { IconButton } from '@/components/common/IconButton';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { ICONS } from '@/constants/icons';
import Button from '@/components/common/Button';
import { useWriteStore } from '@/store/useWriteStore';

export const LoungeWritePage = () => {
  const navigate = useNavigate();

  // 상태 관리
  const { postType, courseTag, title, content, setWriteData, resetWriteData } =
    useWriteStore();

  const handleSubmit = async () => {
    try {
      // TODO: 실제 서버에 데이터(title, content, postType, courseTag)를 전송하는 API 호출
      // await api.postWrite({ title, content, postType, courseTag });

      resetWriteData(); // 등록 성공했으니 스토어 초기화!
      navigate('/lounge', { replace: true }); // 라운지 메인으로 이동
    } catch (error) {
      console.error('글 등록 실패:', error);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* 1. 상단 헤더 */}
      <div className="shrink-0 [&>header]:!border-none">
        <Header
          leftNode={
            <IconButton icon={ICONS.BACK} onClick={() => navigate(-1)} />
          }
          title="글쓰기"
          rightNode={<IconButton icon={ICONS.BELL} onClick={() => {}} />}
        />
      </div>

      {/* 2. 본문 영역 (스크롤 가능) */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8">
        {/* 섹션 1: 게시글 유형 */}
        <section className="space-y-3">
          <h3 className="text-brand-lightBlue text-bold-16">게시글 유형</h3>
          <div className="flex gap-3">
            <button
              onClick={() => setWriteData({ postType: '강의꿀팁' })}
              className={`flex-1 py-3 rounded-full border text-[14px] font-medium transition-colors ${
                postType === '강의꿀팁'
                  ? 'border-brand-lightBlue text-brand-lightBlue bg-[#F3F7FC]'
                  : 'border-gray-300 text-gray-400 bg-white'
              }`}
            >
              강의꿀팁
            </button>
            <button
              onClick={() => setWriteData({ postType: '폐강과목' })}
              className={`flex-1 py-3 rounded-full border text-[14px] font-medium transition-colors ${
                postType === '폐강과목'
                  ? 'border-brand-lightBlue text-brand-lightBlue bg-[#F3F7FC]'
                  : 'border-gray-300 text-gray-400 bg-white'
              }`}
            >
              폐강과목
            </button>
          </div>
        </section>

        {/* 섹션 2: 과목 태그 */}
        <section className="space-y-3">
          <h3 className="text-brand-lightBlue text-bold-16">과목 태그</h3>

          {courseTag ? (
            // ✅ 1. 과목이 선택되었을 때의 UI (image_e0cafe.png 참고)
            <div className="relative w-full p-5 border border-gray-300 rounded-xl bg-brand-bg flex flex-col gap-2">
              {/* X 버튼: 클릭 시 선택된 과목 초기화 */}
              <button
                onClick={() => setWriteData({ courseTag: null })}
                className="absolute top-4 right-4 text-gray-400 p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Icon icon="ph:x" className="text-[20px]" />
              </button>

              <div className="text-[16px] font-bold text-gray-800">
                {courseTag.title}
              </div>

              <div className="text-[13px] text-gray-500 flex flex-col gap-0.5">
                <span>교수 : {courseTag.professor}</span>
                <span>시간 : {courseTag.time}</span>
              </div>

              {/* 과목 뱃지들 */}
              <div className="flex gap-2 mt-2">
                {courseTag.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-[#E2F0F9] text-brand-lightBlue text-[12px] font-medium rounded-md"
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            // ✅ 2. 과목이 선택되지 않았을 때의 UI (기존 점선 박스)
            <button
              onClick={() => navigate('/lounge/filter')}
              className="w-full py-10 border-2 border-dashed border-gray-400 rounded-xl flex flex-col items-center justify-center gap-3 text-gray-600 bg-white hover:bg-gray-50 transition-colors"
            >
              <Icon icon="ph:magnifying-glass-light" className="text-[36px]" />
              <span className="text-[15px] font-medium">과목 검색하기</span>
            </button>
          )}
        </section>

        {/* 섹션 3: 제목 및 내용 입력 */}
        <section className="space-y-3 pb-10">
          {/* 💡 시안에 있는 텍스트 그대로 적용 (필요시 수정) */}
          <h3 className="text-brand-lightBlue text-bold-16">상세 내용</h3>
          <div className="space-y-3">
            {/* 💡 커스텀 Input 컴포넌트 적용 */}
            <Input
              placeholder="제목을 입력해주세요."
              value={title}
              onChange={(e) => setWriteData({ title: e.target.value })}
              className="!rounded-xl focus:!border-brand-lightBlue !py-3.5"
            />
            {/* 💡 커스텀 Textarea 컴포넌트 적용 */}
            <Textarea
              placeholder="자유롭게 선택 과목에 대한 이야기를 나누세요."
              value={content}
              onChange={(e) => setWriteData({ content: e.target.value })}
              className="min-h-[180px] focus:!border-brand-lightBlue"
            />
          </div>
        </section>
      </div>

      {/* 3. 하단 고정 버튼 영역 */}
      <div className="shrink-0 px-4 py-4 space-y-2 pb-safe">
        <Button
          variant="primary"
          disabled={!title || !content || !postType || !courseTag}
          className="disabled:!bg-gray-200 disabled:!text-gray-500"
          onClick={async () => {
            try {
              // 1. 서버로 데이터 전송 (가상의 API 호출 함수 예시)
              // await createPostAPI({ title, content, postType, courseTag });

              // 2. 등록이 성공하면 스토어 초기화
              resetWriteData();

              // 3. 라운지 목록 페이지나 작성된 상세 글로 이동
              navigate('/lounge');
            } catch (error) {
              // 에러가 났을 때는 초기화하지 않고 에러 메시지 띄우기
              console.error('게시글 등록 실패', error);
            }
          }}
        >
          등록하기
        </Button>
        <Button variant="outline" onClick={() => navigate(-1)}>
          취소
        </Button>
      </div>
    </div>
  );
};

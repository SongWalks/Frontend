import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Header from '@/components/layout/Header';
import { IconButton } from '@/components/common/IconButton';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { ICONS } from '@/constants/icons';
import Button from '@/components/common/Button';

export const PostEditPage = () => {
  const navigate = useNavigate();

  // 💡 기존 데이터가 미리 채워져 있다고 가정 (수정 모드)
  const [postType] = useState<'강의꿀팁' | '폐강과목'>('폐강과목'); // 수정 불가
  const [title, setTitle] = useState('증원되었습니다'); // 수정 가능
  const [content, setContent] = useState(''); // 수정 가능

  return (
    <div className="relative w-full h-screen flex flex-col overflow-y-auto pb-[100px]">
      {' '}
      {/* 1. 상단 헤더 */}
      <div className="shrink-0 [&>header]:!border-none">
        <Header
          leftNode={
            <IconButton icon={ICONS.BACK} onClick={() => navigate(-1)} />
          }
          title="게시글 수정"
          rightNode={
            <IconButton icon={ICONS.MORE_VERTICAL} onClick={() => {}} />
          }
        />
      </div>
      {/* 2. 본문 영역 (스크롤 가능) */}
      {/* 하단 고정 영역(배너+버튼) 높이만큼 padding-bottom(pb-[150px])을 여유 있게 줍니다. */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8 pb-[150px]">
        {/* 섹션 1: 게시글 유형 (비활성화) */}
        <section className="space-y-3 opacity-60 pointer-events-none">
          <h3 className="text-brand-lightBlue font-bold text-[16px]">
            게시글 유형
          </h3>
          <div className="flex gap-3">
            <button
              disabled
              className={`flex-1 py-3 rounded-full border text-[14px] font-medium transition-colors ${
                postType === '강의꿀팁'
                  ? 'border-brand-lightBlue text-brand-lightBlue bg-[#F3F7FC]'
                  : 'border-gray-300 text-gray-400 bg-white'
              }`}
            >
              강의꿀팁
            </button>
            <button
              disabled
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

        {/* 섹션 2: 과목 태그 (비활성화 상태의 카드 UI) */}
        <section className="space-y-3 opacity-60 pointer-events-none">
          <h3 className="text-brand-lightBlue text-bold-16">과목 태그</h3>

          <div className="relative w-full p-5 border border-gray-300 rounded-xl bg-brand-bg flex flex-col gap-2">
            {/* 닫기 아이콘 (수정 불가이므로 사실상 동작하지 않음) */}
            <button className="absolute top-4 right-4 text-gray-400">
              <Icon icon="ph:x" className="text-[20px]" />
            </button>

            <div className="text-[16px] font-bold text-gray-800">
              컴퓨터구조
            </div>

            <div className="text-[13px] text-gray-500 flex flex-col gap-0.5">
              <span>교수 : John Smith</span>
              <span>시간 : 화목 10:30-11:45</span>
            </div>

            {/* 과목 뱃지들 */}
            <div className="flex gap-2 mt-2">
              <span className="px-3 py-1 bg-[#E2F0F9] text-brand-lightBlue text-[12px] font-medium rounded-md">
                컴퓨터 과학
              </span>
              <span className="px-3 py-1 bg-[#E2F0F9] text-brand-lightBlue text-[12px] font-medium rounded-md">
                전공필수
              </span>
            </div>
          </div>
        </section>

        {/* 섹션 3: 제목 및 내용 입력 (수정 가능) */}
        <section className="space-y-3">
          {/* 💡 첨부 이미지에는 '게시글 유형'으로 중복되어 적혀 있으나, 문맥상 '상세 내용' 또는 '제목'이 적합해 보입니다. (사진과 똑같이 원하시면 텍스트를 변경하세요) */}
          <h3 className="text-brand-lightBlue font-bold text-[16px]">
            상세 내용
          </h3>
          <div className="space-y-3">
            <Input
              placeholder="제목을 입력해주세요."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="!rounded-xl focus:!border-brand-lightBlue !py-3.5"
            />
            <Textarea
              placeholder="자유롭게 선택 과목에 대한 이야기를 나누세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[180px] focus:!border-brand-lightBlue"
            />
          </div>
        </section>
      </div>
      {/* 3. 하단 고정 버튼 & 경고 배너 영역 */}
      <div className="absolute bottom-0 left-0 w-full z-10 bg-white shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] pb-safe">
        {/* ⚠️ 노란색 경고 배너 */}
        <div className="bg-[#FFF9E6] px-5 py-3 text-[13px] text-gray-700 leading-relaxed">
          <span className="font-bold text-[#D9A000]">
            게시글 유형과 과목 태그는
          </span>{' '}
          수정할 수 없습니다.
          <br />
          잘못 입력한 경우 게시글을 삭제 후 재작성해 주세요.
        </div>

        {/* 버튼 컨테이너 */}
        <div className="px-4 py-4 space-y-2">
          <Button
            variant="primary"
            // 제목과 내용이 비어있으면 수정 불가
            disabled={!title.trim() || !content.trim()}
            className="disabled:!bg-gray-200 disabled:!text-gray-500"
            onClick={() => {
              /* 수정 API 호출 로직 */
            }}
          >
            수정하기
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            취소
          </Button>
        </div>
      </div>
    </div>
  );
};

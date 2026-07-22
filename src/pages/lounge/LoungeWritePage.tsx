import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Header from '@/components/layout/Header';
import { IconButton } from '@/components/common/IconButton';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { ICONS } from '@/constants/icons';
import Button from '@/components/common/Button';

export const LoungeWritePage = () => {
  const navigate = useNavigate();

  // 상태 관리
  const [postType, setPostType] = useState<'강의꿀팁' | '폐강과목' | null>(
    null,
  );
  const [courseTag, setCourseTag] = useState<string | null>(null); // 미래에 검색 모달에서 선택할 값
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

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
              onClick={() => setPostType('강의꿀팁')}
              className={`flex-1 py-3 rounded-full border text-[14px] font-medium transition-colors ${
                postType === '강의꿀팁'
                  ? 'border-brand-lightBlue text-brand-lightBlue bg-[#F3F7FC]'
                  : 'border-gray-300 text-gray-400 bg-white'
              }`}
            >
              강의꿀팁
            </button>
            <button
              onClick={() => setPostType('폐강과목')}
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

        {/* 섹션 2: 과목 태그 (점선 박스) */}
        <section className="space-y-3">
          <h3 className="text-brand-lightBlue text-bold-16">과목 태그</h3>
          <button
            // 💡 나중에 이 버튼을 누르면 검색 모달을 띄우고, 모달에서 선택한 값을 setCourseTag에 넣어주시면 됩니다!
            onClick={() => {
              /* 검색 모달 오픈 로직 */
            }}
            className="w-full py-10 border-2 border-dashed border-gray-400 rounded-xl flex flex-col items-center justify-center gap-3 text-gray-600 bg-white hover:bg-gray-50 transition-colors"
          >
            <Icon icon="ph:magnifying-glass-light" className="text-[36px]" />
            <span className="text-[15px] font-medium">
              {courseTag ? courseTag : '과목 검색하기'}
            </span>
          </button>
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
              onChange={(e) => setTitle(e.target.value)}
              className="!rounded-xl focus:!border-brand-lightBlue !py-3.5"
            />
            {/* 💡 커스텀 Textarea 컴포넌트 적용 */}
            <Textarea
              placeholder="자유롭게 선택 과목에 대한 이야기를 나누세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[180px] focus:!border-brand-lightBlue"
            />
          </div>
        </section>
      </div>

      {/* 3. 하단 고정 버튼 영역 */}
      <div className="shrink-0 px-4 py-4 space-y-2 pb-safe">
        <Button
          variant="primary"
          // 💡 4가지 조건(유형, 태그, 제목, 내용)이 모두 충족되지 않으면 비활성화
          disabled={!title || !content || !postType || !courseTag}
          className="disabled:!bg-gray-200 disabled:!text-gray-500"
          onClick={() => {
            /* 등록 API 호출 로직 */
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

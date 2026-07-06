import { useState } from 'react';
import { Icon } from '@iconify/react';
// 💡 컴포넌트들의 실제 경로에 맞게 수정해주세요
import { Input } from '../components/common/Input';
import { Textarea } from '../components/common/Textarea';

export const TestInput = () => {
  // 비밀번호 보이기/숨기기 토글 상태 관리
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 gap-10 pb-24">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          입력창 UI 테스트 도화지 📝
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          기본, 아이콘, 에러, 채팅 피드 타입 검증
        </p>
      </div>

      {/* 모바일 화면(402px) 규격 컨테이너 */}
      <div className="flex flex-col gap-8 w-full max-w-[402px] bg-white p-6 shadow-xl rounded-2xl border border-gray-200">
        {/* 케이스 1: 기본 이메일 입력창 */}
        <section className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            1. 이메일 입력창 (좌측 아이콘)
          </label>
          <Input
            type="email"
            placeholder="이메일을 입력해주세요"
            leftNode={<Icon icon="ph:envelope-simple" className="text-xl" />}
          />
        </section>

        {/* 케이스 2: 비밀번호 변경 에러 상태 */}
        <section className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            2. 비밀번호 확인 (우측 아이콘 + 에러)
          </label>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="**********"
            rightNode={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <Icon
                  icon={showPassword ? 'ph:eye-fill' : 'ph:eye-slash-fill'}
                  className="text-xl text-gray-400 hover:text-gray-600"
                />
              </button>
            }
            isError={true}
            errorMessage="비밀번호가 일치하지 않습니다."
          />
        </section>

        {/* 케이스 3: 게시판 글쓰기 제목 및 내용 */}
        <section className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            3. 게시글 작성 (일반 Input + Textarea)
          </label>
          <div className="flex flex-col gap-3">
            <Input placeholder="제목을 입력해주세요" />
            <Textarea placeholder="자유롭게 선택 과목에 대한 이야기를 나누세요." />
          </div>
        </section>

        {/* 케이스 4: 채팅 및 댓글 입력창 (Pill 타입) */}
        <section className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            4. 채팅/댓글창 (알약 모양 + 우측 전송)
          </label>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-center">
            <Input
              variant="pill"
              placeholder="메세지 보내기"
              rightNode={
                <button
                  type="button"
                  className="text-brand-blue active:opacity-70 flex items-center"
                >
                  <Icon icon="ph:paper-plane-right-fill" className="text-xl" />
                </button>
              }
            />
          </div>
        </section>
      </div>
    </div>
  );
};

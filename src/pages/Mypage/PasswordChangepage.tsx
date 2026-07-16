import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/common/Input';
import { IconButton } from '@/components/common/IconButton';
import { ICONS } from '@/constants/icons';
import Header from '@/components/layout/Header';
import { Modal } from '@/components/common/Modal';
import cautionIcon from '@/assets/icons/caution.svg';
import defaultEyeIcon from '@/assets/icons/eye_icon.svg';
import cautionEyeIcon from '@/assets/icons/Caution_eye_icon.svg';

// 💡 API 연동 함수 (페이지 상단 또는 별도 파일에 작성)
const updatePassword = async (
  currentPassword,
  newPassword,
  newPasswordConfirm,
) => {
  const token = localStorage.getItem('accessToken'); // 로그인 시 저장한 토큰
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/password/change`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        newPasswordConfirm,
      }),
    },
  );

  const data = await response.json();
  return { status: response.status, data };
};

const PasswordChangepage = () => {
  const navigate = useNavigate();
  const [pw, setPw] = useState({ current: '', new: '', confirm: '' });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [touched, setTouched] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  // 💡 비밀번호 변경 성공 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdate = async () => {
    // 1. 유효성 검사
    if (pw.new !== pw.confirm) {
      return alert('새 비밀번호가 일치하지 않습니다.');
    }

    // 2. API 호출
    try {
      const { status, data } = await updatePassword(
        pw.current,
        pw.new,
        pw.confirm,
      );

      if (status === 200 && data.success) {
        setIsModalOpen(true);
      } else {
        alert(data.message || '비밀번호 변경에 실패했습니다.');
      }
    } catch (error) {
      alert('서버 연결 중 오류가 발생했습니다.');
    }
  };

  const isError = (key: keyof typeof pw) =>
    touched[key] && pw[key].trim() === '';

  const renderEyeNode = (key: keyof typeof pw) => (
    <button
      type="button"
      onClick={() =>
        setShowPassword({ ...showPassword, [key]: !showPassword[key] })
      }
      className="flex items-center justify-center w-6 h-6"
    >
      <img
        src={isError(key) ? cautionEyeIcon : defaultEyeIcon}
        className="w-7 h-10"
        alt="Toggle Visibility"
      />
    </button>
  );

  return (
    <div className="relative w-full min-h-screen bg-[#FBFBFB] p-5">
      <Header
        leftNode={
          <IconButton
            icon={ICONS.BACK}
            onClick={() => navigate(-1)}
            className="-ml-5"
          />
        }
        title={<div className="h-10" />}
        rightNode={<div className="w-10 h-10" />}
      />

      <div className="max-w-sm mx-auto mt-[70px]">
        <h1 className="text-2xl font-bold font-['Paperlogy'] leading-9 tracking-wide text-cyan-900 mb-[3px]">
          비밀번호 변경
        </h1>
        <p className="text-lg font-semibold font-['Pretendard'] leading-5 tracking-wide text-slate-500 mb-[39.67px]">
          새로운 비밀번호로 재설정합니다
        </p>
      </div>

      <div className="max-w-sm mx-auto flex flex-col gap-6">
        <Input
          label="현재 비밀번호"
          type={showPassword.current ? 'text' : 'password'}
          value={pw.current}
          onChange={(e: any) => setPw({ ...pw, current: e.target.value })}
          onBlur={() => setTouched({ ...touched, current: true })}
          isError={isError('current')}
        />

        <Input
          label="새 비밀번호"
          type={showPassword.new ? 'text' : 'password'}
          value={pw.new}
          onChange={(e: any) => setPw({ ...pw, new: e.target.value })}
          onBlur={() => setTouched({ ...touched, new: true })}
          isError={isError('new')}
          rightNode={renderEyeNode('new')}
          errorMessage={
            isError('new')
              ? '영문, 숫자, 특수문자를 포함하여 8~12자로 작성해주세요'
              : ''
          }
        />

        <Input
          label="비밀번호 확인"
          type={showPassword.confirm ? 'text' : 'password'}
          value={pw.confirm}
          onChange={(e: any) => setPw({ ...pw, confirm: e.target.value })}
          onBlur={() => setTouched({ ...touched, confirm: true })}
          isError={isError('confirm')}
          rightNode={renderEyeNode('confirm')}
        />

        <button
          onClick={handleUpdate}
          className="w-full h-14 mt-4 bg-brand-lightBlue rounded-2xl text-white font-bold"
        >
          비밀번호 변경
        </button>

        {/* 🧪 개발 중 임시 버튼 - API 연동 확인되면 삭제 */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full h-10 border border-dashed border-gray-400 rounded-xl text-gray-500 text-sm"
        >
          (테스트) 모달 미리보기
        </button>
      </div>

      {/* 💡 비밀번호 변경 성공 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          <div className="w-80 text-center justify-center text-cyan-900 text-sm font-medium font-['Pretendard'] leading-4 tracking-wide">
            성공적으로 변경되었습니다
          </div>
        }
        footer={
          <div className="flex flex-col w-full gap-2">
            <button
              onClick={() => navigate('/my')}
              className="w-full h-12 rounded-full bg-brand-lightBlue text-white font-medium"
            >
              확인
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full h-12 rounded-full outline outline-1 outline-offset-[-1px] outline-gray-300 bg-white text-black font-medium"
            >
              취소
            </button>
          </div>
        }
      >
        <div className="h-1" />
      </Modal>
    </div>
  );
};

export default PasswordChangepage;

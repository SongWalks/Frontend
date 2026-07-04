import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Modal } from '../components/common/Modal';
import Button from '../components/common/Button';

export const TestModal = () => {
  // 모달 3개의 열림/닫힘 상태 관리
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [openExchangeModal, setOpenExchangeModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 gap-6 relative">
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold text-gray-900">
          모달 UI 테스트 도화지 팝업창 💬
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          아래 버튼들을 눌러 모달을 띄워보세요.
        </p>
      </div>

      <div className="w-full flex flex-col gap-4 mt-10">
        <Button onClick={() => setOpenDeleteModal(true)} variant="outline">
          1. 게시글 삭제 모달 띄우기
        </Button>
        <Button onClick={() => setOpenAuthModal(true)} variant="primary">
          2. 인증 실패 모달 띄우기
        </Button>
        <Button onClick={() => setOpenExchangeModal(true)} variant="light">
          3. 지금 교환하세요 모달 띄우기
        </Button>
      </div>

      {/* =========================================
          💡 1. 게시글 삭제 모달 (50:50 버튼)
      ========================================= */}
      <Modal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        icon={
          <Icon icon="ph:warning-circle" className="text-4xl text-point-red" />
        }
        title="게시글 삭제"
        footer={
          <>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setOpenDeleteModal(false)}
            >
              취소
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={() => setOpenDeleteModal(false)}
            >
              삭제
            </Button>
          </>
        }
      >
        삭제 시 복구할 수 없습니다
      </Modal>

      {/* =========================================
          💡 2. 인증 실패 모달 (단일 버튼 + 긴 텍스트)
      ========================================= */}
      <Modal
        isOpen={openAuthModal}
        onClose={() => setOpenAuthModal(false)}
        icon={
          <Icon icon="ph:x-circle-fill" className="text-4xl text-point-red" />
        }
        title="인증에 실패했습니다"
        footer={
          <Button variant="danger" onClick={() => setOpenAuthModal(false)}>
            다시 인증하기
          </Button>
        }
      >
        인증 QR 코드를 확인할 수 없습니다.{'\n\n'}
        수강신청(내역) 페이지와 인증 QR 코드가{'\n'}한 화면에 모두 보이도록 한
        뒤{'\n'}
        다시 인증을 진행해주세요.
      </Modal>

      {/* =========================================
          💡 3. 교환하기 모달 (커스텀 내용 + 세로 버튼)
      ========================================= */}
      <Modal
        isOpen={openExchangeModal}
        onClose={() => setOpenExchangeModal(false)}
        title={<span className="text-point-red text-xl">지금 교환하세요</span>}
        footer={
          <div className="flex flex-col w-full gap-2">
            <Button
              variant="danger"
              onClick={() => setOpenExchangeModal(false)}
            >
              교환성공
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpenExchangeModal(false)}
            >
              교환 실패
            </Button>
          </div>
        }
      >
        <div className="text-left text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-200">
          <p>1. 현재 강의를 취소하세요.</p>
          <p>2. 상대방의 강의를 신청하세요.</p>
          <br />
          <p className="text-xs text-gray-500 text-center">
            강의 신청이 완료되면
            <br />
            결과에 따라 아래 버튼을 선택해주세요.
          </p>
        </div>
      </Modal>
    </div>
  );
};

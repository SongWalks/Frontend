import { useState } from 'react';
import { Icon } from '@iconify/react';
import Header from '@/components/layout/Header';
import { Badge } from '@/components/common/Badge';
import { IconButton } from '@/components/common/IconButton';
import { ICONS } from '@/constants/icons';
import { Avatar } from '@/components/common/Avatar';
import { Input } from '@/components/common/Input';
import { Toast } from '@/components/common/Toast';
import { Modal } from '@/components/common/Modal';
import { useParams, useNavigate } from 'react-router-dom';

export const PostDetailPage = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(12);
  const [isScraped, setIsScraped] = useState(false);
  const [scrapCount, setScrapCount] = useState(0);
  const [showToast, setShowToast] = useState(false);

  // 💡 1. 게시글 삭제 모달 상태 추가
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [comments, setComments] = useState([
    {
      id: 1,
      author: '송이1',
      time: '10분 전',
      content: '바로 신청했다',
      isMine: false,
    },
    {
      id: 2,
      author: '송이2',
      time: '10분 전',
      content: '바로 신청했다',
      isMine: true,
    },
  ]);

  const handleDeleteComment = (commentId: number) => {
    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleScrap = () => {
    const nextScraped = !isScraped;
    setIsScraped(nextScraped);
    setScrapCount((prev) => (nextScraped ? prev + 1 : prev - 1));
    if (nextScraped) {
      setShowToast(true);
    }
  };

  // 💡 2. 게시글 실제 삭제 확인 버튼 핸들러
  const handleConfirmDeletePost = () => {
    // 실제 삭제 API 호출 등의 로직을 여기에 작성하세요.
    setIsDeleteModalOpen(false);
    window.history.back(); // 삭제 후 뒤로가기
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* 1. 상단 헤더 영역 */}
      <div className="shrink-0 w-full z-30 relative">
        <Header
          leftNode={
            <IconButton
              icon={ICONS.BACK}
              onClick={() => window.history.back()}
            />
          }
          title="게시글 상세"
          rightNode={
            <div className="relative">
              <IconButton
                icon={ICONS.MORE_VERTICAL}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              />
              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute top-full right-2 mt-1 w-[160px] bg-white border border-gray-200 shadow-sm z-50 flex flex-col text-[14px] text-gray-700">
                    {/* 삭제 버튼 */}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsDeleteModalOpen(true);
                      }}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-left"
                    >
                      <Icon
                        icon={ICONS.CLOSE}
                        className="text-[16px] text-gray-400"
                      />
                      삭제하기
                    </button>

                    {/* 💡 게시글 수정하기 버튼 수정 */}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false); // 1. 드롭다운 메뉴 닫기
                        navigate(`/lounge/${postId}/edit`); // 2. 수정 페이지로 이동 (설정하신 라우터 경로에 맞게 변경해주세요!)
                      }}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-left"
                    >
                      <Icon
                        icon="ph:pencil-simple"
                        className="text-[16px] text-gray-400"
                      />
                      게시글 수정하기
                    </button>
                  </div>
                </>
              )}
            </div>
          }
        />
      </div>

      {/* 2. 스크롤 가능한 본문 및 댓글 영역 */}
      <div className="flex-1 overflow-y-auto pb-[90px]">
        {/* 본문 컨텐츠 */}
        <div className="px-5 pt-4 pb-6">
          <div className="flex gap-2 mb-4">
            <Badge variant="primary">강의 꿀팁</Badge>
            <Badge variant="secondary">데이터베이스</Badge>
          </div>
          <div className="flex items-center gap-3 mb-5">
            <Avatar size="md" className="!rounded-xl" />
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 text-[15px]">송이</span>
              <span className="text-[13px] text-gray-500">05/08 18:02</span>
            </div>
          </div>
          <h1 className="text-[18px] font-bold text-gray-900 mb-3">
            데이터베이스 001분반 증원
          </h1>
          <p className="text-[15px] text-gray-600 leading-relaxed mb-6">
            증원된 거 확인하세요
          </p>
          <div className="flex items-center justify-end gap-1 text-[13px] text-gray-400">
            <Icon icon="ph:clock-fill" className="text-[14px]" />
            <span>6/29 19:37</span>
          </div>
        </div>

        {/* 액션 바 */}
        <div className="flex border-y border-gray-100 py-3 mx-4 text-[14px] text-gray-400">
          <button
            onClick={handleLike}
            className={`flex-1 flex items-center justify-center gap-1.5 transition-colors ${isLiked ? 'text-red-500' : 'hover:text-gray-600'}`}
          >
            <Icon
              icon={isLiked ? 'ph:heart-fill' : 'ph:heart'}
              className="text-[18px]"
            />
            공감 {likeCount}
          </button>
          <div className="w-[1px] bg-gray-200" />
          <button className="flex-1 flex items-center justify-center gap-1.5 hover:text-gray-600 transition-colors">
            <Icon icon="ph:chat-circle" className="text-[18px]" />
            댓글 {comments.length}
          </button>
          <div className="w-[1px] bg-gray-200" />
          <button
            onClick={handleScrap}
            className={`flex-1 flex items-center justify-center gap-1.5 transition-colors ${isScraped ? 'text-yellow-500' : 'hover:text-gray-600'}`}
          >
            <Icon
              icon={isScraped ? 'ph:bookmark-fill' : 'ph:bookmark-simple'}
              className="text-[18px]"
            />
            스크랩 {scrapCount}
          </button>
        </div>

        {/* 댓글 목록 */}
        <div className="px-5 py-6">
          <div className="flex items-center gap-1.5 font-bold text-[#004786] mb-6">
            <Icon icon="ph:chat-circle" className="text-[18px]" />
            <span>댓글 {comments.length}</span>
          </div>
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar size="sm" className="!rounded-xl" />
                    <span className="font-semibold text-gray-900 text-[14px]">
                      {comment.author}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[12px] text-gray-400">
                    <span>{comment.time}</span>
                    {comment.isMine && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="hover:text-gray-600 transition-colors"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-[15px] text-gray-900 pl-10">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. 하단 댓글 입력창 */}
      <div className="absolute bottom-0 left-0 w-full px-4 py-3 pb-safe z-30">
        <Input
          variant="pill"
          placeholder="댓글을 입력하세요"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          className="!bg-[#F6F6F6] !border-transparent focus:!border-gray-300"
          rightNode={
            <button
              className="text-black flex items-center justify-center disabled:opacity-30"
              disabled={!commentInput.trim()}
            >
              <Icon icon="mingcute:send-plane-fill" className="text-[22px]" />
            </button>
          }
        />
      </div>

      {/* 북마크 토스트 */}
      <Toast
        message="북마크 되었습니다."
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      {/* 💡 4. 게시글 삭제 모달 컴포넌트 추가 */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        icon={<Icon icon="ph:warning" className="text-[40px] text-[#F94C66]" />}
        title="게시글을 삭제하시겠습니까?"
        footer={
          <>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 py-3 px-4 rounded-full border border-gray-300 text-gray-700 font-medium text-[15px] hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleConfirmDeletePost}
              className="flex-1 py-3 px-4 rounded-full bg-[#F94C66] text-white font-medium text-[15px] hover:bg-[#E03A53] transition-colors"
            >
              삭제
            </button>
          </>
        }
      >
        게시글은 복구할 수 없습니다
      </Modal>
    </div>
  );
};

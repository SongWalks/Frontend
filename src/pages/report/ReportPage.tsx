import { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import { IconButton } from '@/components/common/IconButton';
import { useNavigate } from 'react-router-dom';
import { ICONS } from '@/constants/icons';
import Header from '@/components/layout/Header';
import Button from '@/components/common/Button';

export default function ReportPage() {
  const navigate = useNavigate();

  const [selectedReason, setSelectedReason] = useState<string>('');
  const [otherReasonText, setOtherReasonText] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const REPORT_REASONS = [
    {
      id: 'fake_photo',
      title: '허위 인증 사진제출',
      desc: '다른 과목 또는 타인의 화면을 제출한 경우',
    },
    {
      id: 'fake_subject',
      title: '허위 과목 등록 / 거래 불이행',
      desc: '실제로 보유하지 않은 과목을 등록하거나 교환을 이행하지 않은 경우',
    },
    {
      id: 'money',
      title: '금전 요구 또는 부당한 조건 변경',
      desc: '금전을 요구하거나 합의 없이 조건을 변경한 경우',
    },
    {
      id: 'abuse',
      title: '욕설 및 비매너',
      desc: '욕설, 협박, 불쾌한 언행을 한 경우',
    },
    {
      id: 'etc',
      title: '기타',
      desc: '',
    },
  ];

  const isSubmitEnabled =
    selectedReason !== '' &&
    images.length > 0 &&
    (selectedReason !== 'etc' || otherReasonText.trim().length > 0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (images.length + newFiles.length > 5) {
        alert('사진은 최대 5장까지 첨부 가능합니다.');
        return;
      }
      setImages((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full relative overflow-hidden">
      <Header
        leftNode={<IconButton icon={ICONS.BACK} onClick={() => navigate(-1)} />}
        title="신고"
        rightNode={
          <div className="relative">
            <IconButton icon={ICONS.BELL} />
          </div>
        }
      />

      <main className="flex-1 overflow-y-auto px-5 pt-4 pb-4">
        <section className="mb-8">
          <h2 className="text-brand-lightBlue text-bold-16 mb-3">신고 사유</h2>
          <div className="flex flex-col gap-3">
            {REPORT_REASONS.map((reason) => {
              const isSelected = selectedReason === reason.id;
              return (
                <div
                  key={reason.id}
                  className={`border rounded-[10px] overflow-hidden ${
                    isSelected
                      ? 'border-brand-lightBlue bg-[#F4F9FF]'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <label className="flex flex-col p-4 cursor-pointer w-full">
                    {/* 1. 라디오 버튼과 타이틀을 완벽히 나란히(수직 중앙) 배치 */}
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="reportReason"
                        value={reason.id}
                        checked={isSelected}
                        onChange={() => setSelectedReason(reason.id)}
                        className="hidden"
                      />
                      <div className="mr-3 shrink-0 flex items-center">
                        {isSelected ? (
                          <Icon
                            icon="mdi:radiobox-marked"
                            className="text-[20px] text-brand-lightBlue"
                          />
                        ) : (
                          <Icon
                            icon="mdi:radiobox-blank"
                            className="text-[20px] text-gray-300"
                          />
                        )}
                      </div>
                      <div
                        className={`text-medium-14 font-bold ${isSelected ? 'text-brand-lightBlue' : 'text-gray-900'}`}
                      >
                        {reason.title}
                      </div>
                    </div>

                    {/* 2. 설명(desc)이 있는 경우, 라디오 버튼 너비만큼 여백(ml-[32px])을 주어 타이틀 아래에 정렬 */}
                    {reason.desc && (
                      <div className="text-light-13 text-gray-500 mt-1 ml-[32px] break-keep leading-tight">
                        {reason.desc}
                      </div>
                    )}
                  </label>

                  {reason.id === 'etc' && isSelected && (
                    <div className="bg-[#F5F5F5] p-4 border-t border-gray-200">
                      <div className="text-[12px] text-gray-600 mb-2">
                        신고 사유
                      </div>
                      <input
                        type="text"
                        value={otherReasonText}
                        onChange={(e) => setOtherReasonText(e.target.value)}
                        placeholder="사유를 입력해주세요."
                        className="w-full p-3 rounded-lg border border-gray-200 bg-white text-[14px] outline-none focus:border-brand-lightBlue"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-end mb-1">
            <h2 className="text-brand-lightBlue text-bold-16 font-bold">
              증거 사진 첨부
            </h2>
            <span className="text-light-13 text-gray-400 font-medium">
              {images.length}/5
            </span>
          </div>
          <p className="text-light-13 text-gray-500 mb-4 tracking-tight">
            정확한 확인을 위해 채팅 내역이나 정황 캡처본을 첨부해주세요.
          </p>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-[140px] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-gray-50/50 hover:bg-gray-50 transition-colors"
          >
            <Icon icon="ph:camera" className="text-[32px] text-gray-400 mb-2" />
            <span className="text-gray-400 text-medium-14">파일 검색하기</span>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />

          {images.length > 0 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2 snap-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full -mx-5 px-5">
              {images.map((file, index) => (
                <div
                  key={index}
                  className="w-[72px] h-[72px] shrink-0 rounded-lg overflow-hidden relative border border-gray-200 snap-start isolate"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 w-[20px] h-[20px] bg-black/60 rounded-full flex justify-center items-center backdrop-blur-sm z-10"
                  >
                    <Icon icon="ph:x-bold" className="text-white text-[12px]" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <div className="w-full px-5 pb-8 pt-3 shrink-0 z-10">
        <Button
          size="lg"
          variant="primary"
          disabled={!isSubmitEnabled}
          onClick={() =>
            alert('디스코드 웹훅 연동 및 API 호출 로직 연결 위치입니다.')
          }
          className="h-[52px]"
        >
          신고하기
        </Button>
      </div>
    </div>
  );
}

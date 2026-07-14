import { Icon } from '@iconify/react';
import Button from '@/components/common/Button';

interface RequestCardProps {
  subject: string;
  targetSubject: string;
  time: string;
  isUrgent?: boolean;
}

export const ReceivedRequestCard = ({
  subject,
  targetSubject,
  time,
  isUrgent,
}: RequestCardProps) => {
  const borderClass = isUrgent ? 'border-[#F2994A]' : 'border-[#8FB6D9]';
  const accentClass = isUrgent ? 'text-[#F2994A]' : 'text-[#5A9ECC]';

  return (
    <div
      className={`flex flex-col shrink-0 w-[200px] h-[210px] bg-white
      rounded-[10px] border-[1.5px] p-4 snap-center ${borderClass}`}
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}
    >
      <h3 className="text-gray-900 text-semibold-18 mb-2 truncate">
        {subject}
      </h3>
      <p className="text-gray-400 text-light-13 truncate">↔ {targetSubject}</p>

      {/* 타이머 */}
      <div
        className={`flex justify-center items-center gap-1
        text-semibold-16 my-auto ${accentClass}`}
      >
        <Icon icon="ph:clock-bold" className="translate-y-[1px]" />
        <span>{time}</span>
      </div>

      {/* 버튼 */}
      <div className="flex gap-2">
        {/* 수락 버튼 */}
        <Button
          variant={isUrgent ? 'warning' : 'primary'}
          size="md"
          fullWidth={false}
          className="flex-1 h-[30px] !rounded-[5px] !text-regular-14"
        >
          수락
        </Button>

        {/* 거절 버튼 */}
        <Button
          variant="outline"
          size="md"
          fullWidth={false}
          className="flex-1 h-[30px] !rounded-[5px] !text-gray-500 !border-gray-200 !text-regular-14"
        >
          거절
        </Button>
      </div>
    </div>
  );
};

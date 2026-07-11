import { Icon } from '@iconify/react';

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
  const btnBg = isUrgent ? 'bg-[#F2994A]' : 'bg-[#5A9ECC]';

  return (
    <div
      className={`flex flex-col shrink-0 w-[200px] bg-white
      rounded-2xl border-2 p-4 snap-center ${borderClass}`}
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}
    >
      <h3 className="font-bold text-gray-900 text-[15px] mb-0.5 truncate">
        {subject}
      </h3>
      <p className="text-gray-400 text-xs mb-4 truncate">↔ {targetSubject}</p>

      {/* 타이머 */}
      <div
        className={`flex justify-center items-center gap-1
        font-bold text-base mb-4 ${accentClass}`}
      >
        <Icon icon="ph:clock-bold" />
        <span>{time}</span>
      </div>

      {/* 버튼 */}
      <div className="flex gap-2">
        <button
          className={`flex-1 py-2 rounded-xl text-white
          text-sm font-bold ${btnBg}`}
        >
          수락
        </button>
        <button
          className="flex-1 py-2 rounded-xl text-gray-500
          text-sm font-bold border border-gray-200 bg-white"
        >
          거절
        </button>
      </div>
    </div>
  );
};

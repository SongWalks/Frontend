import { Icon } from '@iconify/react';

interface MatchItemProps {
  subject: string;
  targetSubject: string;
  time: string;
}

export const RecommendMatchItem = ({
  subject,
  targetSubject,
  time,
}: MatchItemProps) => {
  return (
    <div
      className="flex justify-between items-center px-4 py-3.5
      bg-white rounded-2xl border border-[#C5E4F8]"
      style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}
    >
      <div className="flex flex-col gap-1 overflow-hidden pr-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#5A9ECC] shrink-0" />
          <h3 className="font-bold text-gray-900 text-medium-14 truncate">
            {subject}
          </h3>
        </div>
        <p className="text-gray-400 text-light-13 ml-3.5 truncate">
          ↔ {targetSubject}
        </p>
      </div>

      <div className="flex items-center gap-1 text-gray-700 shrink-0">
        <Icon icon="ph:clock" className="text-base translate-y-[1px]" />
        <span className="font-bold text-[14px]">{time}</span>
      </div>
    </div>
  );
};

interface HeaderProps {
  leftNode?: React.ReactNode; // 뒤로가기 버튼 등
  title?: string | React.ReactNode; // '교환게시판' 텍스트나 복잡한 타이틀
  rightNode?: React.ReactNode; // 알림 종 모양, 신고 버튼 등
}

export default function Header({ leftNode, title, rightNode }: HeaderProps) {
  return (
    <header className="flex justify-between items-center p-4 border-b">
      <div className="w-10">{leftNode}</div>
      <div className="flex-1 text-center font-bold">{title}</div>
      <div className="w-10 flex justify-end">{rightNode}</div>
    </header>
  );
}

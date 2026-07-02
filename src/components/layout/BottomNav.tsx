import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', label: '홈' },
  { path: '/posts', label: '게시판' },
  { path: '/chat', label: '교환채팅방' },
  { path: '/lounge', label: '라운지' },
  { path: '/mypage', label: '마이페이지' },
];

function BottomNav() {
  return (
    <nav>
      {navItems.map((item) => (
        <NavLink key={item.path} to={item.path} end={item.path === '/'}>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomNav;

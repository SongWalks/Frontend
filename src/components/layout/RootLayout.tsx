// src/components/layout/RootLayout.tsx
import { Outlet } from 'react-router-dom';

export default function RootLayout() {
  return (
    <div className="h-screen flex justify-center bg-gray-200">
      <div
        className="
          h-screen
          aspect-[402/874]
          bg-gray-50
          shadow-xl
          overflow-hidden
          relative
          flex flex-col
        "
      >
        <Outlet />
      </div>
    </div>
  );
}

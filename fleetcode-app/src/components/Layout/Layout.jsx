import { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.css';

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`layout ${collapsed ? 'layout-collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
      <main className="layout-main">
        {children}
      </main>
    </div>
  );
}

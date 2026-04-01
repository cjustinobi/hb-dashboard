import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  FileText, 
  HandHeart, 
  Microscope, 
  Bell, 
  Settings, 
  LogOut 
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Users size={20} />, label: 'Users', path: '/users/patients' },
    { icon: <UserCheck size={20} />, label: 'Verification', path: '/verification' },
    { icon: <FileText size={20} />, label: 'Blood Requests', path: '/blood-requests' },
    { icon: <HandHeart size={20} />, label: 'Donations', path: '/donations' },
    { icon: <Microscope size={20} />, label: 'Care', path: '/care' },
    { icon: <Bell size={20} />, label: 'Notifications', path: '/notifications' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-secondary text-gray-400 p-6 flex flex-col z-20">
      <div className="flex items-center space-x-2 mb-10 px-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">H</span>
        </div>
        <span className="text-white font-bold text-lg tracking-tight">AmeblissHealth</span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-primary text-white shadow-lg shadow-red-900/20' 
                  : 'hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <span className="transition-transform group-hover:scale-110">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-colors duration-200 group"
      >
        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
        <span className="font-medium">Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;

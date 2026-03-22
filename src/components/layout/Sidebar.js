import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Droplets, 
  Heart, 
  Stethoscope, 
  Bell, 
  Settings, 
  LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Users', path: '/users/patients' },
    { icon: ShieldCheck, label: 'Verification', path: '/verification' },
    { icon: Droplets, label: 'Blood Request', path: '/blood-requests' },
    { icon: Heart, label: 'Donations', path: '/donations' },
    { icon: Stethoscope, label: 'Care', path: '/care' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-700">HealthBridge</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 py-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-red-700 text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-white bg-red-700 hover:bg-red-800 transition-all font-semibold shadow-md"
        >
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

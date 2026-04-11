import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  FileText, 
  HandHeart, 
  Microscope, 
  Bell, 
  Settings, 
  LogOut,
  X,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface SubMenuItem {
  label: string;
  path: string;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path?: string;
  children?: SubMenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Config']); // Default open config for visibility

  // Close sidebar on route change for mobile
  React.useEffect(() => {
    if (onClose && isOpen) {
      onClose();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => 
      prev.includes(label) ? prev.filter(m => m !== label) : [...prev, label]
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems: MenuItem[] = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Users size={20} />, label: 'Users', path: '/users/patients' },
    { icon: <UserCheck size={20} />, label: 'Verification', path: '/verification' },
    { icon: <FileText size={20} />, label: 'Blood Requests', path: '/blood-requests' },
    { icon: <HandHeart size={20} />, label: 'Donations', path: '/donations' },
    { icon: <Microscope size={20} />, label: 'Care', path: '/care' },
    { 
      icon: <Settings size={20} />, 
      label: 'Config', 
      children: [
        { label: 'Consultations', path: '/config/consultations' },
      ]
    },
    { icon: <Bell size={20} />, label: 'Notifications', path: '/notifications' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  const isChildActive = (children: SubMenuItem[]) => {
    return children.some(child => location.pathname.startsWith(child.path));
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed left-0 top-0 h-screen w-64 bg-secondary text-gray-400 p-6 flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between mb-10 px-2 group">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">RH</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">RubiMedik</span>
          </div>
          
          {/* Mobile close button */}
          <button 
            onClick={onClose}
            className="lg:hidden p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

      <nav className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => {
          if (item.children) {
            const isExpanded = expandedMenus.includes(item.label);
            const active = isChildActive(item.children);

            return (
              <div key={item.label} className="space-y-1">
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                    active ? 'text-white' : 'hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="transition-transform group-hover:scale-110">{item.icon}</span>
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
                
                {isExpanded && (
                  <div className="ml-9 space-y-1">
                    {item.children.map(child => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) =>
                          `block px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                            isActive 
                              ? 'text-primary' 
                              : 'text-gray-500 hover:text-white hover:bg-gray-800'
                          }`
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path!}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg shadow-red-900/20' 
                    : 'hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <span className="transition-transform group-hover:scale-110">{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-6 flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-colors duration-200 group"
      >
        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
        <span className="font-medium text-sm">Logout</span>
      </button>
      </aside>
    </>
  );
};

export default Sidebar;

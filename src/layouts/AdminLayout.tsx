import React, { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, Home, Package, MessageSquare, LogOut } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gray-800 text-white transition-all duration-300 ease-in-out`}>
        <div className="p-4 flex items-center justify-between">
          {isSidebarOpen ? (
            <h1 className="text-xl font-bold">Admin Panel</h1>
          ) : (
            <span></span>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded hover:bg-gray-700"
          >
            <Menu size={20} />
          </button>
        </div>
        <nav className="mt-8">
          <ul>
            <li>
              <Link 
                to="/admin" 
                className="flex items-center p-4 hover:bg-gray-700"
              >
                <Home size={20} />
                {isSidebarOpen && <span className="ml-4">Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/apps" 
                className="flex items-center p-4 hover:bg-gray-700"
              >
                <Package size={20} />
                {isSidebarOpen && <span className="ml-4">Manage Apps</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/reviews" 
                className="flex items-center p-4 hover:bg-gray-700"
              >
                <MessageSquare size={20} />
                {isSidebarOpen && <span className="ml-4">Manage Reviews</span>}
              </Link>
            </li>
            <li>
              <button 
                onClick={handleLogout}
                className="flex items-center w-full p-4 hover:bg-gray-700 text-left"
              >
                <LogOut size={20} />
                {isSidebarOpen && <span className="ml-4">Logout</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

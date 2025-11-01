// pages/Unauthorized.tsx - FIXED VERSION

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Unauthorized() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleGoBack = () => {
    // Go back to home or previous page
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <i className="pi pi-ban text-6xl text-red-500 mb-4"></i>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          
          {user && (
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">
                Logged in as:
              </p>
              <p className="font-semibold text-gray-900">
                {user.email}
              </p>
              <p className="text-sm text-gray-500">
                Role: <span className="font-medium">{user.role}</span>
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoBack}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <i className="pi pi-arrow-left mr-2"></i>
            Go to Dashboard
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <i className="pi pi-sign-out mr-2"></i>
            Logout
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          If you believe this is a mistake, please contact your administrator.
        </p>
      </div>
    </div>
  );
}
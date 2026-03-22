import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      
      const { token, refresh_token, user } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Check if user is admin
      if (user.role === 'admin') {
        window.location.href = '/dashboard';
      } else {
        setError('Unauthorized access. Admin role required.');
        localStorage.clear();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-red-700">HealthBridge</h1>
      </div>
      
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">Admin Login</h2>
          <p className="text-gray-500 text-sm mt-1">Authorized personnel only.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-x-1 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email or Phone Number</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              placeholder="malikwestham@gml"
              required
            />
          </div>
          
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter Strong password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <div className="text-right">
            <button type="button" className="text-sm text-red-600 hover:underline">Forgot Password?</button>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-700 text-white py-4 rounded-lg font-semibold hover:bg-red-800 transition-colors shadow-md disabled:bg-red-400"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <div className="mt-8 text-center text-xs text-gray-400">
          HealthBridge Admin Console v2.0
        </div>
      </div>
    </div>
  );
};

export default Login;

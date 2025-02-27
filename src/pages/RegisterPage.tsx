import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { UserPlus, AlertCircle, Check } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const validatePassword = (password: string): boolean => {
    // At least 6 characters, containing at least one number and one letter
    return password.length >= 6 && 
           /[0-9]/.test(password) && 
           /[a-zA-Z]/.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Form validation
    if (!email.trim() || !password.trim() || !username.trim()) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters and contain at least one letter and one number');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error: signUpError, user: newUser } = await signUp(email, password, username);
      
      if (signUpError) {
        setError(signUpError.message);
        toast.error('Registration failed. Please try again.');
      } else if (newUser) {
        toast.success('Registration successful! You are now logged in.');
        navigate('/');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred. Please try again.');
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = (): { strength: string; color: string } => {
    if (!password) return { strength: 'None', color: 'text-gray-400' };
    if (password.length < 6) return { strength: 'Weak', color: 'text-red-500' };
    if (validatePassword(password)) {
      if (password.length >= 10) return { strength: 'Strong', color: 'text-green-500' };
      return { strength: 'Medium', color: 'text-yellow-500' };
    }
    return { strength: 'Weak', color: 'text-red-500' };
  };

  const { strength, color } = passwordStrength();

  return (
    <div className="max-w-md mx-auto">
      <Helmet>
        <title>Register - APK Store</title>
        <meta name="description" content="Create a new account on APK Store to download apps and track your favorite applications." />
      </Helmet>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <UserPlus className="h-12 w-12 text-blue-600 mx-auto mb-2" />
          <h1 className="text-2xl font-bold">Create an Account</h1>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
            <div className="flex justify-between mt-1">
              <div className="text-xs">
                <span className="text-gray-500">Strength: </span>
                <span className={color}>{strength}</span>
              </div>
              <div className="text-xs text-gray-500">
                Min 6 characters, include numbers and letters
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
            {confirmPassword && password === confirmPassword && (
              <div className="flex items-center mt-1 text-green-500 text-xs">
                <Check size={14} className="mr-1" />
                Passwords match
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Creating Account...
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

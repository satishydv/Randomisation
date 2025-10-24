import React, { useState } from 'react';
import { ChevronLeft, Phone, Mail, KeyRound, Eye, EyeOff, UserPlus, Loader2 } from 'lucide-react';
import { countries } from './Countriesdata';
import PhoneInputWithCountry from './PhoneInputWithCountry';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/game';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  // UI State
  const [authMode, setAuthMode] = useState('login');
  const [loginMethod, setLoginMethod] = useState('phone');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  
  // Form State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const [inviteCode, setInviteCode] = useState('');
  
  // Loading and Error State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
  };

  // Clear messages when switching modes
  const handleModeSwitch = (mode) => {
    setAuthMode(mode);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // API Functions
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const loginData = {
        password: password
      };

      // Add phone or email based on login method
      if (loginMethod === 'phone') {
        const fullPhoneNumber = selectedCountry.code + phoneNumber;
        loginData.phone_number = fullPhoneNumber;
      } else {
        loginData.email = email;
      }

      // Use AuthContext login function
      const result = await login(loginData);

      if (result.success) {
        setSuccessMessage('Login successful! Redirecting...');
        
        // Redirect to homepage after successful login
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setErrorMessage(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      const fullPhoneNumber = selectedCountry.code + phoneNumber;
      
      const registerData = {
        phone_number: fullPhoneNumber,
        password: password
      };

      // Add email if provided
      if (email.trim()) {
        registerData.email = email.trim();
      }

      // Use AuthContext register function
      const result = await register(registerData);

      if (result.success) {
        setSuccessMessage('Registration successful! You can now login.');
        setAuthMode('login');
        // Clear form
        setPhoneNumber('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setErrorMessage(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderInputField = (icon, label, type, placeholder, isPassword = false, visibility, toggleVisibility, value, onChange) => (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">{icon}<span>{label}</span></label>
      <div className="relative">
        <input
          type={isPassword ? (visibility ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
          disabled={isLoading}
        />
        {isPassword && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={toggleVisibility}>
            {visibility ? <EyeOff size={20} className="text-gray-400" /> : <Eye size={20} className="text-gray-400" />}
          </div>
        )}
      </div>
    </div>
  );

  const loginForm = (
    <form onSubmit={handleLogin}>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white">Log In</h1>
        <p className="text-gray-400 text-sm mt-2">Log in with your phone or email</p>
      </div>
      
      {/* Error/Success Messages */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
          <p className="text-red-400 text-sm">{errorMessage}</p>
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg">
          <p className="text-green-400 text-sm">{successMessage}</p>
        </div>
      )}
      
      <div className="flex bg-[#3f3f3f] rounded-lg p-1 mb-6">
        <button 
          type="button"
          onClick={() => setLoginMethod('phone')} 
          className={`w-1/2 py-4 rounded-md text-sm font-semibold flex items-center justify-center space-x-2 transition-colors ${loginMethod === 'phone' ? ' bg-gradient-to-r from-[#f2dd9b] to-[#c4933f] text-black' : 'text-gray-300'}`}
          disabled={isLoading}
        >
          <Phone size={16} /><span>Phone</span>
        </button>
        <button 
          type="button"
          onClick={() => setLoginMethod('email')} 
          className={`w-1/2 py-4 rounded-md text-sm font-semibold flex items-center justify-center space-x-2 transition-colors ${loginMethod === 'email' ? ' bg-gradient-to-r from-[#f2dd9b] to-[#c4933f] text-black' : 'text-gray-300'}`}
          disabled={isLoading}
        >
          <Mail size={16} /><span>Email/Account</span>
        </button>
      </div>
      
      {loginMethod === 'phone' ? (
        <div className="space-y-1 mb-4">
          <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
            <Phone size={16} /><span>Phone Number</span>
          </label>
          <PhoneInputWithCountry
            selectedCountry={selectedCountry}
            onCountrySelect={handleCountrySelect}
            isDropdownOpen={isDropdownOpen}
            onDropdownToggle={() => setIsDropdownOpen(!isDropdownOpen)}
            phoneNumber={phoneNumber}
            onPhoneNumberChange={setPhoneNumber}
          />
        </div>
      ) : (
        renderInputField(
          <Mail size={16} />, 
          "Email / Account", 
          "email", 
          "Enter your email",
          false,
          false,
          null,
          email,
          (e) => setEmail(e.target.value)
        )
      )}
      
      {renderInputField(
        <KeyRound size={16} />, 
        "Password", 
        "password", 
        "Enter your password", 
        true, 
        passwordVisible, 
        () => setPasswordVisible(!passwordVisible),
        password,
        (e) => setPassword(e.target.value)
      )}
      
      <div className="mt-6">
        <button 
          type="submit"
          className="w-full py-3 rounded-lg font-bold bg-gradient-to-r from-[#f2dd9b] to-[#c4933f] text-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={isLoading || !password || (loginMethod === 'phone' ? !phoneNumber : !email)}
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin mr-2" />
              Logging In...
            </>
          ) : (
            'Log In'
          )}
        </button>
        <button 
          type="button"
          onClick={() => handleModeSwitch('register')} 
          className="w-full mt-3 py-3 rounded-lg font-bold text-lg bg-gray-600 text-gray-300 disabled:opacity-50"
          disabled={isLoading}
        >
          Register
        </button>
      </div>
    </form>
  );

  const registerForm = (
    <form onSubmit={handleRegister}>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white">Register</h1>
        <p className="text-gray-400 text-sm mt-2">Please register by phone number</p>
      </div>
      
      {/* Error/Success Messages */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
          <p className="text-red-400 text-sm">{errorMessage}</p>
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg">
          <p className="text-green-400 text-sm">{successMessage}</p>
        </div>
      )}
      
      <div className="space-y-1 mb-4">
        <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
          <Phone size={16} /><span>Phone Number</span>
        </label>
        <PhoneInputWithCountry
          selectedCountry={selectedCountry}
          onCountrySelect={handleCountrySelect}
          isDropdownOpen={isDropdownOpen}
          onDropdownToggle={() => setIsDropdownOpen(!isDropdownOpen)}
          phoneNumber={phoneNumber}
          onPhoneNumberChange={setPhoneNumber}
        />
      </div>
      
      {renderInputField(
        <Mail size={16} />, 
        "Email (Optional)", 
        "email", 
        "Enter your email (optional)",
        false,
        false,
        null,
        email,
        (e) => setEmail(e.target.value)
      )}
      
      {renderInputField(
        <KeyRound size={16} />, 
        "Set Password", 
        "password", 
        "Set password", 
        true, 
        passwordVisible, 
        () => setPasswordVisible(!passwordVisible),
        password,
        (e) => setPassword(e.target.value)
      )}
      
      {renderInputField(
        <KeyRound size={16} />, 
        "Confirm Password", 
        "password", 
        "Confirm password", 
        true, 
        confirmPasswordVisible, 
        () => setConfirmPasswordVisible(!confirmPasswordVisible),
        confirmPassword,
        (e) => setConfirmPassword(e.target.value)
      )}
      
      <div className="flex items-center space-x-2 mt-4">
        <input type="checkbox" className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-yellow-400" required/>
        <span className="text-sm text-gray-400">I agree to <span className="text-yellow-400">Privacy Agreement</span></span>
      </div>
      
      <div className="mt-6">
        <button 
          type="submit"
          className="w-full py-3 rounded-lg font-bold text-lg bg-gradient-to-r from-[#f2dd9b] to-[#dbb768] text-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={isLoading || !phoneNumber || !password || !confirmPassword}
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin mr-2" />
              Registering...
            </>
          ) : (
            'Register'
          )}
        </button>
        <button 
          type="button"
          onClick={() => handleModeSwitch('login')} 
          className="w-full mt-3 text-center text-gray-400 font-semibold disabled:opacity-50"
          disabled={isLoading}
        >
          Login
        </button>
      </div>
    </form>
  );

  return (
    <div className="bg-gray-900 min-h-screen flex justify-center">
      <div className="w-full max-w-[480px] bg-[#212121] text-white">
        <header className="p-4 flex items-center justify-between bg-[#3f3f3f] sticky top-0 z-10">
          <Link to="/"><ChevronLeft size={28} /></Link>
          <div className="w-24 h-8 bg-contain bg-no-repeat bg-center" style={{ backgroundImage: `url('https://ossimg.bdgadminbdg.com/IndiaBDG/other/h5setting_20240110060804ufv8.png')` }} />
          <div className='flex gap-2 justify-center items-center'>
            <img src="/newproject/usicon.webp" className='w-8 h-8'/>
            <div className="text-md text-yellow-600">EN </div>
          </div>
        </header>
        <main className="p-4">{authMode === 'login' ? loginForm : registerForm}</main>
      </div>
    </div>
  );
};

export default AuthPage;

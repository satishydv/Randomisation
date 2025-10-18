import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { countries } from './Countriesdata';

const PhoneInputWithCountry = ({
  selectedCountry,
  onCountrySelect,
  isDropdownOpen,
  onDropdownToggle,
  phoneNumber,
  onPhoneNumberChange
}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (isDropdownOpen) {
          onDropdownToggle();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, onDropdownToggle]);

  // Handle phone number change
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // only digits
    const trimmed = value.slice(0, 10); // limit to 10 digits
    onPhoneNumberChange(trimmed);

    // 🔴 Error logic from first code
    if (trimmed.length === 0) {
      setErrorMessage('Please enter your phone number.');
    } else if (trimmed.length < 10) {
      setErrorMessage(`Enter 10 digits. Missing ${10 - trimmed.length} digits.`);
    } else {
      setErrorMessage(''); // valid -> hide error
    }
  };

  const isError = errorMessage.length > 0;
  const borderClasses = isError 
    ? 'border-2 border-red-500' 
    : 'border border-gray-600';

  return (
    <div className="flex flex-col items-start w-full" ref={dropdownRef}>
      {/* Input Row */}
      <div className={`flex items-center w-full bg-[#4d4d4c] rounded-lg h-12 transition-all ${borderClasses}`}>
        {/* Country Selector */}
        <div className="relative h-full overflow-visible">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Dropdown button clicked, current state:', isDropdownOpen);
              onDropdownToggle();
            }}
            className={`flex items-center space-x-2 bg-transparent border-r px-3 py-3 text-white h-full transition-colors hover:bg-gray-700 ${isError ? 'border-r-2 border-red-500' : 'border-r border-gray-600'}`}
          >
            <span>{selectedCountry.flag}</span>
            <span>{selectedCountry.code}</span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown List */}
          <div
            className={`absolute z-50 top-full left-0 mt-2 w-80 max-h-60 overflow-y-auto bg-gray-800 border border-gray-600 rounded-lg shadow-lg transition-all duration-300 origin-top ${
              isDropdownOpen ? 'opacity-100 scale-100 block' : 'opacity-0 scale-95 pointer-events-none hidden'
            }`}
            style={{ minWidth: '320px' }}
          >
            <ul>
              {countries.map((country) => (
                <li
                  key={country.code}
                  onClick={() => onCountrySelect(country)}
                  className="flex items-center space-x-3 px-3 py-2 text-white hover:bg-gray-700 cursor-pointer"
                >
                  <span>{country.flag}</span>
                  <span>{country.name}</span>
                  <span className="ml-auto text-gray-400">{country.code}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Phone Input */}
        <input
          type="tel"
          placeholder="Enter your 10 digit phone number"
          maxLength={10}
          inputMode="numeric"
          value={phoneNumber}
          onChange={handlePhoneChange}
          className="flex-grow bg-transparent p-3 text-white focus:outline-none placeholder-gray-400 text-sm h-full
                     [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
      </div>

      {/* Error Message */}
      {isError && (
        <p className="text-red-500 text-xs mt-1 ml-2 animate-pulse">{errorMessage}</p>
      )}
    </div>
  );
};

export default PhoneInputWithCountry;

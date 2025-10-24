import React from 'react';
import { Check } from 'lucide-react';

const CustomCheckbox = ({ isChecked, onToggle, label, rulesText }) => (
  <div className="flex items-center gap-2 cursor-pointer" onClick={onToggle}>
    <div
      role="checkbox"
      aria-checked={isChecked}
      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200
        ${isChecked ? "bg-green-500 border-green-500" : "bg-transparent border-2 border-gray-500"}`}
    >
      {isChecked && <Check size={14} className="text-white" />}
    </div>
    <span className="text-sm text-gray-400">
      {label}
      <span className="text-blue-400"> {rulesText}</span>
    </span>
  </div>
);

export default CustomCheckbox;
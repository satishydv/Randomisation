import React, { useState } from 'react';

// पेमेंट ऑप्शन्स का डेटा
const paymentOptions = [
  {
    name: 'UPI-QRpay',
    imgSrc: '/Accounticon/Deposit/Depositupi.png',
  },
  
 
];

const RechargeOptions = () => {
  // यह स्टेट ट्रैक करेगा कि कौन सा ऑप्शन सिलेक्टेड है
  const [selectedOption, setSelectedOption] = useState('UPI-QRpay');

  return (
    <div className="p-4 rounded-lg max-w-md mx-auto font-sans">
      
      <div className="grid grid-cols-4 space-x-3">
        {paymentOptions.map((item) => (
          <div
            key={item.name}
            onClick={() => setSelectedOption(item.name)}
            className={`
              relative flex flex-col items-center justify-center 
              w-24 h-28 p-2 rounded-xl cursor-pointer transition-all duration-200
              ${selectedOption === item.name 
                ? 'bg-gradient-to-r from-[#f2dd9b] to-[#c4933f]' 
                : 'bg-[#4d4d4c]  '}
            `}
          >
            {item.bonus && (
              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-tr-xl rounded-bl-xl">
                {item.bonus}
              </div>
            )}
            
            <div className="w-12 h-12 flex items-center justify-center">
              <img src={item.imgSrc} alt={item.name} className="max-w-full max-h-full object-contain" />
            </div>
            
            {/* टेक्स्ट */}
            <span className="mt-2 text-xs font-semibold text-white text-center">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RechargeOptions;
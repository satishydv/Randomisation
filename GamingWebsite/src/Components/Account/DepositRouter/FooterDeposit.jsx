import React from 'react';

const FooterDeposit = ({ selectedMethod = '7Day-QRpay', selectedAmount = null, currencySymbol = '$' }) => {
  const isAmountSelected = selectedAmount !== null && selectedAmount !== undefined && selectedAmount !== '';

  const amountLabel = isAmountSelected
    ? `${currencySymbol}${selectedAmount}`
    : 'Select amount';

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-gray-900 z-40 rounded-t-xl">
      <div className="flex items-center justify-between p-3 max-w-lg mx-auto">
        <div>
          <p className="text-xs text-gray-200">Recharge Method:</p>
          <h2 className="text-lg font-bold text-white -mt-1">{selectedMethod}</h2>
          <p className="text-xs text-gray-300 mt-1">
            Amount: <span className="font-semibold text-white">{amountLabel}</span>
          </p>
        </div>

        <a href="/transactions" target="_blank" rel="noreferrer">
          <button
            disabled={!isAmountSelected}
            className={`
              py-3 px-5 rounded-lg font-bold shadow-md active:scale-95 transition-all
              ${isAmountSelected
                ? 'bg-gradient-to-r from-[#f2dd9b] to-[#c4933f] text-black'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            Deposit {isAmountSelected ? amountLabel : ''}
          </button>
        </a>
      </div>
    </div>
  );
};

export default FooterDeposit;

import React, { useState } from 'react';
import { Copy, CheckCircle, Scan } from 'lucide-react';

// Utility for formatting currency
const formatAmount = (amount) => {
  if (amount === null || amount === undefined) return '—';
  const formatted = parseFloat(amount).toFixed(2);
  return `${formatted}`;
};

// Copy Success Popup Component
const CopySuccessPopup = ({ message }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
    <div className="bg-green-600 text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-2 pointer-events-auto transition-all duration-300 transform scale-100 opacity-100">
      <CheckCircle className="h-5 w-5 text-white" />
      <span>{message}</span>
    </div>
  </div>
);

const UpiPaymentDetails = ({
  orderId = 'U202510171210564rsCv95bS82ZMhXIe',
  selectedAmount = 200.0,
  upiVpa = '9263777455@ybl',
  contactEmail = 'icicibankcomplaintdeal@gmail.com',
  qrTitle = 'MAFIDULSIKDAR',
  mcCode = '3526',
}) => {
  const [showCopyPopup, setShowCopyPopup] = useState(false);
  const [utrInput, setUtrInput] = useState('');

  const formattedAmount = formatAmount(selectedAmount);

  // Copy logic
  const handleCopy = async (text) => {
    if (document.execCommand('copy')) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    } else {
      await navigator.clipboard.writeText(text).catch((err) => {
        console.error('Copy failed', err);
      });
    }
    setShowCopyPopup(true);
    setTimeout(() => setShowCopyPopup(false), 1400);
  };

  // UTR submission logic
  const uploadUTR = (e) => {
    e.preventDefault();
    const messageElement = document.getElementById('status-message');
    if (utrInput.length === 12) {
      console.log(`Submitting UTR: ${utrInput} for Order: ${orderId} and Amount: ${selectedAmount}`);
      if (messageElement) {
        messageElement.textContent = `UTR ${utrInput} submitted successfully! Please wait for confirmation.`;
        messageElement.classList.remove('hidden');
        setTimeout(() => messageElement.classList.add('hidden'), 3000);
      }
    } else {
      if (messageElement) {
        messageElement.textContent = 'Please enter a valid 12-digit UTR.';
        messageElement.classList.remove('hidden', 'text-green-600');
        messageElement.classList.add('text-red-600');
        setTimeout(() => {
          messageElement.classList.add('hidden');
          messageElement.classList.remove('text-red-600');
          messageElement.classList.add('text-green-600');
        }, 3000);
      }
    }
  };

  const upiDeepLink = `upi://pay?pa=${upiVpa}&pn=${qrTitle}&mc=${mcCode}&am=${selectedAmount}&cu=INR&tn=${orderId.slice(
    0,
    10
  )}&mode=02&purpose=00`;

  return (
    <div className="relative bg-gray-100 flex items-center justify-center p-4 sm:p-6 min-h-screen">
      {showCopyPopup && <CopySuccessPopup message="Copied successfully!" />}

      <div className="w-full max-w-7xl bg-white overflow-hidden border border-gray-200 flex flex-col">
        {/* Header */}
        <div className="bg-green-600 p-4 text-white text-center">
          <h1 className="text-2xl font-bold uppercase">UPI</h1>
          <p className="mt-1 text-sm">{orderId}</p>
          <p className="mt-2 text-6xl font-black">${formattedAmount}</p>
          <p className="text-green-500 mt-1">Times up</p>
        </div>

        {/* Scrollable content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* QR Code Section */}
          <div className="segmentation border-t pt-4 space-y-4">
            <h2 className="bk-qr text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Scan className="h-5 w-5 text-green-600" />
              Scan Code To Pay
            </h2>
            <p className="code-p text-sm text-gray-500">
              The amount <b>{formattedAmount}</b> is embedded in the code.
            </p>
            <div className="qr-style flex justify-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 shadow-inner">
              <div
                id="qrcode"
                title={upiDeepLink}
                className="w-48 h-48 bg-gray-200 flex items-center justify-center rounded-lg shadow-lg"
              >
                <img src="public/Accounticon/Deposit/qr.jpg" alt="QR" />
              </div>
            </div>
            <p className="code-txt text-xs text-red-500 text-center font-medium">
              Do not use same QR code to pay multiple times
            </p>
          </div>

          {/* Copy UPI Section */}
          <div className="segmentation border-t pt-4 space-y-4">
            <h2 className="bk-qr text-xl font-semibold text-gray-800">Copy Account To Pay</h2>
            <div className="flex flex-col gap-2 utr-div">
              <label htmlFor="upiaccount" className="block text-sm font-medium text-gray-700">
                UPI ID / Account
              </label>
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border shadow-inner">
                <input
                  id="upiaccount"
                  type="text"
                  value={upiVpa}
                  readOnly
                  className="flex-1 bg-transparent text-gray-800 outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(upiVpa)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition active:scale-95 btn-copy shadow-md"
                >
                  <Copy className="h-4 w-4 inline mr-1" />
                  Copy
                </button>
              </div>
            </div>
          </div>

          {/* UTR Submit Section */}
          <div className="segmentation border-t pt-4 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Submit UTR</h2>
            <form onSubmit={uploadUTR} className="space-y-2">
              <label htmlFor="utrInput" className="block text-sm font-medium text-gray-700">
                UTR (12-digit)
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="utrInput"
                  type="text"
                  placeholder="input 12-digit here"
                  name="utr-input"
                  value={utrInput}
                  onChange={(e) => setUtrInput(e.target.value.replace(/[^0-9]/g, '').slice(0, 12))}
                  maxLength={12}
                  className="flex-1 p-3 rounded-lg border-2 focus:border-green-500 outline-none shadow-sm"
                  required
                />
                <button
                  type="submit"
                  className={`px-4 py-3 rounded-lg font-bold transition duration-200 shadow-lg ${
                    utrInput.length === 12
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  Submit
                </button>
              </div>
            </form>
            <p className="text-xs text-gray-500">
              If automatic payment fails, input the 12-digit UTR/Reference number and click submit.
            </p>
            <div
              id="status-message"
              className="hidden text-sm font-semibold text-center p-2 rounded bg-green-100 text-green-600"
            ></div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-200 p-6 text-sm text-gray-600 space-y-2 border-t border-gray-300">
          <a
            href={`mailto:${contactEmail}?subject=Ask Help,OrderID: ${orderId}`}
            className="mailTo text-blue-600 hover:underline font-semibold block"
          >
            Contact us for payment issues
          </a>
          <p>
            1. Please, contact us if you have any payment issue:{' '}
            <a href={`mailto:${contactEmail}`} className="text-blue-600">
              {contactEmail}
            </a>
          </p>
          <p>
            2. Please select the payment method you need and make sure your phone has the corresponding wallet
            software installed.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default UpiPaymentDetails;

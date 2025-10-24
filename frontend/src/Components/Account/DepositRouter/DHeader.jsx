import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom';

const DHeader = () => {
    const navigate=useNavigate()
      const handleBack = () => navigate("/account");
      const handlehistory = () => navigate("/history");

  return (
    <div>
        <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-2 bg-[#3f3f3f] text-white z-50">
        <div className="px-4 py-2 flex  items-center justify-between relative">
          <button onClick={handleBack}>
            <i className="ri-arrow-left-double-line text-3xl "></i>
          </button>
          <p className="text-2xl font-semibold">Deposit </p>
          <p className='text-gray-300' onClick={handlehistory}>Deposit history</p>
        </div>
      </header>
    </div>
  )
}

export default DHeader

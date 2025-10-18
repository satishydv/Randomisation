import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom';

const GiftHeader = () => {
    const navigate=useNavigate()

      const handleBack = () => navigate("/activity");

  return (
    <div>
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-2 bg-[#3f3f3f] text-white z-50">
        <div className="px-4 py-2 flex justify-center items-center relative">
          <button onClick={handleBack}>
            <i className="ri-arrow-left-double-line text-3xl absolute left-3 top-3"></i>
          </button>
          <p className="text-2xl font-semibold">Gift</p>
        </div>
      </header>
    </div>
  )
}

export default GiftHeader

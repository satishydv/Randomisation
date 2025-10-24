import React from 'react'
import { useNavigate } from 'react-router-dom';

const Withdrawhistory = () => {
        const navigate=useNavigate()
      const handleBack = () => navigate("/account");
  return (
    <>
    <div>
  <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-2 bg-[#3f3f3f] text-white z-50">
        <div className="px-4 py-2 flex justify-center items-center relative">
          <button onClick={handleBack}>
            <i className="ri-arrow-left-double-line text-3xl absolute left-3 top-3"></i>
          </button>
          <p className="text-2xl font-semibold">Withdraw History</p>
        </div>
      </header>
      
    </div>

    <div className='bg-gradient-to-r mt-18  w-32 flex gap-3  from-[#f2dd9b] to-[#c4933f] rounded py-3 px-9'>
        <i className="ri-microsoft-fill text-amber-600"></i>
        <h1 className='text-amber-600 font-semibold'>All</h1>
    </div>
    </>

  )
}

export default Withdrawhistory

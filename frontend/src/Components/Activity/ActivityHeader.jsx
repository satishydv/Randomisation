import React from 'react'

const ActivityHeader = () => {
  return (
   <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-2 bg-[#3f3f3f] text-white z-50">
      <div className="px-4 py-2  flex justify-center items-center">
        {/* ===== Left Side: Logo + Welcome ===== */}
        <div className="flex flex-col space-y-1">
          <div className="logo">
            <img
              src="https://ossimg.bdgadminbdg.com/IndiaBDG/other/h5setting_202401100608011fs2.png"
              alt="BDG Logo"
              className="h-13 w-auto"
            />
          </div>
          </div>
          </div>
          </header>
  )
}

export default ActivityHeader

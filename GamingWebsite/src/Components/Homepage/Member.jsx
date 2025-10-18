import React from 'react'

const Member = () => {
  return (
  <>
  <div className='w-full max-h-10 px-4 '>

<div className='h-full w-full p-1 mb-3 px-4 flex items-center  rounded bg-gradient-to-r justify-between from-[#f2dd9b] to-[#dbb768] text-black'>
    {/* Left */}
    <div className='flex gap-2 text-black items-center ' >

    <i className="ri-user-2-fill text-2xl"></i>
    <p className='font-semibold'>Member12434 $-1</p>
    </div>
    {/* Right */}
    <div>
        <i className="ri-mail-fill text-2xl"></i>
    </div>

</div>
  </div>
  
  </>
  )
}

export default Member

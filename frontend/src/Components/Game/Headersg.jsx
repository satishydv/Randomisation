import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft,} from 'lucide-react';


const Headersg = () => {

  return (
    <div>
        <header className="p-4 flex items-center justify-between bg-[#3f3f3f] sticky top-0 z-10">
          <Link to="/"><ChevronLeft size={28} /></Link>
          <div className="w-24 h-8 bg-contain bg-no-repeat bg-center" style={{ backgroundImage: `url('https://ossimg.bdgadminbdg.com/IndiaBDG/other/h5setting_20240110060804ufv8.png')` }} />
          <div className='flex gap-2 justify-center items-center'>
            <img src="/newproject/usicon.webp" className='w-8 h-8'/>
            <div className="text-md text-yellow-600">EN </div>
          </div>
        </header>
    </div>
  )
}

export default Headersg

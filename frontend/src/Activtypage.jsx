import React from 'react'
import ActivityHeader from './Components/Activity/ActivityHeader'
import BonusBanner from './Components/Activity/BonusDetails'
import ActivityIcon from './Components/Activity/ActivityIcon '
import ActivityContent from './Components/Activity/ActivityContent'
import ActivitySection from './Components/Activity/ActivitySection'

const Activtypage = () => {
  return (
    <div className='pt-20 bg-black'>
        <ActivityHeader/>
        <BonusBanner/>
        <ActivityIcon/>
        <ActivityContent/>
        <ActivitySection/>
        
        
    
      
    </div>
  )
}

export default Activtypage

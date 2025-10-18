import React from 'react'
import Banner from './Components/Account/Banner'
import WalletDashboardCard from './Components/Account/TotalBalance'
import ServicesBox from './Components/Account/Servicebox'
import SettingsPanel from './Components/Account/SettingsPanel'
import ServiceCenter from './Components/Account/Services'
import Logout from './Components/Account/Logout'

const Accountpage = () => {
  return (
    <div>
        <Banner/>
        <ServicesBox/>
        <SettingsPanel/>
        <ServiceCenter/>
        <Logout/>
      
    </div>
  )
}

export default Accountpage

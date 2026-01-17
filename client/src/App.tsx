// import React from 'react'
import {BrowserRouter as Router, Routes , Route} from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Login from './pages/Login'
import {Toaster} from 'react-hot-toast'
import { ProtectRoute, UnProtectRoute } from './Utils/ProtectRoute'


const App = () => {

  

  return (
    <div className='bg-[url("/bgimage.svg")] bg-contain h-screen w-screen'>
      <Toaster />
    <Router>
      <Routes>
        <Route element={<ProtectRoute/>}>
        <Route index element={ <Home/>}/>
        <Route path='/profile' element={<Profile/> }/>
        </Route>

        <Route element={<UnProtectRoute/>}>
        <Route path='/login' element={<Login/> }/>
        </Route>
      </Routes>
    </Router>
    </div>
  )
}

export default App
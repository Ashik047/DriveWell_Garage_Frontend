import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import LandingLayout from './pages/LandingLayout'
import Home from './pages/Home'
import Services from './pages/Services'
import Reviews from './pages/Reviews'
import Bookings from './pages/Bookings'
import Contact from './pages/Contact'
import Auth from './pages/Auth'
import DashboardLayout from './pages/DashboardLayout'
import DashboardBookings from './pages/DashboardBookings'
import DashboardVehicle from './pages/DashboardVehicle'
import DashboardReviews from './pages/DashboardReviews'
import DashboardProfile from './pages/DashboardProfile'
import DashboardServices from './pages/DashboardServices'
import DashboardBranches from './pages/DashboardBranches'
import DashboardStaffs from './pages/DashboardStaffs'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<Home />} />
          <Route path='services' element={<Services />} />
          <Route path='reviews' element={<Reviews />} />
          <Route path='booking' element={<Bookings />} />
          <Route path='contact' element={<Contact />} />
        </Route>
        <Route path='login' element={<Auth hasAccount />} />
        <Route path='register' element={<Auth />} />
        <Route path='forgot' element={<Auth forgotPassword />} />
        <Route path="/customer-dashboard" element={<DashboardLayout role={"customer"} />}>
          <Route index element={<Navigate to="bookings" replace />} />
          <Route path='bookings' element={<DashboardBookings role={"customer"} />} />
          <Route path='vehicles' element={<DashboardVehicle role={"customer"} />} />
          <Route path='feedbacks' element={<DashboardReviews role={"customer"} />} />
          <Route path='profile' element={<DashboardProfile />} />
        </Route>
        <Route path="/worker-dashboard" element={<DashboardLayout role={"worker"} />}>
          <Route index element={<Navigate to="bookings" replace />} />
          <Route path='bookings' element={<DashboardBookings role={"worker"} />} />
          {/* <Route path='vehicles' element={<DashboardVehicle role={"worker"} />} /> */}
          <Route path='services' element={<DashboardServices role={"worker"} />} />
          <Route path='branches' element={<DashboardBranches role={"worker"} />} />
          <Route path='feedbacks' element={<DashboardReviews role={"worker"} />} />
          <Route path='profile' element={<DashboardProfile />} />
        </Route>
        <Route path="/manager-dashboard" element={<DashboardLayout role={"manager"} />}>
          <Route index element={<Navigate to="bookings" replace />} />
          <Route path='bookings' element={<DashboardBookings role={"manager"} />} />
          <Route path='staffs' element={<DashboardStaffs role={"manager"} />} />
          {/* <Route path='vehicles' element={<DashboardVehicle role={"manager"} />} /> */}
          <Route path='services' element={<DashboardServices role={"manager"} />} />
          <Route path='branches' element={<DashboardBranches role={"manager"} />} />
          <Route path='feedbacks' element={<DashboardReviews role={"manager"} />} />
          <Route path='profile' element={<DashboardProfile />} />
        </Route>
      </Routes >
    </>
  )
}

export default App

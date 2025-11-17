import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
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
import PageNotFound from './pages/PageNotFound'
import PersistLogin from './pages/PersistLogin'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentError from './pages/PaymentError'
import DashboardHome from './pages/DashboardHome'
import Invoice from './pages/Invoice'

function App() {

    return (
        <>
            <Routes>
                <Route path='/login' element={<Auth hasAccount />} />
                <Route path='/register' element={<Auth />} />
                <Route path='/forgot' element={<Auth forgotPassword />} />
                <Route path="/" element={<LandingLayout />}>
                    <Route index element={<Home />} />
                    <Route path='services' element={<Services />} />
                    <Route path='reviews' element={<Reviews />} />
                    <Route path='contact' element={<Contact />} />
                </Route>
                <Route element={<PersistLogin />}>
                    <Route path='/booking' element={<Bookings />} />
                    <Route path='/invoice/:id' element={<Invoice />} />
                    {/* <Route path="/customer-dashboard" element={<DashboardLayout role={"Customer"} />}>
            <Route index element={<Navigate to="bookings" replace />} />
            <Route path='bookings' element={<DashboardBookings role={"Customer"} />} />
            <Route path='vehicles' element={<DashboardVehicle role={"Manager"} />} />
            <Route path='feedbacks' element={<DashboardReviews role={"Customer"} />} />
            <Route path='profile' element={<DashboardProfile />} />
          </Route>
          <Route path="/staff-dashboard" element={<DashboardLayout role={"Staff"} />}>
            <Route index element={<Navigate to="bookings" replace />} />
            <Route path='bookings' element={<DashboardBookings role={"Staff"} />} />
            <Route path='vehicles' element={<DashboardVehicle role={"Staff"} />} />
            <Route path='services' element={<DashboardServices role={"Staff"} />} />
            <Route path='branches' element={<DashboardBranches role={"Staff"} />} />
            <Route path='feedbacks' element={<DashboardReviews role={"Staff"} />} />
            <Route path='profile' element={<DashboardProfile />} />
          </Route> */}
                    <Route path="/dashboard" element={<DashboardLayout />}>
                        <Route index element={<Navigate to="bookings" replace />} />
                        <Route path='bookings' element={<DashboardBookings />} />
                        <Route path='overview' element={<DashboardHome />} />
                        <Route path='staffs' element={<DashboardStaffs />} />
                        <Route path='vehicles' element={<DashboardVehicle />} />
                        <Route path='services' element={<DashboardServices />} />
                        <Route path='branches' element={<DashboardBranches />} />
                        <Route path='feedbacks' element={<DashboardReviews />} />
                        <Route path='profile' element={<DashboardProfile />} />
                    </Route>
                </Route>
                <Route path='/payment-success' element={<PaymentSuccess />} />
                <Route path='/payment-error' element={<PaymentError />} />
                <Route path='*' element={<PageNotFound />} />

            </Routes >
        </>
    )
}

export default App

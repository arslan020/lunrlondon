import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ChauffeurServices from './pages/ChauffeurServices'
import ServiceDetail from './pages/ServiceDetail'
import OurLuxuryFleet from './pages/OurLuxuryFleet'
import Faqs from './pages/Faqs'
import Contact from './pages/Contact'
import Book from './pages/Book'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Destinations from './pages/Destinations'
import NotFound from './pages/NotFound'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'

function App() {
  return (
    <Routes>
      <Route path="admin/login" element={<AdminLogin />} />
      <Route path="admin" element={<AdminDashboard />} />
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="chauffeur-services" element={<ChauffeurServices />} />
        <Route path="chauffeur-services/:slug" element={<ServiceDetail />} />
        <Route path="our-luxury-fleet" element={<OurLuxuryFleet />} />
        <Route path="destinations" element={<Destinations />} />
        <Route path="destinations/:region" element={<Destinations />} />
        <Route path="faqs" element={<Faqs />} />
        <Route path="contact" element={<Contact />} />
        <Route path="book" element={<Book />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App

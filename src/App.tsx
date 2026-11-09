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
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="chauffeur-services" element={<ChauffeurServices />} />
        <Route path="chauffeur-services/:slug" element={<ServiceDetail />} />
        <Route path="our-luxury-fleet" element={<OurLuxuryFleet />} />
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

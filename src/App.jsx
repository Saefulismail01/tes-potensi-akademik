import { Routes, Route } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import DashboardPage from './features/dashboard/DashboardPage'
import Flashcard from './pages/Flashcard'
import Quiz from './pages/Quiz'
import Latihan from './pages/Latihan'

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/flashcard" element={<Flashcard />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/latihan" element={<Latihan />} />
      </Routes>
    </AppLayout>
  )
}

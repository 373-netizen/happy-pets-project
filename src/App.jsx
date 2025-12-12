import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './components/Profile';
import './styles/App.css'

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Dashboard" element={<Dashboard/>} />
            <Route path="/register" element={<Register />} /> 
            <Route path="/login" element={<Login />} /> 
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App

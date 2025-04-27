import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import HeaderWrapper from './components/layout/HeaderWrapper'

// Lazy loaded components
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Chat = lazy(() => import('./pages/Chat'))
const Map = lazy(() => import('./pages/Map'))
const Results = lazy(() => import('./pages/Results'))
const Dashboard = lazy(() => import('./pages/Dashboard'))

function App() {
  return (
    <>
      <HeaderWrapper />
      <Suspense fallback={<div className="flex items-center justify-center h-screen w-screen">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/results" element={<Results />} />

          <Route path="/chat" element={<Chat />} />
          <Route path="/map" element={<Map />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App

import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'

const LazyHome = lazy(() => import('./components/Home/home'));
const LazyBody = lazy(() => import('./components/Body/body'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<LazyHome />} />
          <Route path="/body" element={<LazyBody />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App

import { MemoryRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/home/home';
import Admin from './components/admin/admin';

function App() {
  return (
    // MemoryRouter keeps the routing state in memory (not reflected in the browser's URL)
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </MemoryRouter>
  );
}

export default App;

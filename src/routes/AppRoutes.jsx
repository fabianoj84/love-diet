import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Usuario } from '../pages/Usuario';

export function AppRoutes() {
  console.log("AppRoutes renderizou");
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/usuario/:id" element={<Usuario />} />
    </Routes>
  );
}

import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Usuario } from '../pages/Usuario';
import CsvEquivalencia from '../components/dieta/CsvEquivalencia';
import { Planejador } from '../pages/Planejador';

export function AppRoutes() {
  console.log("AppRoutes renderizou");
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/usuario/:id" element={<Usuario />} />
       <Route path="/config" element={<Home />} />
       <Route path="/planejador" element={<Planejador />} />
       <Route path="/equivalencia" element={<CsvEquivalencia />} />
    </Routes>
  );
}

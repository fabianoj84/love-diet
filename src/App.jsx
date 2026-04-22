import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  console.log("App renderizou - STEP 3 COM ROUTER");
  
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/login/login';
import Layout from './Component/layout/layout';

export function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Login
            onLogin={function (user: any): void {
              throw new Error('Function not implemented.');
            }}
          />
        }
      />
     
    </Routes>
  );
}

export default App;

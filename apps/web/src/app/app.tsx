import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Login from './pages/login/login';
import Layout from './Component/layout/layout';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { UserContext } from './contexts/user-context';
import { useContext, useState, useEffect } from 'react';
import { User } from '@healthcare/data-transfer-types';
import Dashboard from './pages/dashboard/dashboard';
import PageNotFound from './Components/page-not-found/page-not-found';
export function App() {

  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();

  const usercontext=useContext(UserContext);
  console.log('User context:',usercontext);

  const onLogout = async () => {
    localStorage.removeItem('user');
    console.log("logout", user);
    setUser(null);
    navigate("/login");
  }

  const onLogin = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    // setUser(user);
    // console.log("onLogin", user);
    // // navigate("/dashboard");
    // navigate("/selectSociety");
    if (user.HospitalRole?.length === 0) {
      enqueueSnackbar("User does not have a hospital manager role.", { variant: 'warning' });
      navigate("/login");
    } else {
      setUser(user);
      navigate("/selectHospital");
      enqueueSnackbar("Login successfully!", { variant: 'success' });
    }
  }

  useEffect(() => {
    const userFromStorage = localStorage.getItem('user');  
    if (userFromStorage !== null) {
      const user: User = JSON.parse(userFromStorage);     
      setUser(user);                                       
    }
  }, []);
  return (
    <UserContext.Provider value={user}>
    <SnackbarProvider maxSnack={3}>
    <Routes>
    <Route  element={<HopitalLayout/>}>
          <Route path="/" element={<Layout />}>
          <Route path="/login" element={<Login onLogin={onLogin} />} />
          <Route path="/dashboard/:hospitalId" element={<Dashboard />} />
        
      </Route>
          </Route>
           {/* <Route path="/selectSociety" element={<SelectHospital />} /> */}
           <Route path="*" element={<PageNotFound/>}/>
    </Routes>
    </SnackbarProvider>
    </UserContext.Provider>
  );
}

export default App;

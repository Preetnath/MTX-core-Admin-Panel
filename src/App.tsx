import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Router from './router'

function App() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            if (location.pathname === '/' || location.pathname === '/login') {
                navigate('/dashboard');
            }
        } else {
            if (location.pathname !== '/' && location.pathname !== '/register') {
                navigate('/');
            }
        }
    }, [navigate, location.pathname]);

    return (
        <Router />
    )
}

export default App
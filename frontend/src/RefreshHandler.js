import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function RefrshHandler({ setAuthenticated }) {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            setAuthenticated(true);
            if (location.pathname === '/' ||
                location.pathname === '/login' ||
                location.pathname === '/signup'
            ) {
                navigate('/home', { replace: false });
            }
        }
    }, [location, navigate, setAuthenticated])

    return (
        null
    )
}

export default RefrshHandler
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react'

const Protected = ({children}) => {
    const { loading, user, handleLogout } = useAuth()

    if(loading){
        return (<main><h1>Loading...</h1></main>)
    }

    if(!user){
        return <Navigate to={'/login'} />
    }
    
    return (
        <div className="app-container">
            <header className="main-navbar">
                <div className="navbar-logo" onClick={() => window.location.href = "/"}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: "8px", color: "#ff2d78"}}><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                    <span>Interview AI</span>
                </div>
                <div className="navbar-user">
                    <span className="user-greeting">Hi, {user.username}!</span>
                    <button className="logout-btn" onClick={handleLogout}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: "6px"}}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Logout
                    </button>
                </div>
            </header>
            <div className="page-content">
                {children}
            </div>
        </div>
    )
}

export default Protected
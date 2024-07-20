import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'

export const FooterComp = () => {
    return (
        <footer className="footer mt-auto py-3 bg-light" id='a'>
            <div className="container d-flex justify-content-between align-items-center">
            <span className="text-muted">
                    © 2024 Community Assistance Platform | Empowering Neighbors, Strengthening Communities | Created with ❤️ by Ami Nice
                </span>
                <Link to="/about" className="text-muted text-decoration-none" id='about-link'>
                    About Community... 
                </Link>
            </div>
        </footer>
    );
};

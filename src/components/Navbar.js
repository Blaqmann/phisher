// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="navbar">
            <Link to="/" className="logo">Fijabi Phisher</Link>
            <div className="menu-toggle" onClick={toggleMenu}>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div className={`menu ${isOpen ? 'active' : ''}`}>
                <Link to="/" className="link">Home</Link>
                <Link to="/about" className="link">About</Link>
            </div>
        </nav>
    );
};

export default Navbar;

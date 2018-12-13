import './Logo.css';
import React from 'react';
import { Link } from 'react-router-dom'

import imgLogo from '../../assets/imgs/logo160px.png';

export default props => (
    <aside className="logo">
        <Link to="/" className="logo">
            <img src={imgLogo} alt="logo" />
        </Link>
    </aside>
);


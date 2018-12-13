import './Nav.css';
import React from 'react';
import { Link } from 'react-router-dom';

export default props => (
    <aside className="menu-area">
        <nav className="menu">
            <Link to="/veiculos">
                <div>
                    <i className="fa fa-car"></i> 
                    Veículos
                </div>
            </Link>
            <Link to="/cadastrosbasicos">
                <div>
                    <i className="fa fa-book"></i> 
                    Cadastros Básicos
                </div>
            </Link>
            <Link to="/parametros">
                <div>
                    <i className="fa fa-cogs"></i> 
                    Parâmetros
                </div>
            </Link>
        </nav>
    </aside>
);


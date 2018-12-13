import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Main from '../templates/Main';
import './CadastrosBasicos.css';

class CadastrosBasicos extends Component {
    render() {
        return (
            <div>
                <Main>
                    <h2 className="mt-3">
                        <i className='fa fa-book'></i> Cadastros Básicos
                    </h2>
                    <hr />
                    <div className="cadboxmenu row">
                            <div className="col-6 col-md-12">
                                <h3>Veículos</h3>
                                <hr />
                            </div>
                            <div className=" col-12 col-md-12 ml-5">
                                <div className="m-2">
                                    <Link to="/cadastrosbasicos/aros">
                                        <div>
                                            <p>Aros</p>
                                        </div>
                                    </Link>
                                </div>
                                <div className="m-2">
                                    <Link to="/cadastrosbasicos/itemmanutencao">
                                        <div>
                                            <p>Itens de Manutenção</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                    </div>
                </Main>
                <div style={{ marginBottom: 50 }} />
            </div>
        );
    }
}

const mapStateToProps = () => ({
});

export default connect(mapStateToProps, {
})(CadastrosBasicos);


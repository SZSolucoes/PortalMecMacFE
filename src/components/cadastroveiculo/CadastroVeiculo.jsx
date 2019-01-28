import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import scrollToComponent from 'react-scroll-to-component';
import CadastroCarroForm from './CadastroVeiculoForm';
import './CadastroVeiculoStyle.css';

class CadastroVeiculo extends Component {

    constructor(props) {
        super(props);

        this.scrollToCadTop = this.scrollToCadTop.bind(this);
        this.getModalTitle = this.getModalTitle.bind(this);
        this.getIconTitle = this.getIconTitle.bind(this);
    }

    scrollToCadTop() {
        const options = { offset: 0, align: 'middle', duration: 1500, ease:'inCirc' };
        scrollToComponent(this.textCadProp, options);
    }

    getModalTitle() {
        if (this.props.formType === '2') {
            switch(this.props.formVeiculoType) {
                case '1': return 'Modificar - Carro'
                case '2': return 'Modificar - Moto'
                case '3': return 'Modificar - Caminhão'
                default: return ''
            }
        } else {
            switch(this.props.formVeiculoType) {
                case '1': return 'Cadastro de Carros'
                case '2': return 'Cadastro de Motos'
                case '3': return 'Cadastro de Caminhões'
                default: return ''
            }
        }
    }

    getIconTitle() {
        switch(this.props.formVeiculoType) {
            case '1': return 'car'
            case '2': return 'motorcycle'
            case '3': return 'truck'
            default: return 'car'
        }
    }

    render() {
        return (
            <div>
                <div 
                    className="modal fade" 
                    id="cadveiculo" 
                    tabIndex="-1" 
                    role="dialog" 
                    aria-labelledby="exampleModalLabel" 
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-auto-size" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2 className="mt-3" ref={(ref) => { this.textCadProp = ref; }}>
                                    <FontAwesomeIcon icon={this.getIconTitle()}/> {this.getModalTitle()}
                                </h2>
                            </div>
                            <div className="modal-body">
                                <React.Fragment>
                                    <div className="p-3 mt-3">
                                        <CadastroCarroForm />
                                    </div>
                                </React.Fragment>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    formType: state.CadastroVeiculoReducer.formType,
    formVeiculoType: state.CadastroVeiculoReducer.formVeiculoType
});

export default connect(mapStateToProps, {

})(CadastroVeiculo);
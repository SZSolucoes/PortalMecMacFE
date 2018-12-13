import React from 'react'
import { connect } from 'react-redux';
import VeiculosTabs from './VeiculosTabs';
import './Veiculos.css'
import "react-tabs/style/react-tabs.css";

import CadastroVeiculo from '../cadastroveiculo/CadastroVeiculo';
import CPManual from '../veiculos/cpmanual/CPManual';

class Veiculos extends React.Component {

    render() {
        return (
            <div style={{ marginBottom: 100 }}>
                <VeiculosTabs />
                <CadastroVeiculo />
                <CPManual />
            </div>
        );
    }
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps, {})(Veiculos);


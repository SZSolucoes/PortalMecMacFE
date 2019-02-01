import 'font-awesome/css/font-awesome.min.css';
import './App.css';
import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
    faCar,
    faTruck,
    faMotorcycle,
    faToolbox,
    faTrash
} from '@fortawesome/free-solid-svg-icons'
import SocketIO from 'socket.io-client';

import Routes from './Routes';
import Nav from '../components/templates/Nav';
import Footer from '../components/templates/Footer';
import Messages from '../components/msg/Messages';
import SimpleModal from './SimpleModal';
import ConfirmModal from './ConfirmModal';

import { 
    consultarTabelaDeReferencia
} from '../components/utils/fipeApi';
import { 
    doFetchVehicle
} from '../components/utils/UtilsActions';

import { store } from '../index';
import { BASEURLEX } from '../components/utils/urls';
import { refreshVehicle } from '../components/cadastroveiculo/CadastroVeiculoActions';

export const socket = SocketIO(BASEURLEX);

class App extends Component {

    constructor(props) {
        super(props);

        library.add([
            faCar,
            faTruck,
            faMotorcycle,
            faToolbox,
            faTrash
        ]);
    }

    componentDidMount() {
        socket.on('connect', data => {
            console.log('socket connected');
        });

        socket.on('disconnect', () => {
            console.log('socket disconnected');
        });

        const funExec = async () => {
            const fipeTabRef = await consultarTabelaDeReferencia();
            if (fipeTabRef.success) {
                store.dispatch({
                    type: 'modify_fipetabref_cadastroveiculo',
                    payload: fipeTabRef.data
                });
            }

            const carros = await doFetchVehicle({ vehicletype: '1' });
            if (carros && carros.success) {
                store.dispatch({
                    type: 'modify_listcarros_veiculos',
                    payload: carros.data
                });
            }

            const bikes = await doFetchVehicle({ vehicletype: '2' });
            if (bikes && bikes.success) {
                store.dispatch({
                    type: 'modify_listmotos_veiculos',
                    payload: bikes.data
                });
            }

            const trucks = await doFetchVehicle({ vehicletype: '3' });
            if (trucks && trucks.success) {
                store.dispatch({
                    type: 'modify_listcaminhoes_veiculos',
                    payload: trucks.data
                });
            }
        };

        funExec();

        socket.on('table_veiculos_changed', data => {
            if (data) {
                funExec();
            }
        });
    }

    render() {
        return (
            <BrowserRouter>
                <div className="app">
                    <Nav />
                    <Routes />
                    <Footer />
                    <Messages />
                    <SimpleModal />
                    <ConfirmModal />
                </div>
            </BrowserRouter>
        );
    }   
}

export default connect(() => ({}), {})(App);



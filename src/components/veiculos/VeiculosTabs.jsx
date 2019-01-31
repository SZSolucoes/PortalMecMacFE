import React from 'react'
import { connect } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Main from '../templates/Main';
import './VeiculosTabs.css'
import 'react-tabs/style/react-tabs.css';

import { socket } from '../../main/App';
import { refreshVehicle } from '../cadastroveiculo/CadastroVeiculoActions';
import imgCar from '../../assets/imgs/car.png';
import imgTruck from '../../assets/imgs/truck.png';
import imgBike from '../../assets/imgs/bike.png';
import CarTab from './CarTab';
import TruckTab from './TruckTab';
import BikeTab from './BikeTab';
import { store } from '../..';

class VeiculosTabs extends React.Component {
    componentDidMount() {
        socket.on('table_veiculos_changed', data => {
            if (data) {
                refreshVehicle(data.toString());
            }
        });
    }

    componentWillUnmount() {
        socket.off('table_veiculos_changed');
    }

    render() {
        return (
            <Main>
                <Tabs
                    selectedIndex={this.props.selectedIndex}
                    onSelect={(index) => {
                        store.dispatch({
                            type: 'modify_selectedindex_veiculos',
                            payload: index
                        })
                    }}
                >
                    <TabList>
                        <Tab>
                            <div className="row" style={{ paddingRight: 30 }}>
                                <img src={imgCar} alt="cartab" className='tabheader' />
                                <h6 style={{ alignSelf: 'flex-end' }}><b>Carros e utilitários pequenos</b></h6>
                            </div>
                        </Tab>
                        <Tab>
                            <div className="row" style={{ paddingRight: 30 }}>
                                <img src={imgTruck} alt="trucktab" className='tabheader' />
                                <h6 style={{ alignSelf: 'flex-end' }}><b>Caminhões e Micro-ônibus</b></h6>
                            </div>
                        </Tab>
                        <Tab>
                            <div className="row" style={{ paddingRight: 30 }}>
                                <img src={imgBike} alt="biketab" className='tabheader' />
                                <h6 style={{ alignSelf: 'flex-end' }}><b>Motos</b></h6>
                            </div>
                        </Tab>
                    </TabList>
                    <TabPanel>
                        <CarTab />
                    </TabPanel>
                    <TabPanel>
                        <TruckTab />
                    </TabPanel>
                    <TabPanel>
                        <BikeTab />
                    </TabPanel>
                </Tabs>
            </Main>
        );
    }
}

const mapStateToProps = (state) => ({
    selectedIndex: state.VeiculosReducer.selectedIndex
});

export default connect(mapStateToProps, {
})(VeiculosTabs);


import React from 'react'
import { connect } from 'react-redux';
import { reset, change } from 'redux-form';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import _ from 'lodash';
import Main from '../templates/Main';
import 'react-tabs/style/react-tabs.css';

import { store } from '../../index';

import Manutencao from './manutencao/Manutencao';
import Aros from './aros/Aros';

import { socket } from '../../main/App';
import { doGetDataTableItemManutencao } from '../cadastrosbasicos/itemmanutencao/ItemManutencaoActions';
import { doGetDataTableCBAros, doGetDataTableCBArosSub } from '../cadastrosbasicos/aros/CBArosActions';
import { doGetManutencao, modifyCleanManutencao } from './manutencao/ManutencaoActions';
import { doGetCompAros, modifyCleanAros } from './aros/ArosActions';

import './ComplementosTabs.css';

class ComplementosTabs extends React.Component {

    componentDidMount() {
        // ########################### MANUTENCAO ######################################
        const asyncfunExecGetManutencao = async () => {
            const vehicle = { ...this.props.item };
            if (typeof vehicle === 'object' && Object.keys(vehicle).length) {
                if (vehicle.vehicletype) {
                    let keyTable = {};
                    if (vehicle.vehicletype === '1') {
                        keyTable.idcar = vehicle.id
                    } else if (vehicle.vehicletype === '2') {
                        keyTable.idbike = vehicle.id
                    } else if (vehicle.vehicletype === '3') {
                        keyTable.idtruck = vehicle.id
                    }
    
                    const dataTableManutencao = await doGetManutencao({
                        ...keyTable
                    });
                    
                    if (dataTableManutencao && dataTableManutencao.success) {
                        store.dispatch({
                            type: 'modify_datatablemanutencao_manutencao',
                            payload: dataTableManutencao.data
                        });
                    }
                }
            }
        }

        asyncfunExecGetManutencao();

        const asyncFunExec = async () => {
            const dataTable = await doGetDataTableItemManutencao();
            if (dataTable && dataTable.success) {
                store.dispatch({
                    type: 'modify_itemmanutencaocombo_manutencao',
                    payload: dataTable.data
                });
                
                if (dataTable.data[0] && dataTable.data[0].item) {
                    store.dispatch(change('manutencao', 'itemmanut', dataTable.data[0].item)); 
                }
            }
        }

        asyncFunExec();

        // ###################################################################################

        // ########################## AROS ###################################################
        const asyncfunExecGetCompAros = async () => {
            const vehicle = { ...this.props.item };
            if (typeof vehicle === 'object' && Object.keys(vehicle).length) {
                if (vehicle.vehicletype) {
                    let keyTable = {};
                    if (vehicle.vehicletype === '1') {
                        keyTable.idcar = vehicle.id
                    } else if (vehicle.vehicletype === '2') {
                        keyTable.idbike = vehicle.id
                    } else if (vehicle.vehicletype === '3') {
                        keyTable.idtruck = vehicle.id
                    }
    
                    const dataTableAros = await doGetCompAros({
                        ...keyTable
                    });
                    
                    if (dataTableAros && dataTableAros.success) {
                        store.dispatch({
                            type: 'modify_datatablearos_aros',
                            payload: dataTableAros.data
                        });
                    }
                }
            }
        }

        asyncfunExecGetCompAros();

        const asyncFunExecComboAros = async () => {
            const vehicle = { ...this.props.item };
            if (typeof vehicle === 'object' && Object.keys(vehicle).length) {
                const dataTable = await doGetDataTableCBAros();
                if (dataTable && dataTable.success) {
                    const filterVType = _.filter(dataTable.data, item => item.vehicletype === vehicle.vehicletype);
                    store.dispatch({
                        type: 'modify_arocombo_aros',
                        payload: filterVType
                    });
                    if (filterVType.length) {
                        store.dispatch(change('aros', 'arocombo', filterVType[0].aro));
                        const dataTableArosSub = await doGetDataTableCBArosSub({ idaro: filterVType[0].id });
                        if (dataTableArosSub && dataTableArosSub.success) {
                            store.dispatch({
                                type: 'modify_arosubcombo_aros',
                                payload: dataTableArosSub.data
                            });
                            
                            if (dataTableArosSub.data[0] && dataTableArosSub.data[0].subcat) {
                                store.dispatch(change('aros', 'arosubcombo', dataTableArosSub.data[0].subcat));
                            }
                        }
                    }
                }
            }
        }

        asyncFunExecComboAros();

        // ###################################################################################

        socket.on('table_manutencao_changed', data => {
            if (data && data === 'true') {
                asyncfunExecGetManutencao();
            }
        });

        socket.on('table_comparos_changed', data => {
            if (data && data === 'true') {
                asyncfunExecGetCompAros();
            }
        });

        socket.on('table_itemmanutencao_changed', data => {
            if (data && data === 'true') {
                asyncFunExec();
            }
        });
    }

    componentWillUnmount() {
        socket.off('table_manutencao_changed');
        socket.off('table_comparos_changed');
        socket.off('table_itemmanutencao_changed');
        reset('manutencao');
        reset('aros');
        this.props.modifyCleanManutencao();
        this.props.modifyCleanAros();
    }

    render() {
        const fipemesanoFldValue = this.props.item.fipeperiodoref || '';
        const FldValue = this.props.item.marca || '';
        const modeloFldValue = this.props.item.modelo || '';
        const anoFldValue = this.props.item.ano || '';
        const combustivelFldValue = this.props.item.combustivel || '';

        return (
            <div id='complementosmain'>
                <div>
                    <Main>
                        <h3>Complementos - Veículo</h3>
                        <hr />
                        <div className='row'>
                            <div className='col-12 col-md-3 col-lg-2'>
                                <div className='form-group'>
                                    <label htmlFor='fipemesano'>Fipe Mês/Ano</label>
                                    <input
                                        type='text'
                                        className='form-control' 
                                        name='fipemesano'
                                        disabled
                                        value={fipemesanoFldValue}
                                    />
                                </div>
                            </div>
                            <div className='col-12 col-md-3 col-lg-2'>
                                <div className='form-group'>
                                    <label htmlFor='marca'>Marca</label>
                                    <input
                                        type='text'
                                        className='form-control' 
                                        name='marca'
                                        disabled
                                        value={FldValue}
                                    />
                                </div>
                            </div>
                            <div className='col-12 col-md-6 col-lg-4'>
                                <div className='form-group'>
                                    <label htmlFor='modelo'>Modelo</label>
                                    <input
                                        type='text' 
                                        className='form-control' 
                                        name='modelo'
                                        disabled
                                        value={modeloFldValue}
                                    />
                                </div>
                            </div>
                            <div className='col-12 col-md-4 col-lg-2'>
                                <div className='form-group'>
                                    <label htmlFor='ano'>Ano</label>
                                    <input
                                        type='text' 
                                        className='form-control' 
                                        name='ano'
                                        disabled
                                        value={anoFldValue}
                                    />
                                </div>
                            </div>
                            <div className='col-12 col-md-4 col-lg-2'>
                                <div className='form-group'>
                                    <label htmlFor='combustivel'>Combustível</label>
                                    <input 
                                        type='text' 
                                        className='form-control' 
                                        name='combustivel'
                                        disabled
                                        value={combustivelFldValue}
                                    />
                                </div>
                            </div>
                        </div>
                    </Main>
                </div>
                <Main>
                    <Tabs>
                        <TabList>
                            <Tab style={{ paddingLeft: 30, paddingRight: 30, paddingTop: 15 }}>
                                <h6 style={{ alignSelf: 'flex-end' }}><b>Manutenção</b></h6>
                            </Tab>
                            <Tab style={{ paddingLeft: 30, paddingRight: 30, paddingTop: 15 }}>
                                <h6 style={{ alignSelf: 'flex-end' }}><b>Aros</b></h6>
                            </Tab>
                        </TabList>
                        <TabPanel>
                            <Manutencao />
                        </TabPanel>
                        <TabPanel>
                            <Aros />
                        </TabPanel>
                    </Tabs>
                </Main>
                <div style={{ marginBottom: 50 }} />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    item: state.ComplementosReducer.item
});

export default connect(mapStateToProps, {
    modifyCleanManutencao,
    modifyCleanAros
})(ComplementosTabs);


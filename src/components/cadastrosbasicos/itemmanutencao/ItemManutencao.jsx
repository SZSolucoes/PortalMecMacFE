import React, { Component } from 'react';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import Main from '../../templates/Main';
import ItemManutencaoTable from './ItemManutencaoTable';
//import ItemManutencaoTableV from './ItemManutencaoTableV';
import { socket } from '../../../main/App';
import { store } from '../../../index';
import { doGetDataTableItemManutencao } from './ItemManutencaoActions';

import './ItemManutencao.css';
import VincularModal from './vinculo/VincularModal';
import ItemManutencaoMdf from './modals/ItemManutencaoMdf';

class ItemManutencao extends Component {
    constructor(props) {
        super(props);

        this.setSuperState = this.setSuperState.bind(this);

        this.state = {
            selectedItemManutRowId: ''
        }
    }
    
    componentDidMount() {
        const asyncFunExec = async () => {
            const dataTable = await doGetDataTableItemManutencao();
            if (dataTable && dataTable.success) {
                store.dispatch({
                    type: 'modify_datatableitemmanutencao_itemmanutencao',
                    payload: dataTable.data
                });
            }
        }

        asyncFunExec();

        socket.on('table_itemmanutencao_id', data => {
            if (data && data >= 0) {
                store.dispatch(change('itemmanutencaotableform', 'id', data));
            }
        });

        socket.on('table_itemmanutencao_changed', data => {
            if (data && data === 'true') {
                asyncFunExec()
            }
        });
    }

    componentWillUnmount() {
        socket.off('table_itemmanutencao_id');
        socket.off('table_itemmanutencao_changed');
        store.dispatch({
            type: 'modify_clean_itemmanutencao'
        });
    }

    setSuperState(newState) {
        this.setState({ ...newState });
    }

    render() {
        return (
            <div>
                <Main>
                    <h2 className="mt-3">
                        Itens de Manutenção
                    </h2>
                    <hr />
                    <div className='maintablesvincular'>
                        <div style={{ flex: 1 }}>
                            <div style={{ paddingLeft: 20, paddingRight: 20 }}>
                                <ItemManutencaoTable
                                    setSuperState={this.setSuperState}
                                    data={this.props.dataTableItemManutencao} 
                                />
                            </div>
                        </div>
                        {/* <div style={{ flex: 1 }}>
                            <Main>
                                <h4>Veículos</h4>
                                <hr />
                                <div style={{ paddingLeft: 20, paddingRight: 20 }}>
                                    <ItemManutencaoTableV 
                                        data={this.props.dataTableVehicles}
                                        selectedItemManutRowId={this.state.selectedItemManutRowId}
                                    />
                                </div>
                            </Main>

                        </div> */}
                    </div>
                </Main>
                <div style={{ marginBottom: 50 }} />
                <VincularModal />
                <ItemManutencaoMdf />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    dataTableItemManutencao: state.ItemManutencaoReducer.dataTableItemManutencao,
    dataTableVehicles: state.ItemManutencaoReducer.dataTableVehicles
});

export default connect(mapStateToProps, {
})(ItemManutencao);


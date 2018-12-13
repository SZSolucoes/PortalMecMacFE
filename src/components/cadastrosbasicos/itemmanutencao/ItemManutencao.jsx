import React, { Component } from 'react';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import Main from '../../templates/Main';
import ItemManutencaoTable from './ItemManutencaoTable';
import { socket } from '../../../main/App';
import { store } from '../../../index';
import { doGetDataTableItemManutencao } from './ItemManutencaoActions';

import './ItemManutencao.css';

class ItemManutencao extends Component {
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
    }

    render() {
        return (
            <div>
                <Main>
                    <h2 className="mt-3">
                        Itens de Manutenção
                    </h2>
                    <hr />
                    <div style={{ padding: 20 }}>
                        <ItemManutencaoTable data={this.props.dataTableItemManutencao} />
                    </div>
                </Main>
                <div style={{ marginBottom: 50 }} />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    dataTableItemManutencao: state.ItemManutencaoReducer.dataTableItemManutencao
});

export default connect(mapStateToProps, {
})(ItemManutencao);


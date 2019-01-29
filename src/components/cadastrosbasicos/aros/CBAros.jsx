import React, { Component } from 'react';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import Main from '../../templates/Main';
import CBArosTable from './CBArosTable';
import CBArosSubTable from './CBArosSubTable';
import { socket } from '../../../main/App';
import { store } from '../../../index';
import { doGetDataTableCBAros } from './CBArosActions';
import CBArosMdf from './modals/CBArosMdf';

import './CBAros.css';

class CBAros extends Component {

    constructor(props) {
        super(props);

        this.setSuperState = this.setSuperState.bind(this);

        this.state = {
            selectedAroRowId: ''
        }
    }

    componentDidMount() {
        const asyncFunExec = async () => {
            const dataTable = await doGetDataTableCBAros();
            if (dataTable && dataTable.success) {
                store.dispatch({
                    type: 'modify_datatablecbaros_cbaros',
                    payload: dataTable.data
                });
            }
        }

        asyncFunExec();

        socket.on('table_aros_id', data => {
            if (data && data >= 0) {
                store.dispatch(change('cbarostableform', 'id', data));
            }
        });

        socket.on('table_aros_changed', data => {
            if (data && data === 'true') {
                asyncFunExec()
            }
        });

    }

    componentWillUnmount() {
        socket.off('table_aros_id');
        socket.off('table_aros_changed');
        store.dispatch({
            type: 'modify_clean_cbaros'
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
                        Cadastro de Aros
                    </h2>
                    <hr />
                    <div className='maintablescbaros'>
                        <div style={{ flex: 1.6 }}>
                            <Main>
                                <h4>Aros</h4>
                                <hr />
                                <div style={{ paddingLeft: 20, paddingRight: 20 }}>
                                    <CBArosTable
                                        setSuperState={this.setSuperState}
                                        data={this.props.dataTableCBAros} 
                                    />
                                </div>
                            </Main>
                        </div>
                        <div style={{ flex: 1 }}>
                            <Main>
                                <h4>Sub-categorias</h4>
                                <hr />
                                <div style={{ paddingLeft: 20, paddingRight: 20 }}>
                                    <CBArosSubTable 
                                        data={this.props.dataTableCBArosSub}
                                        selectedAroRowId={this.state.selectedAroRowId} 
                                    />
                                </div>
                            </Main>
                        </div>
                    </div>
                </Main>
                <div style={{ marginBottom: 50 }} />
                <CBArosMdf />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    dataTableCBAros: state.CBArosReducer.dataTableCBAros,
    dataTableCBArosSub: state.CBArosReducer.dataTableCBArosSub
});

export default connect(mapStateToProps, {
})(CBAros);


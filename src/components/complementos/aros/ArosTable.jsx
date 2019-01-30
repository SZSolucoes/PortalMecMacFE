import React, { Component } from 'react';
import { connect } from 'react-redux';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { onMount, onUnmount } from 'react-keydown/es/event_handlers';
import { setBinding, /*Keys as KeyDownKeys*/ } from 'react-keydown';
//import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import ToolkitProvider, { CSVExport, Search } from 'react-bootstrap-table2-toolkit';
import { change } from 'redux-form';
import _ from 'lodash';

import { modifyModalTitle, modifyModalMessage, modifyExtraData } from '../../utils/UtilsActions';
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"
import { store } from '../../..';

class ManutencaoTable extends Component {
    constructor(props) {
        super(props);

        this.handleOnSelect = this.handleOnSelect.bind(this);
        this.onKeyUpOrDown = this.onKeyUpOrDown.bind(this);
        this.onClickRemover = this.onClickRemover.bind(this);
        this.onClickModify = this.onClickModify.bind(this);

        this.state = {
            selectRow: {
                mode: 'radio',
                clickToSelect: true,
                bgColor: '#007BFF',
                hideSelectColumn: true,
                style: { color: 'white' },
                onSelect: this.handleOnSelect,
                selected: [''],
                selectedRow: {}
            }
        };
    }

    componentDidMount() {
        onMount(this);
    }

    componentWillUnmount() {
        onUnmount(this);
    }

    componentDidUpdate(prevProps) {
        const { itemsAro, refreshTable } = this.props;
        const { selectedRow } = this.state.selectRow;
        const indexFounded = _.findIndex(itemsAro, ita => ita.id === selectedRow.id);

        let newSelectedRow = selectedRow;

        if (
            refreshTable && 
            indexFounded !== -1 &&
            !_.isEqual(itemsAro[indexFounded], prevProps.itemsAro[indexFounded])
        ) {
            newSelectedRow = { ...itemsAro[indexFounded] };
            store.dispatch({
                type: 'modify_refreshtable_aros',
                payload: false
            });

            this.setState({ 
                selectRow: { 
                    ...this.state.selectRow, 
                    selected: [newSelectedRow.id], 
                    selectedRow: newSelectedRow
                } 
            });
        }
    }

    onKeyUpOrDown(event) {
        //console.log(event);
    }

    onClickModify() {
        if (this.state.selectRow.selected[0]) {
            const { selectedRow } = this.state.selectRow;

            store.dispatch(change('arosmdfform', 'id', selectedRow.id));
            store.dispatch(change('arosmdfform', 'arocombo', selectedRow.aro));
            store.dispatch(change('arosmdfform', 'arosubcombo', selectedRow.subcat));
            store.dispatch({
                type: 'modify_formvalues_aros',
                payload: selectedRow
            });

            this.arosMdfModalRef.click();
        }
    }

    onClickRemover() {
        if (this.state.selectRow.selected[0]) {
            this.props.modifyModalTitle('Remover');
            this.props.modifyModalMessage('Confirma a remoção do registro selecionado ?');
            this.props.modifyExtraData({ 
                item: { id: this.state.selectRow.selected[0] }, 
                action: 'remove_comparostable' 
            });
            this.arostableBtnConfirmModalRef.click();
        }
    }

    handleOnSelect(row, isSelect, rowIndex, e) {
        if (isSelect) {
            this.setState({ 
                selectRow: { 
                    ...this.state.selectRow, 
                    selected: [row.id], 
                    selectedRow: row
                }
            });
            this.props.onSuperChangeState({
                refreshValue: row.aro,
                refreshValueSub: row.subcat,
            });
        } else {
            this.setState({ 
                selectRow: { 
                    ...this.state.selectRow, 
                    selected: [''], 
                    selectedRow: {}
                },
            });
        }
    }

    render() {
        const { columns, itemsAro } = this.props;
        const dataTable = itemsAro || [];
        const columnsTable = columns || [
            {
                dataField: 'id',
                text: 'id',
                sort: true,
                hidden: true,
                csvExport: false
            }, 
            {
                dataField: 'aro',
                text: 'Aro',
                sort: true,
                headerStyle: { textAlign: 'left' },
                style: { textAlign: 'left' }
            }, 
            {
                dataField: 'subcat',
                text: 'Sub-categoria',
                sort: true,
                headerStyle: { textAlign: 'left' },
                style: { textAlign: 'left' }
            }
        ];
        return (
            <React.Fragment>
                <ToolkitProvider
                    keyField={'id'} 
                    data={dataTable} 
                    columns={columnsTable}
                    exportCSV={ {
                        fileName: 'complementosaros.csv',
                        noAutoBOM: false,
                        separator: ';'
                    }}
                    search
                >
                    {
                        props => (
                            <div>
                                <div className='arostabletools'>
                                    <div style={{ flex: 3 }}>
                                        <button 
                                            className="btn btn-danger"
                                            onClick={() => this.onClickRemover()}
                                            style={{ 
                                                marginRight: 10,
                                                marginTop: 5
                                            }}
                                        >
                                            Remover
                                        </button>
                                        <button 
                                            className="btn btn-dark"
                                            onClick={() => this.onClickModify()}
                                            style={{ 
                                                marginRight: 10,
                                                marginTop: 5
                                            }}
                                        >
                                            Modificar
                                        </button>
                                        <button
                                            ref={ref => (this.arostableBtnConfirmModalRef = ref)}
                                            hidden
                                            data-toggle="modal" data-target="#confirmmodal"
                                            data-backdrop="static" data-keyboard="false"
                                        />
                                        <button
                                            ref={ref => (this.arosMdfModalRef = ref)}
                                            hidden
                                            data-toggle="modal" data-target="#arosmdf"
                                            data-backdrop="static" data-keyboard="false"
                                        />
                                        <CSVExport.ExportCSVButton 
                                            { ...props.csvProps }
                                            className="btn btn-secondary"
                                            style={{
                                                color: 'white',
                                                marginTop: 5
                                            }}
                                        >
                                            Exportar CSV
                                        </CSVExport.ExportCSVButton>
                                    </div>
                                    <div 
                                        style={{ 
                                            flex: 1,
                                            marginTop: 5
                                        }}
                                    >
                                        <Search.SearchBar { ...props.searchProps } placeholder="Buscar..."/>
                                    </div>
                                </div>
                                <BootstrapTable
                                    
                                    { ...props.baseProps } 
                                    selectRow={this.state.selectRow}
                                    pagination={paginationFactory()}
                                    bordered={ false }
                                    striped
                                    condensed
                                    wrapperClasses="arostable"
                                    //filter={filterFactory()}
                                    exportCsv
                                    bootstrap4
                                    defaultSorted={
                                        [{
                                            dataField: 'id',
                                            order: 'desc'
                                        }]
                                    }
                                />
                            </div>
                        )
                    }
                </ToolkitProvider>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    refreshTable: state.ArosReducer.refreshTable
});

setBinding({
    target: ManutencaoTable.prototype,
    fn: ManutencaoTable.prototype.onKeyUpOrDown,
    keys: [ /*KeyDownKeys.UP, KeyDownKeys.DOWN*/ ]
});

export default connect(mapStateToProps, {
    modifyModalTitle, 
    modifyModalMessage, 
    modifyExtraData
})(ManutencaoTable);


import React, { Component } from 'react';
import { connect } from 'react-redux';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { onMount, onUnmount } from 'react-keydown/es/event_handlers';
import { setBinding, /*Keys as KeyDownKeys*/ } from 'react-keydown';
import { change } from 'redux-form';
import _ from 'lodash';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import ToolkitProvider, { CSVExport, Search } from 'react-bootstrap-table2-toolkit';

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
        const { itemsManut, isRefreshManut } = this.props;
        const { selectedRow } = this.state.selectRow;
        const indexFounded = _.findIndex(itemsManut, itm => itm.id === selectedRow.id);

        let newSelectedRow = selectedRow;

        if (isRefreshManut &&
            indexFounded !== -1 &&
            !_.isEqual(itemsManut[indexFounded], prevProps.itemsManut[indexFounded])
        ) {
            newSelectedRow = { ...itemsManut[indexFounded] };
            store.dispatch({
                type: 'modify_isrefreshmanut_manutencao',
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

            store.dispatch(change('manutmdfitemform', 'id', selectedRow.id));
            store.dispatch(change('manutmdfitemform', 'itemabrev', selectedRow.itemabrev));
            store.dispatch(change('manutmdfitemform', 'itemmanut', selectedRow.itemmanut));
            store.dispatch(change('manutmdfitemform', 'mes', selectedRow.mes));
            store.dispatch(change('manutmdfitemform', 'milhas', selectedRow.milhas));
            store.dispatch(change('manutmdfitemform', 'km', selectedRow.quilometros));
            store.dispatch(change('manutmdfitemform', 'manutencao', selectedRow.tipomanut));
            store.dispatch({
                type: 'modify_formvaluesitemmanut_manutencao',
                payload: selectedRow
            });

            this.manutMdfItemModalRef.click();
        }

    }

    onClickRemover() {
        if (this.state.selectRow.selected[0]) {
            this.props.modifyModalTitle('Remover');
            this.props.modifyModalMessage('Confirma a remoção do registro selecionado ?');
            this.props.modifyExtraData({ 
                item: { id: this.state.selectRow.selected[0] }, 
                action: 'remove_manutencaotable' 
            });
            this.manutencaotableBtnConfirmModalRef.click();
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
        } else {
            this.setState({ 
                selectRow: { 
                    ...this.state.selectRow, 
                    selected: [''], 
                    selectedRow: {}
                }
            });
        }
    }

    render() {
        const { columns, itemsManut } = this.props;
        const dataTable = itemsManut || [];

        const columnsTable = columns || [
            {
                dataField: 'id',
                text: 'id',
                sort: true,
                hidden: true,
                csvExport: false
            }, 
            {
                dataField: 'itemabrev',
                text: 'Nome Abrev.',
                sort: true,
                headerStyle: { textAlign: 'left' },
                style: { textAlign: 'left', overflow: 'auto' },
                filter: textFilter({
                    placeholder: 'Filtrar...',
                    delay: 0
                })
            }, 
            {
                dataField: 'itemmanut',
                text: 'Item Manutenção',
                sort: true,
                headerStyle: { textAlign: 'left' },
                style: { textAlign: 'left', overflow: 'auto' },
                filter: textFilter({
                    placeholder: 'Filtrar...',
                    delay: 0
                })
            }, 
            {
                dataField: 'mes',
                text: 'Mês',
                sort: true,
                headerStyle: { textAlign: 'center' },
                style: { textAlign: 'center' },
                filter: textFilter({
                    placeholder: 'Filtrar...',
                    delay: 0
                })
            }, 
            {
                dataField: 'milhas',
                text: 'Mi x 1000',
                sort: true,
                headerStyle: { textAlign: 'center' },
                style: { textAlign: 'center' },
                filter: textFilter({
                    placeholder: 'Filtrar...',
                    delay: 0
                })
            }, 
            {
                dataField: 'quilometros',
                text: 'Km x 1000',
                sort: true,
                headerStyle: { textAlign: 'center' },
                style: { textAlign: 'center' },
                filter: textFilter({
                    placeholder: 'Filtrar...',
                    delay: 0
                })
            }, 
            {
                dataField: 'tipomanut',
                text: 'Manutenção',
                sort: true,
                headerStyle: { textAlign: 'left' },
                style: { textAlign: 'left' },
                filter: textFilter({
                    placeholder: 'Filtrar...',
                    delay: 0
                })
            }
        ];
        return (
            <React.Fragment>
                <ToolkitProvider
                    keyField={'id'} 
                    data={dataTable} 
                    columns={columnsTable}
                    exportCSV={ {
                        fileName: 'manutencao.csv',
                        noAutoBOM: false,
                        separator: ';'
                    }}
                    search
                >
                    {
                        props => (
                            <div>
                                <div className='manutencaotabletools'>
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
                                            ref={ref => (this.manutencaotableBtnConfirmModalRef = ref)}
                                            hidden
                                            data-toggle="modal" data-target="#confirmmodal"
                                            data-backdrop="static" data-keyboard="false"
                                        />
                                        <button
                                            ref={ref => (this.manutMdfItemModalRef = ref)}
                                            hidden
                                            data-toggle="modal" data-target="#manutmdfitem"
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
                                    wrapperClasses="manutencaotable"
                                    filter={filterFactory()}
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
    isRefreshManut: state.ManutencaoReducer.isRefreshManut
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


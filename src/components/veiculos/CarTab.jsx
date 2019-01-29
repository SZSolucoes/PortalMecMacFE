import React from 'react';
import { connect } from 'react-redux';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import ToolkitProvider, { CSVExport, Search } from 'react-bootstrap-table2-toolkit';
import { modifyModalTitle, modifyModalMessage, modifyExtraData } from '../utils/UtilsActions';
import { withRouter } from 'react-router-dom';

import {
    doOpenVeiculoModal
} from '../cadastroveiculo/CadastroVeiculoActions';
import { modifyComplementosItem } from '../complementos/ComplementosActions';
import { modifyCPManualItem } from './cpmanual/CPManualActions';

import './VeiculosTabs.css';
import { store } from '../..';

class CarTab extends React.Component {

    constructor(props) {
        super(props);

        this.handleOnSelect = this.handleOnSelect.bind(this);
        this.onClickComplementos = this.onClickComplementos.bind(this);
        this.onClickRemover = this.onClickRemover.bind(this);
        this.onClickCPManual = this.onClickCPManual.bind(this);
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
                selectedRow: {},
                selectedIndex: -1
            }
        };
    }

    componentDidUpdate() {
        const { selectedIndex, selectedRow } = this.state.selectRow;
        let newSelectedRow = selectedRow;

        if (selectedIndex > -1 && (this.props.listCarros.length - 1) >= selectedIndex) {
            newSelectedRow = { ...this.props.listCarros[selectedIndex] };
        }

        if (this.props.isRefreshTabCar) {
            store.dispatch({
                type: 'modify_isrefreshtabcar_veiculos',
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

    onClickComplementos() {
        if (this.state.selectRow.selected[0]) {
            const item = {
                id: this.state.selectRow.selected[0],
                vehicletype: '1',
                ...this.state.selectRow.selectedRow
            }
            this.props.modifyComplementosItem(item);
            this.props.history.push('/complementos');
        }
    }

    onClickRemover() {
        if (this.state.selectRow.selected[0]) {
            this.props.modifyModalTitle('Remover');
            this.props.modifyModalMessage('Confirma a remoção do veículo ?');
            this.props.modifyExtraData({ 
                item: { id: this.state.selectRow.selected[0] }, 
                action: 'remove',
                vehicletype: '1'
            });
            this.removerCarRef.click();
        }
    }

    onClickCPManual() {
        if (this.state.selectRow.selected[0]) {
            const item = {
                id: this.state.selectRow.selected[0],
                vehicletype: '1',
                ...this.state.selectRow.selectedRow
            }

            this.props.modifyCPManualItem(item);
            this.btnCPManual.click();
        }
    }

    onClickModify() {
        if (this.state.selectRow.selected[0]) {
            this.props.doOpenVeiculoModal(
                '2', 
                '1', 
                this.state.selectRow.selected[0],
                this.state.selectRow.selectedRow
            );
            this.incluirCarRef.click();
        }
    }

    handleOnSelect(row, isSelect, rowIndex, e) {
        if (isSelect) {
            this.setState({ 
                selectRow: { 
                    ...this.state.selectRow, 
                    selected: [row.id], 
                    selectedRow: row,
                    selectedIndex: rowIndex
                } 
            });
        } else {
            this.setState({ 
                selectRow: { 
                    ...this.state.selectRow, 
                    selected: [''], 
                    selectedRow: {},
                    selectedIndex: -1 
                }
            });
        }
    }

    render() {
        const dataTable = this.props.listCarros || [];
        const columnsTable = [
            {
                dataField: 'id',
                text: 'id',
                hidden: true,
                formatter: (cell, row, rowIndex, formatExtraData) => {
                    return `${row.fipemesano.trim()}|${row.marca.trim()}|${row.modelo.trim()}|${row.ano.trim()}`;
                },
                csvExport: false
            }, 
            {
                dataField: 'fipeperiodoref',
                text: 'Fipe Mês/Ano',
                sort: true,
                headerStyle: { textAlign: 'left', whiteSpace: 'nowrap' },
                style: { textAlign: 'left' },
                filter: textFilter({
                    placeholder: 'Filtrar...',
                    delay: 0
                })
            }, 
            {
                dataField: 'marca',
                text: 'Marca',
                sort: true,
                headerStyle: { textAlign: 'left' },
                style: { textAlign: 'left' },
                filter: textFilter({
                    placeholder: 'Filtrar...',
                    delay: 0
                })
            }, 
            {
                dataField: 'modelo',
                text: 'Modelo',
                sort: true,
                headerStyle: { textAlign: 'left' },
                style: { textAlign: 'left' },
                filter: textFilter({
                    placeholder: 'Filtrar...',
                    delay: 0
                })
            }, 
            {
                dataField: 'ano',
                text: 'Ano',
                sort: true,
                headerStyle: { textAlign: 'center' },
                style: { textAlign: 'center' },
                filter: textFilter({
                    placeholder: 'Filtrar...',
                    delay: 0
                })
            }, 
            {
                dataField: 'valor',
                text: 'Valor',
                sort: true,
                headerStyle: { textAlign: 'center' },
                style: { textAlign: 'center' },
                formatter: (cell, row, rowIndex, formatExtraData) => {
                    return cell ? `R$ ${cell.toLocaleString(undefined , { minimumFractionDigits: 2 })}` : '';
                },
                filter: textFilter({
                    placeholder: 'Filtrar...',
                    delay: 0
                })
            },
            {
                dataField: 'combustivel',
                text: 'Combustível',
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
                        fileName: 'carros.csv',
                        noAutoBOM: false,
                        separator: ';'
                    }}
                    search
                >
                    {
                        props => (
                            <div>
                                <div className='vehicletabletools'>
                                    <div style={{ flex: 3 }}>
                                        <button 
                                            className="btn btn-primary cadbtn"
                                            style={{ 
                                                marginRight: 10,
                                                marginTop: 5
                                            }}
                                            onClick={() => { 
                                                this.props.doOpenVeiculoModal('1', '1');
                                                this.incluirCarRef.click();
                                            }}
                                        >
                                            Cadastrar
                                        </button>
                                        <button 
                                            className="btn btn-dark cadbtn"
                                            style={{ 
                                                marginRight: 10,
                                                marginTop: 5
                                            }}
                                            onClick={() => { 
                                                this.onClickModify();
                                            }}
                                        >
                                            Modificar
                                        </button>
                                        <button
                                            ref={ref => (this.incluirCarRef = ref)}
                                            hidden
                                            data-toggle="modal" data-target="#cadveiculo"
                                            data-backdrop="static" data-keyboard="false"
                                        />
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
                                            ref={ref => (this.removerCarRef = ref)}
                                            hidden
                                            data-toggle="modal" data-target="#confirmmodal"
                                            data-backdrop="static" data-keyboard="false"
                                        />
                                        <button 
                                            className="btn btn-warning"
                                            onClick={() => this.onClickComplementos()}
                                            style={{ 
                                                marginRight: 10, 
                                                color: 'white',
                                                marginTop: 5 
                                            }}
                                        >
                                            Complementos
                                        </button>
                                        <button 
                                            className="btn btn-info"
                                            onClick={() => this.onClickCPManual()}
                                            style={{ 
                                                marginRight: 10, 
                                                color: 'white',
                                                marginTop: 5 
                                            }}
                                        >
                                            Copiar Manual
                                        </button>
                                        <button
                                            ref={ref => (this.btnCPManual = ref)}
                                            hidden
                                            data-toggle="modal" data-target="#cpmanual"
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
                                        <Search.SearchBar 
                                            { ...props.searchProps } 
                                            placeholder="Buscar..."
                                            delay={0}
                                        />
                                    </div>
                                </div>
                                <BootstrapTable
                                    
                                    { ...props.baseProps } 
                                    selectRow={this.state.selectRow}
                                    pagination={paginationFactory()}
                                    bordered={ false }
                                    wrapperClasses="veiculostable"
                                    filter={filterFactory()}
                                    exportCsv
                                    bootstrap4
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
    listCarros: state.VeiculosReducer.listCarros,
    isRefreshTabCar: state.VeiculosReducer.isRefreshTabCar
});

export default withRouter(connect(mapStateToProps, {
    doOpenVeiculoModal,
    modifyModalTitle, 
    modifyModalMessage,
    modifyExtraData,
    modifyComplementosItem,
    modifyCPManualItem
})(CarTab));


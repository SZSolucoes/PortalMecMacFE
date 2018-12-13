import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { onMount, onUnmount } from 'react-keydown/es/event_handlers';
import { setBinding, /*Keys as KeyDownKeys*/ } from 'react-keydown';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import ToolkitProvider, {  Search } from 'react-bootstrap-table2-toolkit';

//import { store } from '../../../index';

//import { socket } from '../../../main/App';
import { modifyModalTitle, modifyModalMessage, modifyExtraData } from '../../utils/UtilsActions';
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"

class CPManualTable extends Component {
    constructor(props) {
        super(props);

        this.handleOnSelect = this.handleOnSelect.bind(this);
        this.onKeyUpOrDown = this.onKeyUpOrDown.bind(this);
        this.onClickConfirm = this.onClickConfirm.bind(this);
        this.onClickFechar = this.onClickFechar.bind(this);
        this.pushSelectedID = this.pushSelectedID.bind(this);
        this.popAtSelectedID = this.popAtSelectedID.bind(this);
        this.pushSelectedRow = this.pushSelectedRow.bind(this);
        this.popAtSelectedRow = this.popAtSelectedRow.bind(this);

        this.columnsTable = [
            {
                dataField: 'id',
                text: 'id',
                hidden: true,
                formatter: (cell, row, rowIndex, formatExtraData) => {
                    return `${row.fipemesano.trim()}|${row.marca.trim()}|${row.modelo.trim()}|${row.ano.trim()}`;
                }
                
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
    
        this.state = {
            selectRow: {
                mode: 'checkbox',
                clickToSelect: true,
                bgColor: '#007BFF',
                hideSelectColumn: true,
                style: { color: 'white' },
                onSelect: this.handleOnSelect,
                selected: [''],
                selectedRow: [{}]
            },
            showallseleted: false,
            cpymanut: true,
            cpyaros: true
        }
    }

    componentDidMount() {
        onMount(this);
    }
    
    componentWillUnmount() {
        onUnmount(this);
    }

    onKeyUpOrDown(event) {
        //console.log(event);
    }

    async onClickConfirm() {
        const { selectRow, cpymanut, cpyaros } = this.state;
        if (!(cpymanut || cpyaros)) {
            alert('É necessário informar ao menos um tipo de cópia para prosseguir.');
            return;
        }
        if (this.props.item && selectRow.selected && selectRow.selected[0] !== '') {
            const vehicleOfID = this.props.item.id;
            const vehicletype = this.props.item.vehicletype;
    
            const params = {
                vehicleOfID,
                vehicletype,
                vehiclesTo: selectRow.selected,
                cpymanut: `${cpymanut}`,
                cpyaros: `${cpyaros}`
            };
            
            this.props.modifyModalTitle('Confirmar');
            this.props.modifyModalMessage(
                `Confirma a cópia para ${selectRow.selected.length === 1 ? 'o veículo selecionado': 'os véiculos selecionados'} ?`
            );
            this.props.modifyExtraData({ 
                params, 
                action: 'confirm_cpmanual' 
            });
            this.confirmCPManualBtnRef.click();
        } else {
            alert('Nenhum veículo foi selecionado.');
            return;
        }
    }

    onClickFechar() {
        this.setState({
            selectRow: {
                mode: 'checkbox',
                clickToSelect: true,
                bgColor: '#007BFF',
                hideSelectColumn: true,
                style: { color: 'white' },
                onSelect: this.handleOnSelect,
                selected: [''],
                selectedRow: [{}]
            },
            showallseleted: false,
            cpymanut: true,
            cpyaros: true
        });
    }

    handleOnSelect(row, isSelect, rowIndex, e) {
        if (isSelect) {
            this.setState({ 
                selectRow: { 
                    ...this.state.selectRow, 
                    selected: this.pushSelectedID(this.state.selectRow.selected, row.id), 
                    selectedRow: this.pushSelectedRow(this.state.selectRow.selectedRow, row) 
                } 
            });
        } else {
            this.setState({ 
                selectRow: { 
                    ...this.state.selectRow, 
                    selected: this.popAtSelectedID(this.state.selectRow.selected, row.id), 
                    selectedRow: this.popAtSelectedRow(this.state.selectRow.selectedRow, row)
                } 
            });
        }
    }

    pushSelectedID(selectedArray, rowID) {
        const findedIndex = _.findIndex(selectedArray, (item) => item === rowID);
        if (findedIndex === -1) {
            if (selectedArray[0] === '') {
                return [rowID];
            } else {
                return [...selectedArray, rowID];
            }
        }

        return selectedArray;
    }

    popAtSelectedID(selectedArray, rowID) {
        const findedIndex = _.findIndex(selectedArray, (item) => item === rowID);
        if (findedIndex !== -1) {
            const newArray = [...selectedArray];
            newArray.splice(findedIndex, 1);
            if (newArray.length === 0) {
                return [''];
            }
            return newArray;
        }

        return selectedArray;
    }

    pushSelectedRow(selectedRowArray, row) {
        const findedIndex = _.findIndex(selectedRowArray, (item) => item.id === row.id);
        if (findedIndex === -1) {
            if (Object.keys(selectedRowArray[0]).length === 0) {
                return [row];
            } else {
                return [...selectedRowArray, row];
            }
        }

        return selectedRowArray;
    }

    popAtSelectedRow(selectedRowArray, row) {
        const findedIndex = _.findIndex(selectedRowArray, (item) => item.id === row.id);
        if (findedIndex !== -1) {
            const newArray = [...selectedRowArray];
            newArray.splice(findedIndex, 1);
            if (newArray.length === 0) {
                return [{}];
            }
            return newArray;
        }

        return selectedRowArray;
    }

    render() {
        const { listCarros, listMotos, listCaminhoes } = this.props;
        const vehicletype = this.props.item ? this.props.item.vehicletype : '0';

        let dataTable = [];

        if (vehicletype === '1') {
            dataTable = listCarros;
        } else if (vehicletype === '2') {
            dataTable = listMotos;
        } else if (vehicletype === '3') {
            dataTable = listCaminhoes;
        }

        dataTable = _.filter(dataTable, valueItem => valueItem.id !== this.props.item.id);

        if (this.state.selectRow.selected[0] !== '' && this.state.showallseleted) {
            dataTable = _.filter(dataTable, (item) => {
                for (let index = 0; index < this.state.selectRow.selected.length; index++) {
                    if (item.id === this.state.selectRow.selected[index]) {
                        return true;
                    }
                }

                return false;
            });
        } else if (this.state.selectRow.selected[0] === '' && this.state.showallseleted) {
            dataTable = [];
        }

        return (
            <React.Fragment>
                <ToolkitProvider
                    keyField={'id'} 
                    data={dataTable} 
                    columns={this.columnsTable}
                    search
                >
                    {
                        props => (
                            <div>
                                <div className='cpmanualtabletools'>
                                    <div style={{ flex: 1 }}>
                                        <Search.SearchBar { ...props.searchProps } placeholder="Buscar..."/>
                                    </div>
                                    <div className='cpmanualbtnshowselected'>
                                        <div className="form-check">
                                            <input 
                                                type="checkbox" 
                                                name= "showallseleted" 
                                                className="form-check-input" 
                                                id="showallseleted"
                                                checked={this.state.showallseleted}
                                                onChange={() => this.setState({ 
                                                    showallseleted: !this.state.showallseleted 
                                                })}
                                            />
                                            <label className="form-check-label" htmlFor="showallseleted">
                                                {' Mostrar somente os selecionados'}
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input 
                                                type="checkbox" 
                                                name= "cpymanut" 
                                                className="form-check-input" 
                                                id="cpymanut"
                                                checked={this.state.cpymanut}
                                                onChange={() => this.setState({ 
                                                    cpymanut: !this.state.cpymanut 
                                                })}
                                            />
                                            <label className="form-check-label" htmlFor="cpymanut">
                                                {' Copiar Manutenção'}
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input 
                                                type="checkbox" 
                                                name= "cpyaros" 
                                                className="form-check-input" 
                                                id="cpyaros"
                                                checked={this.state.cpyaros}
                                                onChange={() => this.setState({ 
                                                    cpyaros: !this.state.cpyaros 
                                                })}
                                            />
                                            <label className="form-check-label" htmlFor="cpyaros">
                                                {' Copiar Aros'}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <BootstrapTable
                                    
                                    { ...props.baseProps } 
                                    selectRow={this.state.selectRow}
                                    pagination={paginationFactory()}
                                    bordered={ false }
                                    striped
                                    condensed
                                    wrapperClasses="cpmanualtable"
                                    filter={filterFactory()}
                                    bootstrap4
                                />
                            </div>
                        )
                    }
                </ToolkitProvider>
                <button
                    ref={ref => (this.confirmCPManualBtnRef = ref)}
                    hidden
                    data-toggle="modal" data-target="#confirmmodal"
                    data-backdrop="static" data-keyboard="false"
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    listCarros: state.VeiculosReducer.listCarros,
    listMotos: state.VeiculosReducer.listMotos,
    listCaminhoes: state.VeiculosReducer.listCaminhoes
});

setBinding({
    target: CPManualTable.prototype,
    fn: CPManualTable.prototype.onKeyUpOrDown,
    keys: [ /*KeyDownKeys.UP, KeyDownKeys.DOWN*/ ]
});

export default connect(mapStateToProps, {
    modifyModalTitle, 
    modifyModalMessage, 
    modifyExtraData
}, null, { withRef: true })(CPManualTable);


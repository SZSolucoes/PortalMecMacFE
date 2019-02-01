import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { onMount, onUnmount } from 'react-keydown/es/event_handlers';
import { setBinding, /*Keys as KeyDownKeys*/ } from 'react-keydown';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import ToolkitProvider, {  Search } from 'react-bootstrap-table2-toolkit';

import { getVeicVincItens, doConfirmVincularSimp } from './VincularActions';
import { modifyModalTitle, modifyModalMessage, modifyExtraData } from '../../../utils/UtilsActions';
import Main from '../../../templates/Main';
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"

const NoDataIndication = () => (
    <div 
        style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '40vh', 
            backgroundColor: 'white' 
        }}
    >
        <div className="lds-facebook"><div></div><div></div><div></div></div>
    </div>
);

class VincularTableGerenc extends Component {
    constructor(props) {
        super(props);

        this.handleOnSelectVeic = this.handleOnSelectVeic.bind(this);
        this.handleOnSelectItens = this.handleOnSelectItens.bind(this);
        this.onKeyUpOrDown = this.onKeyUpOrDown.bind(this);
        this.onClickFechar = this.onClickFechar.bind(this);
        this.onClickRemoverVinc = this.onClickRemoverVinc.bind(this);
        this.onClickVincItem = this.onClickVincItem.bind(this);
        this.pushSelectedID = this.pushSelectedID.bind(this);
        this.popAtSelectedID = this.popAtSelectedID.bind(this);
        this.pushSelectedRow = this.pushSelectedRow.bind(this);
        this.popAtSelectedRow = this.popAtSelectedRow.bind(this);
        this.fetchItens = this.fetchItens.bind(this);

        this.renderTableVeic = this.renderTableVeic.bind(this);
        this.renderTableItens = this.renderTableItens.bind(this);

        this.columnsTable = [
            {
                dataField: 'recrow',
                text: 'recrow',
                hidden: true
            }, 
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
                headerStyle: { textAlign: 'left' },
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

        this.columnsTableItens = [
            {
                dataField: 'id',
                text: 'ID',
                sort: true,
                csvExport: false,
                filter: textFilter({
                    placeholder: ' ',
                    delay: 0
                })
            }, 
            {
                dataField: 'itemabrev',
                text: 'Nome Abreviado',
                sort: true,
                filter: textFilter({
                    placeholder: ' ',
                    delay: 0
                })
            },
            {
                dataField: 'item',
                text: 'Item',
                sort: true,
                filter: textFilter({
                    placeholder: ' ',
                    delay: 0
                })
            }
        ];
    
        this.state = {
            selectRowVeic: {
                mode: 'checkbox',
                clickToSelect: true,
                bgColor: '#007BFF',
                hideSelectColumn: true,
                style: { color: 'white' },
                onSelect: this.handleOnSelectVeic,
                selected: [''],
                selectedRow: {}
            },
            selectRowItens: {
                mode: 'checkbox',
                clickToSelect: true,
                bgColor: '#007BFF',
                hideSelectColumn: true,
                style: { color: 'white' },
                onSelect: this.handleOnSelectItens,
                selected: [''],
                selectedRow: [{}]
            },
            showallseletedItens: false,
            itensLoading: false,
            dataTableItemManutencao: []
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

    onClickFechar() {
        this.setState({
            selectRowVeic: {
                mode: 'checkbox',
                clickToSelect: true,
                bgColor: '#007BFF',
                hideSelectColumn: true,
                style: { color: 'white' },
                onSelect: this.handleOnSelectVeic,
                selected: [''],
                selectedRow: {}
            },
            selectRowItens: {
                mode: 'checkbox',
                clickToSelect: true,
                bgColor: '#007BFF',
                hideSelectColumn: true,
                style: { color: 'white' },
                onSelect: this.handleOnSelectItens,
                selected: [''],
                selectedRow: [{}]
            },
            showallseletedItens: false,
            itensLoading: false,
            dataTableItemManutencao: []
        });
    }

    onClickVincItem(itemcombo) {
        const { selectRowVeic } = this.state;

        if (selectRowVeic.selected && selectRowVeic.selected[0] !== '' && itemcombo) {
            doConfirmVincularSimp(
                {
                    itens: [itemcombo],
                    veiculos: [selectRowVeic.selected[0]]
                },
                () => {
                    this.fetchItens(selectRowVeic.selected[0]);
                }
            )
        } else if (!itemcombo) {
            alert('É necessário selecionar um item para o vínculo.');
        } else {
            alert('É necessário selecionar um veículo para o vínculo.');
        }
    }

    onClickRemoverVinc() {
        const { selectRowItens } = this.state;
        if (selectRowItens.selected && selectRowItens.selected[0] !== '') {
            const numItens = selectRowItens.selected.length;

            this.props.modifyModalTitle('Remover');
            this.props.modifyModalMessage(
                `Confirma a remoção ${numItens === 1 ? 'do item vinculado' : 'dos itens vinculados'} ?`
            );
            this.props.modifyExtraData({ 
                item: {
                    itens: this.state.selectRowItens.selected 
                }, 
                action: 'remove_vincularitemmanut',
                btnAction: () => {
                    this.fetchItens(this.state.selectRowVeic.selected[0]);
                }
            });
            this.tableItensRemoveVinc.click();
        }
    }

    async fetchItens(id) {
        if (id) {
            this.setState({
                itensLoading: true,
                dataTableItemManutencao: [],
            });
            const retItens = await getVeicVincItens(id);

            this.setState({ 
                selectRowItens: { 
                    ...this.state.selectRowItens, 
                    selected: [''], 
                    selectedRow: [{}]
                },
                dataTableItemManutencao: [...retItens],
                itensLoading: false
            });
        } else {
            this.setState({ 
                selectRowItens: { 
                    ...this.state.selectRowItens, 
                    selected: [''], 
                    selectedRow: [{}]
                },
                dataTableItemManutencao: [],
                itensLoading: false
            });
        }
    }

    handleOnSelectVeic(row, isSelect, rowIndex, e) {
        if (isSelect) {
            this.setState({ 
                selectRowVeic: { 
                    ...this.state.selectRowVeic, 
                    selected: [row.id], 
                    selectedRow: row 
                } 
            });
            this.fetchItens(row.id);
        } else {
            this.setState({ 
                selectRowVeic: { 
                    ...this.state.selectRowVeic, 
                    selected: [''],
                    selectedRow: {}
                } 
            });
            this.fetchItens('');
        }
    }

    handleOnSelectItens(row, isSelect, rowIndex, e) {
        if (isSelect) {
            this.setState({ 
                selectRowItens: { 
                    ...this.state.selectRowItens, 
                    selected: this.pushSelectedID(this.state.selectRowItens.selected, row.id), 
                    selectedRow: this.pushSelectedRow(this.state.selectRowItens.selectedRow, row) 
                } 
            });
        } else {
            this.setState({ 
                selectRowItens: { 
                    ...this.state.selectRowItens, 
                    selected: this.popAtSelectedID(this.state.selectRowItens.selected, row.id), 
                    selectedRow: this.popAtSelectedRow(this.state.selectRowItens.selectedRow, row)
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

    renderTableVeic() {
        const { listCarros, listMotos, listCaminhoes } = this.props;

        let dataTable = [...listCarros, ...listMotos, ...listCaminhoes];

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
                                <div className='vinculartabletools'>
                                    <div style={{ flex: 1 }}>
                                        <Search.SearchBar { ...props.searchProps } placeholder="Buscar..."/>
                                    </div>
                                    <div className='vincularbtnshowselected' />
                                </div>
                                <BootstrapTable
                                    
                                    { ...props.baseProps } 
                                    selectRow={this.state.selectRowVeic}
                                    pagination={paginationFactory()}
                                    bordered={ false }
                                    striped
                                    condensed
                                    wrapperClasses="vinculartable"
                                    filter={filterFactory()}
                                    bootstrap4
                                    defaultSorted={
                                        [{
                                            dataField: 'recrow',
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

    renderTableItens() {
        const { dataTableItemManutencao } = this.state;

        let dataTable = [...dataTableItemManutencao];

        if (this.state.selectRowItens.selected[0] !== '' && this.state.showallseletedItens) {
            dataTable = _.filter(dataTable, (item) => {
                for (let index = 0; index < this.state.selectRowItens.selected.length; index++) {
                    if (item.id === this.state.selectRowItens.selected[index]) {
                        return true;
                    }
                }

                return false;
            });
        } else if (this.state.selectRowItens.selected[0] === '' && this.state.showallseletedItens) {
            dataTable = [];
        }

        return (
            <React.Fragment>
                <ToolkitProvider
                    keyField={'id'} 
                    data={dataTable} 
                    columns={this.columnsTableItens}
                    search
                >
                    {
                        props => (
                            <div>
                                <div className='vinculartabletools'>
                                    <button 
                                        className="btn btn-danger"
                                        onClick={() => this.onClickRemoverVinc()}
                                        style={{ 
                                            marginRight: 20,
                                            marginTop: 5 
                                        }}
                                    >
                                        Remover vínculo
                                    </button>
                                    <div style={{ flex: 1, marginTop: 5 }}>
                                        <Search.SearchBar { ...props.searchProps } placeholder="Buscar..."/>
                                    </div>
                                    <div className='vincularbtnshowselected mt-1'>
                                        <div className="form-check">
                                            <input 
                                                type="checkbox" 
                                                name= "showallseleteditensgerenc" 
                                                className="form-check-input" 
                                                id="showallseleteditensgerenc"
                                                checked={this.state.showallseletedItens}
                                                onChange={() => this.setState({ 
                                                    showallseletedItens: !this.state.showallseletedItens 
                                                })}
                                            />
                                            <label className="form-check-label" htmlFor="showallseleteditensgerenc">
                                                {' Mostrar somente os selecionados'}
                                            </label>
                                        </div>
                                    </div>
                                    <button
                                        ref={ref => (this.tableItensRemoveVinc = ref)}
                                        hidden
                                        data-toggle="modal" data-target="#confirmmodal"
                                        data-backdrop="static" data-keyboard="false"
                                    />
                                </div>
                                <BootstrapTable
                                    
                                    { ...props.baseProps } 
                                    selectRow={this.state.selectRowItens}
                                    pagination={paginationFactory()}
                                    bordered={ false }
                                    striped
                                    condensed
                                    wrapperClasses="vinculartable"
                                    filter={filterFactory()}
                                    bootstrap4
                                    defaultSorted={
                                        [{
                                            dataField: 'id',
                                            order: 'desc'
                                        }]
                                    }
                                    noDataIndication={this.state.itensLoading ? () => <NoDataIndication /> : null}
                                />
                            </div>
                        )
                    }
                </ToolkitProvider>
            </React.Fragment>
        );
    }

    render() {
        return (
            <div id='vincularmain' className='d-flex flex-row'>
                <Main>
                    <h4>Veículos</h4>
                    {this.renderTableVeic()}
                </Main>
                <Main>
                    <h4>Itens Vinculados</h4>
                    {this.renderTableItens()}
                </Main>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    listCarros: state.VeiculosReducer.listCarros,
    listMotos: state.VeiculosReducer.listMotos,
    listCaminhoes: state.VeiculosReducer.listCaminhoes
});

setBinding({
    target: VincularTableGerenc.prototype,
    fn: VincularTableGerenc.prototype.onKeyUpOrDown,
    keys: [ /*KeyDownKeys.UP, KeyDownKeys.DOWN*/ ]
});

export default connect(mapStateToProps, {
    modifyModalTitle, 
    modifyModalMessage, 
    modifyExtraData
}, null, { withRef: true })(VincularTableGerenc);


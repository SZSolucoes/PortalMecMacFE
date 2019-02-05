import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { onMount, onUnmount } from 'react-keydown/es/event_handlers';
import { setBinding, /*Keys as KeyDownKeys*/ } from 'react-keydown';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import ToolkitProvider, {  Search } from 'react-bootstrap-table2-toolkit';

import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"

class VincularTableItens extends Component {
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
                text: 'ID',
                sort: true,
                csvExport: false,
                hidden: true
            }, 
            {
                dataField: 'referencia',
                text: 'Referência',
                sort: true,
                filter: textFilter({
                    placeholder: 'Filtrar...',
                    delay: 0,
                    getFilter: filter => (this.filterReferencia = filter)
                })
            },
            {
                dataField: 'itemabrev',
                text: 'Nome Abreviado',
                sort: true,
                filter: textFilter({
                    placeholder: 'Filtrar...',
                    delay: 0,
                    getFilter: filter => (this.filterItemAbrev = filter)
                })
            },
            {
                dataField: 'item',
                text: 'Item',
                sort: true,
                filter: textFilter({
                    placeholder: 'Filtrar...',
                    delay: 0,
                    getFilter: filter => (this.filterItem = filter)
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

    onClickConfirm() {
        const { selectRow } = this.state;
        const data = { success: false, values: []}

        if (selectRow.selected && selectRow.selected[0] !== '') {
           data.success = true;
           data.values = [...selectRow.selected];
           return data;
        } else {
            alert('Não foram selecionados itens de manutenção para o vínculo.');
            return data;
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

        if (this.filterReferencia && typeof this.filterReferencia === 'function') {
            this.filterReferencia('');
        }
        if (this.filterItemAbrev && typeof this.filterItemAbrev === 'function') {
            this.filterItemAbrev('');
        }
        if (this.filterItem && typeof this.filterItem === 'function') {
            this.filterItem('');
        }
        if (this.clearSearchBtn) {
            this.clearSearchBtn.firstChild.click();
        }
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
        const { dataTableItemManutencao } = this.props;

        let dataTable = [...dataTableItemManutencao];

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
                                <div className='vinculartabletools'>
                                    <div style={{ flex: 1 }}>
                                        <Search.SearchBar { ...props.searchProps } placeholder="Buscar..."/>
                                        <div
                                            ref={ref => (this.clearSearchBtn = ref)}
                                            hidden
                                        >
                                            <Search.ClearSearchButton
                                                { ...props.searchProps }
                                                hidden
                                            />
                                        </div>
                                    </div>
                                    <div className='vincularbtnshowselected'>
                                        <div className="form-check">
                                            <input 
                                                type="checkbox" 
                                                name= "showallseleteditens" 
                                                className="form-check-input" 
                                                id="showallseleteditens"
                                                checked={this.state.showallseleted}
                                                onChange={() => this.setState({ 
                                                    showallseleted: !this.state.showallseleted 
                                                })}
                                            />
                                            <label className="form-check-label" htmlFor="showallseleteditens">
                                                {' Mostrar somente os selecionados'}
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
                                    wrapperClasses="vinculartable"
                                    filter={filterFactory()}
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
    dataTableItemManutencao: state.ItemManutencaoReducer.dataTableItemManutencao
});

setBinding({
    target: VincularTableItens.prototype,
    fn: VincularTableItens.prototype.onKeyUpOrDown,
    keys: [ /*KeyDownKeys.UP, KeyDownKeys.DOWN*/ ]
});

export default connect(mapStateToProps, {
}, null, { withRef: true })(VincularTableItens);


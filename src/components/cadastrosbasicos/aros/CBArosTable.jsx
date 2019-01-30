import React, { Component } from 'react';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { onMount, onUnmount } from 'react-keydown/es/event_handlers';
import { setBinding, /*Keys as KeyDownKeys*/ } from 'react-keydown';
//import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import ToolkitProvider, { CSVExport, Search } from 'react-bootstrap-table2-toolkit';
import CSVReader from 'react-csv-reader';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import ReactDropzone from "react-dropzone";
import _ from 'lodash';
import { toastr } from 'react-redux-toastr';
import Papa from 'papaparse';

import CBArosTableModal from './CBArosTableModal';
import CBArosSubCatModal from './CBArosSubCatModal';
import { store } from '../../../index';
import { doGetLastId, doFetchCBArosSubs } from './CBArosActions';

import { socket } from '../../../main/App';
import { modifyModalTitle, modifyModalMessage, modifyExtraData } from '../../utils/UtilsActions';
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"

class CBArosTable extends Component {
    constructor(props) {
        super(props);

        this.handleOnSelect = this.handleOnSelect.bind(this);
        this.onKeyUpOrDown = this.onKeyUpOrDown.bind(this);
        this.onClickIncluir = this.onClickIncluir.bind(this);
        this.onClickRemover = this.onClickRemover.bind(this);
        this.onClickSubCat = this.onClickSubCat.bind(this);
        this.onClickDropDownBtn = this.onClickDropDownBtn.bind(this);
        this.onDropCsv = this.onDropCsv.bind(this);
        this.renderDropDownButton = this.renderDropDownButton.bind(this);
        this.handleCsvFile = this.handleCsvFile.bind(this);
        this.handleCsvFileError = this.handleCsvFileError.bind(this);
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
            },
            dropdownBtnOpen: false
        }
    }

    componentDidMount() {
        onMount(this);

        socket.on('table_arossub_changed', data => {
            if ((typeof data === 'number' || typeof data === 'string') && 
                this.state.selectRow.selected[0].toString() === data.toString()
            ) {
                this.props.doFetchCBArosSubs({ idaro: data });
            }
        });
    }
    
    componentDidUpdate(prevProps) {
        const { data, refreshTableAros } = this.props;
        const { selectedRow } = this.state.selectRow;
        const indexFounded = _.findIndex(data, dt => dt.id === selectedRow.id);

        let newSelectedRow = selectedRow;

        if( !data || data.length === 0) {
            store.dispatch({
                type: 'modify_datatablecbarossub_cbaros',
                payload: []
            });
        }


        if (
            refreshTableAros && 
            indexFounded !== -1 &&
            !_.isEqual(data[indexFounded], prevProps.data[indexFounded])
        ) {
            newSelectedRow = { ...data[indexFounded] };
            store.dispatch({
                type: 'modify_refreshtablearos_cbaros',
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

    componentWillUnmount() {
        onUnmount(this);

        socket.off('table_arossub_changed');
    }

    onKeyUpOrDown(event) {
        //console.log(event);
    }

    onClickIncluir() {
        const asyncFunExec = async () => {
            try {
                const item = await doGetLastId();
                if (item && item.data && item.data.length > 0) {
                    store.dispatch(change('cbarostableform', 'id', item.data[0].id + 1));
                } else {
                    store.dispatch(change('cbarostableform', 'id', 0));
                }
            } catch(e) {
                console.log(e);
            }
        }
        
        asyncFunExec();
        this.cbarostableBtnModalRef.click();
    }

    onClickModify() {
        if (this.state.selectRow.selected[0]) {
            const { selectedRow } = this.state.selectRow;

            store.dispatch(change('cbarosmdfform', 'id', selectedRow.id));
            store.dispatch(change('cbarosmdfform', 'vehicletype', selectedRow.vehicletype));
            store.dispatch(change('cbarosmdfform', 'aro', selectedRow.aro));
            store.dispatch({
                type: 'modify_formvaluesaros_cbaros',
                payload: selectedRow
            });

            this.cbArosMdfModalRef.click();
        }
    }

    onClickRemover() {
        if (this.state.selectRow.selected[0]) {
            this.props.modifyModalTitle('Remover');
            this.props.modifyModalMessage('Confirma a remoção do registro selecionado ?');
            this.props.modifyExtraData({ 
                item: { id: this.state.selectRow.selected[0] }, 
                action: 'remove_cbarostable' 
            });
            this.cbarostableBtnConfirmModalRef.click();
        }
    }
    
    onClickSubCat() {
        if (this.state.selectRow.selected[0]) {
            store.dispatch({
                type: 'modify_arossubvalues_cbaros',
                payload: this.state.selectRow.selectedRow
            });
            this.cbarosSubBtnConfirmModalRef.click();
        }
    }
    
    onClickDropDownBtn() {
        this.setState({
            dropdownBtnOpen: !this.state.dropdownBtnOpen
        });
    }

    onDropCsv(acceptedFiles, rejectedFiles) {
        const numAcceptedFiles = acceptedFiles.length;

        if (numAcceptedFiles) {
            Promise.all(acceptedFiles.map(
                file =>
                    new Promise(
                        (resolve, reject) =>
                        Papa.parse(
                          file,
                          {
                            delimiter: ';',
                            skipEmptyLines: true,
                            complete: resolve,
                            error: reject
                          }
                        )
                    )
                )
            )
            .then(
                (results) => {
                    let data = results.map(rows => rows.data);
                    data = [].concat.apply([], data);

                    const newItems = _.map(data, row => {
                        const newRow = [...row];
                        const element = newRow[0].toLowerCase().trim();
                        if (!'1|2|3'.includes(element)) {
                            if ('carro|carros|car|moto|motos|bike|caminhao|caminhão|caminhoes|caminhões|truck'.includes(element)) {
                                if ('carro|carros|car'.includes(element)) {
                                    newRow[0] = '1';
                                } else if ('moto|motos|bike'.includes(element)) {
                                    newRow[0] = '2';
                                } else {
                                    newRow[0] = '3';
                                }
                            } else {
                                newRow[0] = '1';
                            }
                        }

                        return newRow;
                    });
                
                    data = _.filter(newItems, row => {
                        if (row.length !== 2) {
                            return false;
                        }

                        for (let index = 0; index < row.length; index++) {
                            const element = row[index].toLowerCase().trim();
                            if ('id|tipo de veiculo|aro'.includes(element)) {
                                return false;
                            }
                        }

                        return true;
                    });

                    const numData = data.length;

                    if (numData) {
                        this.props.modifyModalTitle('Confirmar');
                        this.props.modifyModalMessage(
                            `Confirma a inclusão de ${numData === 1 ? `${numData} linha ?` : `${numData} linhas ?`}`
                        );
                        this.props.modifyExtraData({ 
                            item: data, 
                            action: 'incluibatch_cbarostable' 
                        });
                        this.cbarostableBtnConfirmModalRef.click();
                    } else {
                        toastr.error('Erro', 'Falha na importação.');
                    }
                }
            )
            .catch(() => false);
        }
    }

    handleCsvFile(data, name) {
        try {
            const newItems = _.map(data, row => {
                const newRow = [...row];
                const element = newRow[0].toLowerCase().trim();
    
                if (!'1|2|3'.includes(element)) {
                    if ('carro|carros|car|moto|motos|bike|caminhao|caminhão|caminhoes|caminhões|truck'.includes(element)) {
                        if ('carro|carros|car'.includes(element)) {
                            newRow[0] = '1';
                        } else if ('moto|motos|bike'.includes(element)) {
                            newRow[0] = '2';
                        } else {
                            newRow[0] = '3';
                        }
                    } else {
                        newRow[0] = '1';
                    }
                }

                return newRow;
            });
    
            let newData = _.filter(newItems, row => {
                if (row.length !== 2) {
                    return false;
                }
    
                for (let index = 0; index < row.length; index++) {
                    const element = row[index].toLowerCase().trim();
                    if ('id|tipo de veiculo|aro'.includes(element)) {
                        return false;
                    }
                }
    
                return true;
            });
    
            const numData = newData.length;
    
            if (numData) {
                this.props.modifyModalTitle('Confirmar');
                this.props.modifyModalMessage(
                    `Confirma a inclusão de ${numData === 1 ? `${numData} linha ?` : `${numData} linhas ?`}`
                );
                this.props.modifyExtraData({ 
                    item: newData, 
                    action: 'incluibatch_cbarostable' 
                });
                this.cbarostableBtnConfirmModalRef.click();
            } else {
                toastr.error('Erro', 'Falha na importação.');
            }
        } catch (e) {
            toastr.error('Erro', 'Falha na importação.');
        }
    }

    handleCsvFileError() {
        
    }

    
    renderDropDownButton(csvProps) {
        return (
            <ButtonDropdown 
                isOpen={this.state.dropdownBtnOpen} 
                toggle={this.onClickDropDownBtn}
                style={{ 
                    marginRight: 10,
                    marginTop: 5 
                }}
            >
                <DropdownToggle caret>
                    Mais
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem
                        onClick={() => {
                            this.importCsvDivRef.firstChild.firstChild.accept = '.txt,.csv';
                            this.importCsvDivRef.firstChild.firstChild.value = '';
                            this.importCsvDivRef.firstChild.firstChild.click();
                        }}
                    >
                        Importar CSV
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem
                        onClick={() => this.exportCsvDivRef.firstChild.click()}
                    >
                        Exportar CSV
                    </DropdownItem>
                </DropdownMenu>
            </ButtonDropdown>
        );
    }

    handleOnSelect(row, isSelect, rowIndex, e) {
        store.dispatch({
            type: 'modify_datatablecbarossub_cbaros',
            payload: []
        });
        
        if (isSelect) {
            this.setState({ 
                selectRow: { 
                    ...this.state.selectRow, 
                    selected: [row.id], 
                    selectedRow: row
                } 
            });
            this.props.setSuperState({ selectedAroRowId: row.id });
            store.dispatch({
                type: 'modify_arossubloading_cbaros',
                payload: true
            });
            store.dispatch({
                type: 'modify_arossubvalues_cbaros',
                payload: row
            });
            
            this.props.doFetchCBArosSubs({ idaro: row.id });
        } else {
            this.setState({ 
                selectRow: { 
                    ...this.state.selectRow, 
                    selected: [''], 
                    selectedRow: {}
                } 
            });
            this.props.setSuperState({ selectedAroRowId: '' });
            store.dispatch({
                type: 'modify_arossubloading_cbaros',
                payload: false
            });
            store.dispatch({
                type: 'modify_arossubvalues_cbaros',
                payload: {}
            });
        }
    }

    render() {
        const { columns, data } = this.props;
        const dataTable = data || [];
        const columnsTable = columns || [
            {
                dataField: 'id',
                text: 'ID',
                sort: true,
                csvExport: false
                /* filter: textFilter({
                    placeholder: ' ',
                    delay: 0
                }), */
            }, 
            {
                dataField: 'vehicletype',
                text: 'Tipo de Veículo',
                sort: true,
                formatter: (cell, row, rowIndex, formatExtraData) => {
                    if (cell && cell === '1') {
                        return 'Carro';
                    } else if (cell && cell === '2') {
                        return 'Moto';
                    } else if (cell && cell === '3') {
                        return 'Caminhão';
                    }
                    return '';
                },
                csvFormatter: (cell, row, rowIndex, formatExtraData) => {
                    if (cell && cell === '1') {
                        return 'Carro';
                    } else if (cell && cell === '2') {
                        return 'Moto';
                    } else if (cell && cell === '3') {
                        return 'Caminhão';
                    }
                    return '';
                }
                /* filter: textFilter({
                    placeholder: ' ',
                    delay: 0
                }) */
            },
            {
                dataField: 'aro',
                text: 'Aro',
                sort: true
                /* filter: textFilter({
                    placeholder: ' ',
                    delay: 0
                }) */
            }
        ];
        return (
            <React.Fragment>
                <ReactDropzone
                    accept=".txt,.csv"
                    onDrop={(acceptedFiles, rejectedFiles) => this.onDropCsv(acceptedFiles, rejectedFiles)}
                >
                    {({getRootProps, getInputProps, isDragActive}) => {
                        const rootProps = getRootProps();
                        return (
                            <div
                                accept={rootProps.accept}
                                onDrop={rootProps.onDrop}
                            >
                                <ToolkitProvider
                                    keyField={'id'} 
                                    data={dataTable} 
                                    columns={columnsTable}
                                    exportCSV={ {
                                        fileName: 'aros.csv',
                                        noAutoBOM: false,
                                        separator: ';'
                                    }}
                                    search
                                >
                                    {
                                        props => (
                                            <div>
                                                <div className='cbarostabletools'>
                                                    <div style={{ flex: 3 }}>
                                                        <button 
                                                            className="btn btn-primary"
                                                            onClick={() => this.onClickIncluir()}
                                                            style={{ 
                                                                marginRight: 10, 
                                                                paddingLeft: 20, 
                                                                paddingRight: 20,
                                                                marginTop: 5
                                                            }}
                                                        >
                                                            Incluir
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
                                                            ref={ref => (this.cbarostableBtnModalRef = ref)}
                                                            hidden
                                                            data-toggle="modal" data-target="#cbarostablemodal"
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
                                                            ref={ref => (this.cbarostableBtnConfirmModalRef = ref)}
                                                            hidden
                                                            data-toggle="modal" data-target="#confirmmodal"
                                                            data-backdrop="static" data-keyboard="false"
                                                        />
                                                        <button 
                                                            className="btn btn-warning"
                                                            onClick={() => this.onClickSubCat()}
                                                            style={{ 
                                                                marginRight: 10, 
                                                                color: 'white',
                                                                marginTop: 5
                                                             }}
                                                        >
                                                            Add Sub-categoria
                                                        </button>
                                                        <button
                                                            ref={ref => (this.cbarosSubBtnConfirmModalRef = ref)}
                                                            hidden
                                                            data-toggle="modal" data-target="#cbarossubcatmodal"
                                                            data-backdrop="static" data-keyboard="false"
                                                        />
                                                        <div 
                                                            ref={ref => (this.importCsvDivRef = ref)}
                                                            hidden
                                                        >
                                                            <CSVReader
                                                                inputId='importCsvAros'
                                                                onFileLoaded={this.handleCsvFile}
                                                                onError={this.handleCsvFileError}
                                                                parserOptions={{
                                                                    delimiter: ';',
                                                                    skipEmptyLines: true
                                                                }}
                                                            />
                                                        </div>
                                                        <div 
                                                            ref={ref => (this.exportCsvDivRef = ref)}
                                                            hidden
                                                        >
                                                            <CSVExport.ExportCSVButton { ...props.csvProps } hidden>
                                                                Exportar CSV
                                                            </CSVExport.ExportCSVButton>
                                                        </div>
                                                        {this.renderDropDownButton()}
                                                        <button
                                                            ref={ref => (this.cbArosMdfModalRef = ref)}
                                                            hidden
                                                            data-toggle="modal" data-target="#cbarosmdf"
                                                            data-backdrop="static" data-keyboard="false"
                                                        />
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
                                                    wrapperClasses="cbarostable"
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
                            </div>
                        )
                    }}
                </ReactDropzone>
                <CBArosTableModal />
                <CBArosSubCatModal />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    refreshTableAros: state.CBArosReducer.refreshTableAros
});

setBinding({
    target: CBArosTable.prototype,
    fn: CBArosTable.prototype.onKeyUpOrDown,
    keys: [ /*KeyDownKeys.UP, KeyDownKeys.DOWN*/ ]
});

export default connect(mapStateToProps, {
    modifyModalTitle, 
    modifyModalMessage, 
    modifyExtraData,
    doFetchCBArosSubs
})(CBArosTable);


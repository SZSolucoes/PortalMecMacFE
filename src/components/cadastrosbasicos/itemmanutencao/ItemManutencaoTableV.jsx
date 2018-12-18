import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { change } from 'redux-form';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { onMount, onUnmount } from 'react-keydown/es/event_handlers';
import { setBinding, /*Keys as KeyDownKeys*/ } from 'react-keydown';
//import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import ToolkitProvider, { CSVExport, Search } from 'react-bootstrap-table2-toolkit';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import CSVReader from 'react-csv-reader';
import ReactDropzone from "react-dropzone";
import Papa from 'papaparse';
import _ from 'lodash';

import { store } from '../../../index';
import { doGetLastId } from './ItemManutencaoActions';
import { modifyModalTitle, modifyModalMessage, modifyExtraData } from '../../utils/UtilsActions';
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

class ItemManutencaoTableV extends Component {
    constructor(props) {
        super(props);

        this.handleOnSelect = this.handleOnSelect.bind(this);
        this.onDropCsv = this.onDropCsv.bind(this);
        this.onKeyUpOrDown = this.onKeyUpOrDown.bind(this);
        this.onClickIncluir = this.onClickIncluir.bind(this);
        this.onClickRemover = this.onClickRemover.bind(this);
        this.onClickImportCsv = this.onClickImportCsv.bind(this);
        this.onClickDropDownBtn = this.onClickDropDownBtn.bind(this);
        this.handleCsvFile = this.handleCsvFile.bind(this);
        this.handleCsvFileError = this.handleCsvFileError.bind(this);
        this.renderDropDownButton = this.renderDropDownButton.bind(this);

        //this.importCsvItemManut = React.createRef();

        this.state = {
            selectRow: {
                mode: 'radio',
                clickToSelect: true,
                bgColor: '#007BFF',
                hideSelectColumn: true,
                style: { color: 'white' },
                onSelect: this.handleOnSelect,
                selected: ['']
            }
        }

        this.columnsTable = [
            {
                dataField: 'id',
                text: 'id',
                hidden: true,
                csvExport: false
            }, 
            {
                dataField: 'fipeperiodoref',
                text: 'Fipe Mês/Ano',
                sort: true,
                headerStyle: { textAlign: 'left' },
                style: { textAlign: 'left' }
            }, 
            {
                dataField: 'marca',
                text: 'Marca',
                sort: true,
                headerStyle: { textAlign: 'left' },
                style: { textAlign: 'left' }
            }, 
            {
                dataField: 'modelo',
                text: 'Modelo',
                sort: true,
                headerStyle: { textAlign: 'left' },
                style: { textAlign: 'left' }
            }, 
            {
                dataField: 'ano',
                text: 'Ano',
                sort: true,
                headerStyle: { textAlign: 'center' },
                style: { textAlign: 'center' }
            }
        ];
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

    onDropCsv(acceptedFiles, rejectedFiles) {
        if (!this.props.selectedItemManutRowId) {
            alert('Para efetuar a importação de veículos é necessário selecionar um item de manutenção.');
            return;
        } 

        const numAcceptedFiles = acceptedFiles.length;

        if (numAcceptedFiles) {
            Promise.all(acceptedFiles.map(
                file =>
                    new Promise(
                        (resolve, reject)=>
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
                    let data = results.map(
                        rows => rows.data.map(
                            val => val.filter(
                                val2 => (val2 || (typeof val2 === 'number' && val2 === 0)
                    ))));
                    
                    data = [].concat.apply([], data);
                    data = _.filter(data, row => {
                        if (row.length < 3) {
                            return false;
                        }

                        for (let index = 0; index < row.length; index++) {
                            const element = row[index].toLowerCase().trim();
                            if ('fipe mês/ano|marca|modelo|ano|combustivel|combustível'.includes(element)) {
                                return false;
                            }
                        }

                        return true;
                    })

                    const numData = data.length;

                    if (numData) {
                        this.props.modifyModalTitle('Confirmar');
                        this.props.modifyModalMessage(
                            `Confirma a inclusão de ${numData === 1 ? `${numData} linha ?` : `${numData} linhas ?`}`
                        );
                        this.props.modifyExtraData({ 
                            item: { 
                                itemmanutID: this.props.selectedItemManutRowId, 
                                vehiclesTo: data 
                            }, 
                            action: 'incluibatch_vincularitemmanut' 
                        });
                        this.itemManutVeicucloRemoveRef.click();
                    } else {
                        toastr.error('Erro', 'Falha na importação.');
                    }
                }
            )
            .catch(() => false);
        }
    }

    onClickIncluir() {
        const asyncFunExec = async () => {
            try {
                const item = await doGetLastId();
                if (item && item.data && item.data.length > 0) {
                    store.dispatch(change('itemmanutencaotableform', 'id', item.data[0].id + 1));
                } else {
                    store.dispatch(change('itemmanutencaotableform', 'id', 0));
                }
            } catch(e) {
                console.log(e);
            }
        }
        
        asyncFunExec();
        this.itemManutencaotableBtnModalRef.click();
    }

    onClickRemover() {
        if (this.state.selectRow.selected[0]) {
            this.props.modifyModalTitle('Remover');
            this.props.modifyModalMessage('Confirma a remoção do registro selecionado ?');
            this.props.modifyExtraData({ 
                item: {
                    itemmanutID: this.props.selectedItemManutRowId, 
                    id: this.state.selectRow.selected[0] 
                }, 
                action: 'remove_vincularitemmanut' 
            });
            this.itemManutVeicucloRemoveRef.click();
        }
    }

    onClickImportCsv() {
        this.importCsvItemManutRef.firstChild.firstChild.accept = '.txt,.csv';
        this.importCsvItemManutRef.firstChild.firstChild.value = '';
        this.importCsvItemManutRef.firstChild.firstChild.click();
    }

    onClickDropDownBtn() {
        this.setState({
            dropdownBtnOpen: !this.state.dropdownBtnOpen
        });
    }

    handleCsvFile(data, name) {
        if (!this.props.selectedItemManutRowId) {
            alert('Para efetuar a importação de veículos é necessário selecionar um item de manutenção.');
            return;
        }

        let newData = data.map(
            val => val.filter(
                 val2 => (val2 || (typeof val2 === 'number' && val2 === 0)
        )));

        newData = _.filter(newData, row => {
            if (row.length < 3) {
                return false;
            }

            for (let index = 0; index < row.length; index++) {
                const element = row[index].toLowerCase().trim();
                if ('fipe mês/ano|marca|modelo|ano|combustivel|combustivel'.includes(element)) {
                    return false;
                }
            }

            return true;
        })

        const numData = newData.length;

        if (numData) {
            this.props.modifyModalTitle('Confirmar');
            this.props.modifyModalMessage(
                `Confirma a inclusão de ${numData === 1 ? `${numData} linha ?` : `${numData} linhas ?`}`
            );
            this.props.modifyExtraData({ 
                item: { 
                    itemmanutID: this.props.selectedItemManutRowId, 
                    vehiclesTo: newData 
                }, 
                action: 'incluibatch_vincularitemmanut' 
            });
            this.itemManutVeicucloRemoveRef.click();
        } else {
            toastr.error('Erro', 'Falha na importação.');
        }
    }

    handleCsvFileError() {
        
    }

    handleOnSelect(row, isSelect, rowIndex, e) {
        if (isSelect) {
            this.setState({ selectRow: { ...this.state.selectRow, selected: [row.id] } });
        } else {
            this.setState({ selectRow: { ...this.state.selectRow, selected: [''] } });
        }
    }

    renderDropDownButton(csvProps) {
        return (
            <ButtonDropdown isOpen={this.state.dropdownBtnOpen} toggle={this.onClickDropDownBtn}>
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

    render() {
        const { data } = this.props;
        const dataTable = data || [];
        
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
                                    columns={this.columnsTable}
                                    exportCSV={ {
                                        fileName: 'itemmanutencaoxveiculos.csv',
                                        noAutoBOM: false,
                                        separator: ';'
                                    }}
                                    search
                                >
                                    {
                                        props => (
                                            <div>
                                                <div className='itemmanutencaotabletools'>
                                                    <div style={{ flex: 3 }}>
                                                        <button 
                                                            className="btn btn-danger"
                                                            onClick={() => this.onClickRemover()}
                                                            style={{ marginRight: 10 }}
                                                        >
                                                            Remover
                                                        </button>
                                                        <button
                                                            ref={ref => (this.itemManutVeicucloRemoveRef = ref)}
                                                            hidden
                                                            data-toggle="modal" data-target="#confirmmodal"
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
                                                    </div>
                                                    <div style={{ flex: 1 }}>
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
                                                    wrapperClasses="itemmanutencaotable"
                                                    //filter={filterFactory()}
                                                    exportCsv
                                                    bootstrap4
                                                    noDataIndication={this.props.vehiclesLoading ? () => <NoDataIndication /> : null}
                                                />
                                            </div>
                                        )
                                    }
                                </ToolkitProvider>
                            </div>
                        )
                    }}
                </ReactDropzone>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    vehiclesLoading: state.ItemManutencaoReducer.vehiclesLoading
});

setBinding({
    target: ItemManutencaoTableV.prototype,
    fn: ItemManutencaoTableV.prototype.onKeyUpOrDown,
    keys: [ /*KeyDownKeys.UP, KeyDownKeys.DOWN*/ ]
});

export default connect(mapStateToProps, {
    modifyModalTitle, 
    modifyModalMessage, 
    modifyExtraData
})(ItemManutencaoTableV);


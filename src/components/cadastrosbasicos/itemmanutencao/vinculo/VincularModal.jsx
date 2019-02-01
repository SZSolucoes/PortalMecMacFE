import React from 'react'
import { connect } from 'react-redux';
import LoadingOverlay from 'react-loading-overlay';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import _ from 'lodash';
import 'react-tabs/style/react-tabs.css';

import './Vincular.css';
import VincularTable from './VincularTable';
import VincularTableItens from './VincularTableItens';
import VincularTableGerenc from './VincularTableGerenc';
import Main from '../../../templates/Main';
import { modifyModalTitle, modifyModalMessage, modifyExtraData } from '../../../utils/UtilsActions';

class VincularModal extends React.Component {

    constructor(props) {
        super(props);

        this.renderBodyLote = this.renderBodyLote.bind(this);
        this.onClickConfirmLote = this.onClickConfirmLote.bind(this);
        this.onClickFecharLote = this.onClickFecharLote.bind(this);

        this.renderBodyGerenc = this.renderBodyGerenc.bind(this);
        this.onClickFecharGerenc = this.onClickFecharGerenc.bind(this);

        this.state = {
            itemmanutcombo: 0
        }
    }

    componentDidMount() {
        const { dataTableItemManutencao } = this.props;

        if (dataTableItemManutencao.length) {
            this.setState({
                itemmanutcombo: dataTableItemManutencao[0].id
            });
        }
    }

    componentDidUpdate() {
        const { dataTableItemManutencao } = this.props;

        if (this.state.itemmanutcombo === 0 && dataTableItemManutencao.length) {
            this.setState({
                itemmanutcombo: dataTableItemManutencao[0].id
            });
        }
    }

    onClickConfirmLote() {
        const retItens = this.VincularTableItensRef.getWrappedInstance().onClickConfirm();

        if (!retItens.success) return

        const retVeiculos = this.VincularTableRef.getWrappedInstance().onClickConfirm();

        if (!(retItens.success && retVeiculos.success)) return;

        this.props.modifyModalTitle('Confirmar');
        this.props.modifyModalMessage(
            `Confirma o vínculo para ${retVeiculos.values.length === 1 ? 'o veículo selecionado': 'os veículos selecionados'} ?`
        );

        const params = {
            itens: retItens.values,
            veiculos: retVeiculos.values
        };

        this.props.modifyExtraData({ 
            params, 
            action: 'confirm_vincularitemmanut',
            btnCloseModal: { click: this.onClickFecharLote }
        });
        
        this.confirmVincularBtnRef.click();
    }

    onClickFecharLote() {
        this.VincularTableItensRef.getWrappedInstance().onClickFechar();
        this.VincularTableRef.getWrappedInstance().onClickFechar();
    }

    onClickFecharGerenc() {
        this.VincularTableGerencVeicRef.getWrappedInstance().onClickFechar();
    }

    renderBodyLote() {
        return (
            <div id='vincularmain' className='d-flex flex-row'>
                <Main>
                    <h4>Itens de manutenção</h4>
                    <VincularTableItens
                        ref={ref => (this.VincularTableItensRef = ref)}
                        btnCloseModal={this.buttonFecharLoteRef}
                    />
                </Main>
                <Main>
                    <h4>Veículos</h4>
                    <VincularTable 
                        ref={ref => (this.VincularTableRef = ref)}
                        btnCloseModal={this.buttonFecharLoteRef}
                    />
                </Main>
            </div>
        );
    }

    renderBodyGerenc() {
        return (    
            <VincularTableGerenc
                ref={ref => (this.VincularTableGerencVeicRef = ref)}
                btnCloseModal={this.buttonFecharLoteRef}
            /> 
        );
    }

    render() {
        return (
            <div>
                <div 
                    className="modal fade" 
                    id="vincularitemmanut" 
                    tabIndex="-1" 
                    role="dialog" 
                    aria-labelledby="exampleModalLabel" 
                    aria-hidden="true"
                >
                    <LoadingOverlay
                        active={this.props.overlayModal}
                        spinner
                        text='Vínculo em andamento...'
                    >
                        <div 
                            className="modal-dialog modal-auto-size modal-full"
                            role="document"
                        >
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h2 className="mt-3" ref={(ref) => { this.textCadProp = ref; }}>
                                        Vincular
                                    </h2>
                                </div>
                                <div className="modal-body">
                                    <React.Fragment>
                                        <div className="">
                                            <Tabs forceRenderTabPanel>
                                                <TabList>
                                                    <Tab style={{ paddingLeft: 30, paddingRight: 30, paddingTop: 15 }}>
                                                        <h6 style={{ alignSelf: 'flex-end' }}><b>Gerenciado</b></h6>
                                                    </Tab>
                                                    <Tab style={{ paddingLeft: 30, paddingRight: 30, paddingTop: 15 }}>
                                                        <h6 style={{ alignSelf: 'flex-end' }}><b>Em Lote</b></h6>
                                                    </Tab>
                                                </TabList>
                                                <TabPanel>
                                                    <div 
                                                        className="row col-12 d-flex justify-content-start"
                                                    >
                                                        <div className='form-group col-4'>
                                                            <label htmlFor='itemmanutcombo'>Item Manutenção</label>
                                                            <select
                                                                className="form-control" 
                                                                name="itemmanutcombo"
                                                                value={this.state.itemmanutcombo}
                                                                onChange={event => 
                                                                    this.setState({ 
                                                                        itemmanutcombo: event.target.value 
                                                                    })
                                                                }
                                                            >
                                                                {
                                                                    _.map(
                                                                        this.props.dataTableItemManutencao, 
                                                                        (dt, index) => {
                                                                            return (
                                                                                <option 
                                                                                    key={index} 
                                                                                    value={dt.id}
                                                                                >
                                                                                    {dt.itemabrev}
                                                                                </option>
                                                                            );
                                                                        }
                                                                    )
                                                                }
                                                            </select>
                                                        </div>
                                                        <div
                                                            className='buttonmove'
                                                        >
                                                            <button 
                                                                className="btn btn-primary"
                                                                type="button"
                                                                onClick={() => {
                                                                    this
                                                                    .VincularTableGerencVeicRef
                                                                    .getWrappedInstance()
                                                                    .onClickVincItem(this.state.itemmanutcombo)
                                                                }}
                                                            >
                                                                Vincular Item
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {this.renderBodyGerenc()}
                                                    <div className="row">
                                                        <div className="col-12 modal-footer d-flex justify-content-end">
                                                            <button
                                                                ref={ref => (this.buttonFecharGerencRef = ref)} 
                                                                type="button" 
                                                                className="btn btn-secondary"
                                                                onClick={() => this.onClickFecharGerenc()}
                                                                data-dismiss="modal">
                                                                Fechar
                                                            </button>
                                                        </div>
                                                    </div>
                                                </TabPanel>
                                                <TabPanel>
                                                    {this.renderBodyLote()}
                                                    <div className="row">
                                                        <div className="col-12 modal-footer d-flex justify-content-end">
                                                            <button 
                                                                className="btn btn-primary"
                                                                type="button"
                                                                onClick={() =>  this.onClickConfirmLote()}
                                                            >
                                                                Confirmar
                                                            </button>
                                                            <button
                                                                ref={ref => (this.buttonFecharLoteRef = ref)} 
                                                                type="button" 
                                                                className="btn btn-secondary"
                                                                onClick={() => this.onClickFecharLote()}
                                                                data-dismiss="modal">
                                                                Fechar
                                                            </button>
                                                        </div>
                                                    </div>
                                                </TabPanel>
                                            </Tabs>
                                        </div>
                                    </React.Fragment>
                                </div>
                            </div>
                        </div>
                        <button
                            ref={ref => (this.confirmVincularBtnRef = ref)}
                            hidden
                            data-toggle="modal" data-target="#confirmmodal"
                            data-backdrop="static" data-keyboard="false"
                        />
                    </LoadingOverlay>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    overlayModal: state.VincularReducer.overlayModal,
    dataTableItemManutencao: state.ItemManutencaoReducer.dataTableItemManutencao
});

export default connect(mapStateToProps, {
    modifyModalTitle, 
    modifyModalMessage, 
    modifyExtraData
})(VincularModal);


import React from 'react'
import { connect } from 'react-redux';
import LoadingOverlay from 'react-loading-overlay';
import 'react-tabs/style/react-tabs.css';

import './Vincular.css';
import VincularTable from './VincularTable';
import VincularTableItens from './VincularTableItens';
import Main from '../../../templates/Main';
import { modifyModalTitle, modifyModalMessage, modifyExtraData } from '../../../utils/UtilsActions';

class VincularModal extends React.Component {

    constructor(props) {
        super(props);

        this.renderBody = this.renderBody.bind(this);
        this.onClickConfirm = this.onClickConfirm.bind(this);
        this.onClickFechar = this.onClickFechar.bind(this);
    }

    onClickConfirm() {
        const retItens = this.VincularTableItensRef.getWrappedInstance().onClickConfirm();

        if (!retItens.success) return

        const retVeiculos = this.VincularTableRef.getWrappedInstance().onClickConfirm();

        if (!(retItens.success && retVeiculos.success)) return;

        this.props.modifyModalTitle('Confirmar');
        this.props.modifyModalMessage(
            `Confirma o vínculo para ${retVeiculos.values.length === 1 ? 'o veículo selecionado': 'os veículos selecionados'} ?`
        );

        const params = {
            itens: retItens,
            veiculos: retVeiculos
        };

        this.props.modifyExtraData({ 
            params, 
            action: 'confirm_vincularitemmanut',
            btnCloseModal: this.props.btnCloseModal
        });
        
        this.confirmVincularBtnRef.click();
    }

    onClickFechar() {
        this.VincularTableItensRef.getWrappedInstance().onClickFechar();
        this.VincularTableRef.getWrappedInstance().onClickFechar();
    }

    renderBody() {
        return (
            <div id='vincularmain' className='d-flex flex-row'>
                <Main>
                    <h4>Itens de manutenção</h4>
                    <VincularTableItens
                        ref={ref => (this.VincularTableItensRef = ref)}
                        btnCloseModal={this.buttonFecharRef}
                    />
                </Main>
                <Main>
                    <h4>Veículos</h4>
                    <VincularTable 
                        ref={ref => (this.VincularTableRef = ref)}
                        btnCloseModal={this.buttonFecharRef}
                    />
                </Main>
            </div>
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
                                            {this.renderBody()}
                                            <div className="row">
                                                <div className="col-12 modal-footer d-flex justify-content-end">
                                                    <button 
                                                        className="btn btn-primary"
                                                        type="button"
                                                        onClick={() =>  this.onClickConfirm()}
                                                    >
                                                        Confirmar
                                                    </button>
                                                    <button
                                                        ref={ref => (this.buttonFecharRef = ref)} 
                                                        type="button" 
                                                        className="btn btn-secondary"
                                                        onClick={() => this.onClickFechar()}
                                                        data-dismiss="modal">
                                                        Fechar
                                                    </button>
                                                </div>
                                            </div>
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
    overlayModal: state.VincularReducer.overlayModal
});

export default connect(mapStateToProps, {
    modifyModalTitle, 
    modifyModalMessage, 
    modifyExtraData
})(VincularModal);


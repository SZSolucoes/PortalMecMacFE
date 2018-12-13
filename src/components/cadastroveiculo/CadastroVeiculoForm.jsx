import React from 'react'
import { connect } from 'react-redux';
import { Field, reduxForm, getFormValues, change, reset } from 'redux-form'
import { createNumberMask } from 'redux-form-input-masks';
import { withRouter } from 'react-router-dom';

import _ from 'lodash';

import { 
    doPostVeiculo, 
    doPutVeiculo,
    modifyFormType 
} from './CadastroVeiculoActions';

import {
    required
} from '../utils/validForms';
import { store } from '../../index';
import { 
    consultarMarcas,
    consultarModelos,
    consultarAnoModelo,
    ConsultarValorComTodosParametros
} from '../utils/fipeApi';

import { modifyComplementosItem } from '../complementos/ComplementosActions';

import './CadastroVeiculoStyle.css';

class CadastroVeiculoForm extends React.Component {

    constructor(props) {
        super(props);

        this.onSubmitVeiculoForm = this.onSubmitVeiculoForm.bind(this);
        this.onClickCarregar = this.onClickCarregar.bind(this);
        this.renderField = this.renderField.bind(this);
        this.renderFipeRefOptions = this.renderFipeRefOptions.bind(this);
        this.renderFipeMarcaOptions = this.renderFipeMarcaOptions.bind(this);
        this.renderFipeModeloOptions = this.renderFipeModeloOptions.bind(this);
        this.renderFipeAnoOptions = this.renderFipeAnoOptions.bind(this);
        this.consultarFipe = this.consultarFipe.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.resetFields = this.resetFields.bind(this);
    }

    onSubmitVeiculoForm(values) {
        const {
            fipemesano,
            marca,
            modelo,
            ano,
            valor,
            combustivel
        } = values;

        const newId = `${fipemesano.trim()}|${marca.trim()}|${modelo.trim()}|${ano.trim()}`;

        const newValues = {
            id: newId,
            fipeperiodoref: fipemesano,
            marca,
            modelo,
            ano,
            valor,
            combustivel,
            vehicletype: this.props.formVeiculoType
         };

        if (this.props.formType === '2') {
            newValues.id = this.props.idVeiculo;
            this.props.doPutVeiculo(newValues, '', this.hideModal);
        } else {
            this.props.doPostVeiculo(newValues, this.hideModal);
        }
    }

    onClickCarregar() {
        const asyncFunExec = async () => {
            const state = store.getState();
            const formValues = getFormValues('cadastroveiculos')(state);
            const fipePeriodoRef = formValues.fipeperiodoref;
            const fipeMarca = formValues.fipemarca
            const fipeModelo = formValues.fipemodelo;
            const fipeAno = formValues.fipeano;

            if (fipePeriodoRef && fipeMarca && fipeModelo && fipeAno) {
                const fipeAnoSplited = fipeAno.split('-');
    
                const anoModelo = fipeAnoSplited[0];
                const tipoCombustivel = fipeAnoSplited[1];

                const todosValores = await ConsultarValorComTodosParametros(
                    fipePeriodoRef,
                    this.props.formVeiculoType,
                    fipeMarca,
                    fipeAno,
                    tipoCombustivel,
                    anoModelo,
                    fipeModelo
                );

                if (fipePeriodoRef) {
                    const fipePeriodoRefObj = _.find(
                        this.props.fipeTabRef, (item) => item.Codigo.toString().trim() === fipePeriodoRef.toString().trim());
            
                    store.dispatch(change('cadastroveiculos', 'fipemesano', fipePeriodoRefObj.Mes.trim()));
                }
                if (fipeMarca) {
                    const fipeMarcaText = _.find(this.props.fipeMarcas, (item) => item.Value.toString() === fipeMarca.toString());
                    store.dispatch(change('cadastroveiculos', 'marca', fipeMarcaText.Label));
                }
                if (fipeModelo) {
                    const fipeModeloText = _.find(this.props.fipeModelos, (item) => item.Value.toString() === fipeModelo.toString());
                    store.dispatch(change('cadastroveiculos', 'modelo', fipeModeloText.Label));
                }
                if (fipeAno) {
                    const fipeAnoText = _.find(this.props.fipeAnos, (item) => item.Value.toString() === fipeAno.toString());
                    let newLabel = fipeAnoText.Label;
                    newLabel = newLabel.replace(/[^0-9]/g, '').replace('32000', 'Zero KM');
                    
                    store.dispatch(change('cadastroveiculos', 'ano', newLabel));
                }
                if (todosValores.success && todosValores.data) {
                    if (todosValores.data.Valor) {
                        const constNewValue = parseFloat(todosValores.data.Valor
                        .replace('R$', '').replace('.', '').replace(',', '.').trim());
                        store.dispatch(change('cadastroveiculos', 'valor', constNewValue));
                    }
                    if (todosValores.data.Combustivel) {
                        store.dispatch(change('cadastroveiculos', 'combustivel', todosValores.data.Combustivel));
                    }  
                }
            } else {
                if (fipePeriodoRef) {
                    const fipePeriodoRefObj = _.find(
                        this.props.fipeTabRef, (item) => item.Codigo.toString().trim() === fipePeriodoRef.toString().trim());
            
                    store.dispatch(change('cadastroveiculos', 'fipemesano', fipePeriodoRefObj.Mes.trim()));
                }
                if (fipeMarca) {
                    const fipeMarcaText = _.find(this.props.fipeMarcas, (item) => item.Value.toString() === fipeMarca.toString());
                    store.dispatch(change('cadastroveiculos', 'marca', fipeMarcaText.Label));
                }
                if (fipeModelo) {
                    const fipeModeloText = _.find(this.props.fipeModelos, (item) => item.Value.toString() === fipeModelo.toString());
                    store.dispatch(change('cadastroveiculos', 'modelo', fipeModeloText.Label));
                }
                if (fipeAno) {
                    const fipeAnoText = _.find(this.props.fipeAnos, (item) => item.Value.toString() === fipeAno.toString());
                    store.dispatch(change('cadastroveiculos', 'ano', fipeAnoText.Label));
                }
            }
        };
        asyncFunExec();
    }

    consultarFipe(event, field) {
        const state = store.getState();
        switch (field) {
            case 'fipeperiodoref':
                const valuePeriodo = event.target.value;
                const veiculoPeriodo = this.props.formVeiculoType;
                const funExecPeriodo = async () => {
                    const marcas = await consultarMarcas(valuePeriodo, veiculoPeriodo);
                    if (marcas.success) {
                        store.dispatch({
                            type: 'modify_fipemarcas_cadastroveiculo',
                            payload: marcas.data
                        })
                        store.dispatch(change('cadastroveiculos', 'fipemarca', marcas.data[0].Value));
                        this.consultarFipe({ target: { value: marcas.data[0].Value } }, 'fipemarca');
                    } else { return }
                }
                funExecPeriodo();
                break;
            case 'fipemarca':
                const valueMarca = event.target.value;
                const veiculoMarca = this.props.formVeiculoType;
                const funExecMarca = async () => {
                    const fipePeriodoRef = getFormValues('cadastroveiculos')(state).fipeperiodoref;
                    if (fipePeriodoRef) {
                        const modelos = await consultarModelos(
                            fipePeriodoRef,
                            veiculoMarca,
                            valueMarca
                        );
                        if (modelos.success) {
                            store.dispatch({
                                type: 'modify_fipemodelos_cadastroveiculo',
                                payload: modelos.data
                            })
                            store.dispatch(change('cadastroveiculos', 'fipemodelo', modelos.data[0].Value));
                            this.consultarFipe({ target: { value: modelos.data[0].Value } }, 'fipemodelo');
                        } 
                    }
                }
                funExecMarca();
                break;
            case 'fipemodelo':
                const valueModelo = event.target.value;
                const veiculoModelo = this.props.formVeiculoType;
                const funExecModelo = async () => {
                    const fipePeriodoRef = getFormValues('cadastroveiculos')(state).fipeperiodoref;
                    const fipeMarca = getFormValues('cadastroveiculos')(state).fipemarca;
                    if (fipePeriodoRef && fipeMarca) {
                        const marcas = await consultarAnoModelo(
                            fipePeriodoRef,
                            veiculoModelo,
                            fipeMarca,
                            valueModelo
                        );
                        if (marcas.success) {
                            store.dispatch({
                                type: 'modify_fipeanos_cadastroveiculo',
                                payload: marcas.data
                            })
                            store.dispatch(change('cadastroveiculos', 'fipeano', marcas.data[0].Value));
                        } 
                    }
                }
                funExecModelo();
                break;

            default:
        }
    }

    hideModal(item) {
        this.confirmCadVeiculoBtnRef.click();
        store.dispatch(reset('cadastroveiculos'));

        this.props.modifyComplementosItem(item);
        this.props.history.push('/complementos');
    }

    resetFields(reset) {
        const {
            fipeTabRef
        } = this.props;

        let fipePeriodoRefValue = '';

        if (fipeTabRef && fipeTabRef.length > 0) {
            fipePeriodoRefValue = fipeTabRef[0].Codigo;
        }

        reset();

        setTimeout(() => {
            store.dispatch(change('cadastroveiculos', 'fipeperiodoref', fipePeriodoRefValue));
            this.consultarFipe({ target: { value: fipePeriodoRefValue } }, 'fipeperiodoref');
        }, 500);
    }

    renderFipeRefOptions() {
        return this.props.fipeTabRef.map((value, index) => 
            <option key={index} value={value.Codigo}>{value.Mes}</option>
        );
    }

    renderFipeMarcaOptions() {
        const options = this.props.fipeMarcas.map((value, index) => 
            <option key={index} value={value.Value}>{value.Label}</option>
        );

        return options;
    }

    renderFipeModeloOptions() {
        const options = this.props.fipeModelos.map((value, index) => 
            <option key={index} value={value.Value}>{value.Label}</option>
        );

        return options;
    }

    renderFipeAnoOptions() {
        const options = this.props.fipeAnos.map((value, index) => {
            let newLabel = value.Label;
            if (newLabel.includes('32000')) {
                newLabel = newLabel.replace('32000', 'Zero KM');
            }
            return <option key={index} value={value.Value}>{newLabel}</option>
        }
        );

        return options;
    }

    renderField({ input, label, type, meta: { touched, error, warning, submitFailed } }) {
        return (
            <div>
                <input {...input} type={type} className="form-control" />
                { submitFailed && ((error && <span className="required">{error}</span>) || (warning && <span>{warning}</span>))}
            </div> 
        );
    } 

    render() {
        const { handleSubmit, pristine, reset, submitting } = this.props
        return (
            <form onSubmit={handleSubmit(this.onSubmitVeiculoForm)}>
                <div className="form">
                    <div className="divdatabasic">
                        <h4>Fipe</h4>
                        <div className="row">
                            <div className="col-12 col-md-6 col-lg-6 col-xl-2">
                                <div className="form-group">
                                    <label htmlFor="fipeperiodoref">Período</label>
                                    <Field 
                                        component="select" 
                                        className="form-control" 
                                        name="fipeperiodoref"
                                        onChange={event => this.consultarFipe(event, 'fipeperiodoref')}
                                    >
                                        {this.renderFipeRefOptions()}
                                    </Field>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 col-lg-6 col-xl-3">
                                <div className="form-group">
                                    <label htmlFor="fipemarca">Marca</label>
                                    <Field 
                                        component="select" 
                                        className="form-control" 
                                        name="fipemarca"
                                        onChange={event => this.consultarFipe(event, 'fipemarca')}
                                    >
                                        {this.renderFipeMarcaOptions()}
                                    </Field>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 col-lg-6 col-xl-5">
                                <div className="form-group">
                                    <label htmlFor="fipemodelo">Modelo</label>
                                    <Field 
                                        component="select" 
                                        className="form-control" 
                                        name="fipemodelo"
                                        onChange={event => this.consultarFipe(event, 'fipemodelo')}
                                    >
                                        {this.renderFipeModeloOptions()}
                                    </Field>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 col-lg-6 col-xl-2">
                                <div className="form-group">
                                    <label htmlFor="fipeano">Ano</label>
                                    <Field 
                                        component="select" 
                                        className="form-control" 
                                        name="fipeano"
                                    >
                                        {this.renderFipeAnoOptions()}
                                    </Field>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 d-flex justify-content-end">
                                <button 
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={() => this.onClickCarregar()}
                                >
                                    Carregar
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="divdatabasic">
                        <hr />
                        <h4>Dados Básicos</h4>
                        <div className="row">
                            <div className="col-12 col-md-4">
                                <div className="form-group">
                                    <label htmlFor="fipemesano">Fipe Mês/Ano</label>
                                    <Field 
                                        component={this.renderField}
                                        type="text"
                                        className="form-control" 
                                        name="fipemesano"
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-4">
                                <div className="form-group">
                                    <label htmlFor="marca">Marca *</label>
                                    <Field 
                                        component={this.renderField}
                                        type="text"
                                        className="form-control" 
                                        name="marca"
                                        validate={[ required ]}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-4">
                                <div className="form-group">
                                    <label htmlFor="modelo">Modelo *</label>
                                    <Field 
                                        component={this.renderField}
                                        type="text" 
                                        className="form-control" 
                                        name="modelo"
                                        validate={[ required ]}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-md-4">
                                <div className="form-group">
                                    <label htmlFor="ano">Ano *</label>
                                    <Field 
                                        component={this.renderField}
                                        type="text" 
                                        className="form-control" 
                                        name="ano"
                                        validate={[ required ]}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-4">
                                <div className="form-group">
                                    <label htmlFor="valor">Valor</label>
                                    <Field 
                                        component={this.renderField}
                                        type="text" 
                                        className="form-control" 
                                        name="valor"
                                        {...createNumberMask({
                                            prefix: 'R$ ',
                                            decimalPlaces: 2,
                                            locale: 'pt-BR',
                                        })}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-4">
                                <div className="form-group">
                                    <label htmlFor="combustivel">Combustível</label>
                                    <Field 
                                        component="input" 
                                        type="text" 
                                        className="form-control" 
                                        name="combustivel"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 modal-footer d-flex justify-content-end">
                                <button 
                                    className="btn btn-primary"
                                    type="submit"
                                    disabled={pristine || submitting}
                                >
                                    Confirmar
                                </button>
                                <button
                                    ref={ref => (this.confirmCadVeiculoBtnRef = ref)}
                                    hidden
                                    data-dismiss="modal"
                                />
                                <button 
                                    className="btn btn-secondary"
                                    type="button"
                                    disabled={pristine || submitting}
                                    onClick={() => this.resetFields(reset)}
                                >
                                    Limpar
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => reset()} 
                                    data-dismiss="modal">
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div> 
                </div>
            </form>
          );
    }
}

const mapStateToProps = (state) => ({
    idProp: state.CadastroVeiculoReducer.idProp,
    formType: state.CadastroVeiculoReducer.formType,
    formVeiculoType: state.CadastroVeiculoReducer.formVeiculoType,
    fipeTabRef: state.CadastroVeiculoReducer.fipeTabRef,
    fipeMarcas: state.CadastroVeiculoReducer.fipeMarcas,
    fipeModelos: state.CadastroVeiculoReducer.fipeModelos,
    fipeAnos: state.CadastroVeiculoReducer.fipeAnos,
    initialValues: {
        fipeperiodoref: '',
        fipemarca: '',
        fipemodelo: '',
        fipeano: '',
        fipemesano: '',
        marca: '',
        modelo: '',
        ano: '',
        valor: '',
        combustivel: ''
    }
});

CadastroVeiculoForm = reduxForm({
    form: 'cadastroveiculos',
    destroyOnUnmount: false
})(CadastroVeiculoForm); 

export default withRouter(connect(mapStateToProps, { 
    doPostVeiculo, 
    doPutVeiculo,
    modifyComplementosItem,
    modifyFormType 
})(CadastroVeiculoForm));


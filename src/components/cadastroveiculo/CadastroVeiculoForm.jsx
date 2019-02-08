import React from 'react'
import { connect } from 'react-redux';
import { Field, reduxForm, change, reset } from 'redux-form'
import { createNumberMask } from 'redux-form-input-masks';
import { withRouter } from 'react-router-dom';
import Select from 'react-select';

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

        this.state = {
            lockCombos: false,
            fipeperiodoref: 0,
            fipemarca: 0,
            fipemodelo: 0,
            fipeano: 0
        }
    }

    componentDidUpdate(prevProps) {
        const {
            fipeTabRef,
            formVeiculoType
         } = this.props;

         const validNumber = typeof this.state.fipeperiodoref === 'number';
         const validPropsVeic = !!formVeiculoType;
         const validPrevPropsVeic = !!prevProps.formVeiculoType;
         const validDiffProps = validPropsVeic && validPrevPropsVeic && prevProps.formVeiculoType !== formVeiculoType;

         if ((validNumber && validPropsVeic) || validDiffProps) {
            let fipePeriodoRefValue = '';
            let fipePeriodoRefMes = '';
    
            if (fipeTabRef && fipeTabRef.length > 0) {
                fipePeriodoRefValue = fipeTabRef[0].Codigo;
                fipePeriodoRefMes = fipeTabRef[0].Mes;
            }

            if (fipePeriodoRefValue && fipePeriodoRefMes) {
                const fipeperiodorefoption = { value: fipePeriodoRefValue, label: fipePeriodoRefMes };
                this.consultarFipe(fipeperiodorefoption, 'fipeperiodoref');
            }
         }
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
            newValues.newId = newId;
            this.props.doPutVeiculo(newValues, () => this.closeBtn);
        } else {
            this.props.doPostVeiculo(newValues, this.hideModal);
        }
    }

    onClickCarregar() {
        const asyncFunExec = async () => {
            const {
                fipeperiodoref,
                fipemarca,
                fipemodelo,
                fipeano
            } = this.state;
            const fipePeriodoRef = typeof fipeperiodoref === 'object' ? fipeperiodoref.value : undefined;
            const fipeMarca = typeof fipemarca === 'object' ? fipemarca.value : undefined;
            const fipeModelo = typeof fipemodelo === 'object' ? fipemodelo.value : undefined;
            const fipeAno = typeof fipeano === 'object' ? fipeano.value : undefined;

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
                        .replace('R$', '').replace(/\./g, '').replace(/,/g, '.').trim());
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

    consultarFipe(option, field) {
        this.setState({ lockCombos: true });
        switch (field) {
            case 'fipeperiodoref':
                this.setState({ fipeperiodoref: option });
                const valuePeriodo = option.value;
                const veiculoPeriodo = this.props.formVeiculoType;
                console.log(veiculoPeriodo);
                const funExecPeriodo = async () => {
                    const marcas = await consultarMarcas(valuePeriodo, veiculoPeriodo);
                    if (marcas.success && marcas.data instanceof Array) {
                        store.dispatch({
                            type: 'modify_fipemarcas_cadastroveiculo',
                            payload: marcas.data
                        })

                        const fipemarcaoption = { value: marcas.data[0].Value, label: marcas.data[0].Label };
                        this.setState({ fipemarca: fipemarcaoption });
                        this.consultarFipe(fipemarcaoption, 'fipemarca');
                    } else { return }
                }
                funExecPeriodo();
                break;
            case 'fipemarca':
                this.setState({ fipemarca: option });
                const valueMarca = option.value;
                const veiculoMarca = this.props.formVeiculoType;
                const funExecMarca = async () => {
                    const fipePeriodoRef = this.state.fipeperiodoref.value;
                    if (fipePeriodoRef) {
                        const modelos = await consultarModelos(
                            fipePeriodoRef,
                            veiculoMarca,
                            valueMarca
                        );
                        if (modelos.success && modelos.data instanceof Array) {
                            store.dispatch({
                                type: 'modify_fipemodelos_cadastroveiculo',
                                payload: modelos.data
                            })

                            const fipemodelooption = { value: modelos.data[0].Value, label: modelos.data[0].Label };
                            this.setState({ fipemodelo: fipemodelooption });
                            this.consultarFipe(fipemodelooption, 'fipemodelo');
                        } 
                    }
                }
                funExecMarca();
                break;
            case 'fipemodelo':
                this.setState({ fipemodelo: option });
                const valueModelo = option.value;
                const veiculoModelo = this.props.formVeiculoType;
                const funExecModelo = async () => {
                    const fipePeriodoRef = this.state.fipeperiodoref.value;
                    const fipeMarca = this.state.fipemarca.value;
                    if (fipePeriodoRef && fipeMarca) {
                        const ano = await consultarAnoModelo(
                            fipePeriodoRef,
                            veiculoModelo,
                            fipeMarca,
                            valueModelo
                        );
                        if (ano.success && ano.data instanceof Array) {
                            store.dispatch({
                                type: 'modify_fipeanos_cadastroveiculo',
                                payload: ano.data
                            });
                            let newLabel = ano.data[0].Label;
                            if (newLabel.includes('32000')) {
                                newLabel = newLabel.replace('32000', 'Zero KM');
                            }
                            const fipeanooption = { value: ano.data[0].Value, label: newLabel };
                            this.setState({ fipeano: fipeanooption });
                        } 
                    }
                }
                funExecModelo();
                break;
            case 'fipeano':
                this.setState({ fipeano: option });
                break;
            default:
        }
        setTimeout(() => this.setState({ lockCombos: false }), 1000);
    }

    hideModal(item) {
        //this.confirmCadVeiculoBtnRef.click();
        //store.dispatch(reset('cadastroveiculos'));

        store.dispatch(change('cadastroveiculos', 'fipemesano', ''));
        store.dispatch(change('cadastroveiculos', 'marca', ''));
        store.dispatch(change('cadastroveiculos', 'modelo', ''));
        store.dispatch(change('cadastroveiculos', 'ano', ''));
        store.dispatch(change('cadastroveiculos', 'valor', ''));
        store.dispatch(change('cadastroveiculos', 'combustivel', ''));

        this.setState({
            lockCombos: false,
            fipeperiodoref: 0,
            fipemarca: 0,
            fipemodelo: 0,
            fipeano: 0
        });

        //this.props.modifyComplementosItem(item);
        //this.props.history.push('/complementos');
    }

    resetFields(reset) {
        const {
            fipeTabRef,
            formType,
            formValues
        } = this.props;

        let fipePeriodoRefValue = '';
        let fipePeriodoRefMes = '';

        if (fipeTabRef && fipeTabRef.length > 0) {
            fipePeriodoRefValue = fipeTabRef[0].Codigo;
            fipePeriodoRefMes = fipeTabRef[0].Mes;
        }

        reset();

        if (formType === '2') {
            store.dispatch(change('cadastroveiculos', 'fipemesano', formValues.fipeperiodoref));
            store.dispatch(change('cadastroveiculos', 'marca', formValues.marca));
            store.dispatch(change('cadastroveiculos', 'modelo', formValues.modelo));
            store.dispatch(change('cadastroveiculos', 'ano', formValues.ano));
            store.dispatch(change('cadastroveiculos', 'valor', formValues.valor));
            store.dispatch(change('cadastroveiculos', 'combustivel', formValues.combustivel));
        }

        setTimeout(() => {
            const fipeperiodorefoption = { value: fipePeriodoRefValue, label: fipePeriodoRefMes };
            this.consultarFipe(fipeperiodorefoption, 'fipeperiodoref');
        }, 500);
    }

    renderFipeRefOptions() {
        return this.props.fipeTabRef.map((value, index) => ({ value: value.Codigo, label: value.Mes }));
    }

    renderFipeMarcaOptions() {
        return this.props.fipeMarcas.map((value, index) => ({ value: value.Value, label: value.Label }));
    }

    renderFipeModeloOptions() {
        return this.props.fipeModelos.map((value, index) => ({ value: value.Value, label: value.Label }));
    }

    renderFipeAnoOptions() {
        return this.props.fipeAnos.map((value, index) => {
            let newLabel = value.Label;
            if (newLabel.includes('32000')) {
                newLabel = newLabel.replace('32000', 'Zero KM');
            }

            return ({ value: value.Value, label: newLabel });
        });
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
        const { handleSubmit, pristine, reset, submitting } = this.props;
        return (
            <form onSubmit={handleSubmit(this.onSubmitVeiculoForm)}>
                <div className="form">
                    <div className="divdatabasic" style={{ overflow: 'visible' }}>
                        <h4>Fipe</h4>
                        <div className="row">
                            <div className="col-12 col-md-6 col-lg-6 col-xl-2">
                                <div className="form-group">
                                    <label htmlFor="fipeperiodoref">Período</label>
                                    <Select 
                                        name="fipeperiodoref"
                                        value={this.state.fipeperiodoref}
                                        onChange={option => this.consultarFipe(option, 'fipeperiodoref')}
                                        noOptionsMessage={() => 'Não há opções...'}
                                        isDisabled={this.state.lockCombos}
                                        options={this.renderFipeRefOptions()}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-6 col-lg-6 col-xl-3">
                                <div className="form-group">
                                    <label htmlFor="fipemarca">Marca</label>
                                    <Select 
                                        name="fipemarca"
                                        value={this.state.fipemarca}
                                        onChange={option => this.consultarFipe(option, 'fipemarca')}
                                        noOptionsMessage={() => 'Não há opções...'}
                                        isDisabled={this.state.lockCombos}
                                        options={this.renderFipeMarcaOptions()}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-6 col-lg-6 col-xl-5">
                                <div className="form-group">
                                    <label htmlFor="fipemodelo">Modelo</label>
                                    <Select 
                                        name="fipemodelo"
                                        value={this.state.fipemodelo}
                                        onChange={option => this.consultarFipe(option, 'fipemodelo')}
                                        noOptionsMessage={() => 'Não há opções...'}
                                        isDisabled={this.state.lockCombos}
                                        options={this.renderFipeModeloOptions()}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-6 col-lg-6 col-xl-2">
                                <div className="form-group">
                                    <label htmlFor="fipeano">Ano</label>
                                    <Select 
                                        name="fipeano"
                                        value={this.state.fipeano}
                                        onChange={option => this.consultarFipe(option, 'fipeano')}
                                        noOptionsMessage={() => 'Não há opções...'}
                                        isDisabled={this.state.lockCombos}
                                        options={this.renderFipeAnoOptions()}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 d-flex justify-content-end">
                                <button 
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={() => this.onClickCarregar()}
                                    disabled={this.state.lockCombos}
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
                                    {this.props.formType === '2' ? 'Restaurar' : 'Limpar'}
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    ref={ref => (this.closeBtn = ref)}
                                    onClick={() => { reset(); this.hideModal(); }} 
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

const mapStateToProps = (state) => {
    const formValues = state.CadastroVeiculoReducer.formValues;
    const formType = state.CadastroVeiculoReducer.formType;
    const initialValues = {
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
    };

    return ({
        formType,
        formValues,
        formVeiculoType: state.CadastroVeiculoReducer.formVeiculoType,
        idVeiculo: state.CadastroVeiculoReducer.idVeiculo,
        fipeTabRef: state.CadastroVeiculoReducer.fipeTabRef,
        fipeMarcas: state.CadastroVeiculoReducer.fipeMarcas,
        fipeModelos: state.CadastroVeiculoReducer.fipeModelos,
        fipeAnos: state.CadastroVeiculoReducer.fipeAnos,
        initialValues
    });
};

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


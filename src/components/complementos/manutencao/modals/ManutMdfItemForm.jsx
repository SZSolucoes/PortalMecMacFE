import React from 'react'
import { connect } from 'react-redux';
import { Field, reduxForm, change } from 'redux-form';
import RadioGroup from '../../../utils/RadioGroup';

import { store } from '../../../../index';
import { doPutManutencao } from '../../manutencao/ManutencaoActions';

class ManutMdfItemForm extends React.Component {
    
    constructor(props) {
        super(props);

        this.renderField = this.renderField.bind(this);
        this.onSubmitModifyForm = this.onSubmitModifyForm.bind(this);
        this.resetFields = this.resetFields.bind(this);
    }

    onSubmitModifyForm(values) {
        const {
            id,
            mes,
            milhas,
            km,
            manutencao,
        } = values;

        const params = {
            id,
            mes,
            milhas,
            quilometros: km,
            tipomanut: manutencao
        };

        this.props.doPutManutencao(params, () => this.closeBtn);
    }

    resetFields(reset) {
        const {
            formValues
        } = this.props;

        reset();

        store.dispatch(change('manutmdfitemform', 'id', formValues.id));
        store.dispatch(change('manutmdfitemform', 'itemabrev', formValues.itemabrev));
        store.dispatch(change('manutmdfitemform', 'itemmanut', formValues.itemmanut));
        store.dispatch(change('manutmdfitemform', 'mes', formValues.mes));
        store.dispatch(change('manutmdfitemform', 'milhas', formValues.milhas));
        store.dispatch(change('manutmdfitemform', 'km', formValues.quilometros));
        store.dispatch(change('manutmdfitemform', 'manutencao', formValues.tipomanut));
        
    }

    renderField({ input, label, type, meta: { touched, error, warning, submitFailed } }) {
        return (
            <div>
                <input {...input} type={type} className='form-control' />
                { submitFailed && ((error && <span className='required'>{error}</span>) || (warning && <span>{warning}</span>))}
            </div> 
        );
    } 

    render() {
        const FldValue = this.props.item.marca || '';
        const anoFldValue = this.props.item.ano || '';

        const { handleSubmit, pristine, reset, submitting } = this.props;

        return (
            <form onSubmit={handleSubmit(this.onSubmitModifyForm)}>
                <div className='row'>
                    <div className='col-4'>
                        <div className='form-group'>
                            <label htmlFor='itemabrev'>Item Abreviação</label>
                            <Field
                                component={'input'}
                                className='form-control' 
                                name='itemabrev'
                                disabled={true}
                                value={FldValue}
                            />
                        </div>
                    </div>
                    <div className='col-8'>
                        <div className='form-group'>
                            <label htmlFor='itemmanut'>Item de Manutenção</label>
                            <Field
                                component={'textarea'}
                                className='form-control' 
                                name='itemmanut'
                                disabled={true}
                                value={FldValue}
                                rows={4}
                            />
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-12 col-sm-12 col-xl-4'>
                        <div className='form-group'>
                            <label htmlFor='mes'>Mês</label>
                            <Field
                                component={this.renderField}
                                className='form-control' 
                                name='mes'
                                value={FldValue}
                            />
                        </div>
                    </div>
                    <div className='col-12 col-sm-12 col-xl-4'>
                        <div className='form-group'>
                            <label htmlFor='milhas'>Mi x 1000</label>
                            <Field
                                component={this.renderField} 
                                className='form-control' 
                                name='milhas'
                            />
                        </div>
                    </div>
                    <div className='col-12 col-sm-12 col-xl-4'>
                        <div className='form-group'>
                            <label htmlFor='km'>Km x 1000</label>
                            <Field
                                component={this.renderField} 
                                className='form-control' 
                                name='km'
                                value={anoFldValue}
                            />
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-12'>
                        <div className='form-group'>
                            <label>Manutenção</label>
                            <Field 
                                component={RadioGroup} 
                                name="manutencao" 
                                required={true}
                                options={[
                                    { title: 'Vistoria', value: 'vistoria' },
                                    { title: 'Substituição', value: 'substituicao' },
                                    { title: 'Nenhum', value: 'nenhum' },
                                ]} 
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
                            Restaurar
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-secondary"
                            ref={ref => (this.closeBtn = ref)}
                            onClick={() => reset()} 
                            data-dismiss="modal">
                            Fechar
                        </button>
                    </div>
                </div>
                <hr />
            </form>
        );
    }
}

const mapStateToProps = (state) => ({
    item: state.ComplementosReducer.item,
    itemManutencaoCombo: state.ManutencaoReducer.itemManutencaoCombo,
    dataTableManutencao: state.ManutencaoReducer.dataTableManutencao,
    formValues: state.ManutencaoReducer.formValuesItemManut,
    initialValues: {
        id: '',
        itemmanut: '',
        mes: '',
        milhas: '',
        km: '',
        manutencao: 'vistoria'
    }
});

ManutMdfItemForm = reduxForm({
    form: 'manutmdfitemform',
    destroyOnUnmount: false
})(ManutMdfItemForm); 

export default connect(mapStateToProps, {
    doPutManutencao
})(ManutMdfItemForm);


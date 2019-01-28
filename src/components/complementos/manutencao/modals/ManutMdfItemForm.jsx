import React from 'react'
import { connect } from 'react-redux';
import { Field, reduxForm, getFormValues } from 'redux-form';
import RadioGroup from '../../../utils/RadioGroup';

import { store } from '../../../../index';

class ManutMdfItemForm extends React.Component {
    
    constructor(props) {
        super(props);

        this.renderField = this.renderField.bind(this);
        this.onSubmitModifyForm = this.onSubmitModifyForm.bind(this);
    }

    onSubmitModifyForm(values) {
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

        //this.props.doPutModifyItemComp(newValues, () => this.closeBtn);
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
                    <div className='col-12'>
                        <div className='form-group'>
                            <label htmlFor='itemmanut'>Itens de Manutenção</label>
                            <Field 
                                component="select" 
                                className="form-control" 
                                name="itemmanut"
                                //onChange={event => this.consultarFipe(event, 'fipeperiodoref')}
                            >
                                {
                                        this.props.itemManutencaoCombo.map((value, index) => 
                                        <option key={index} value={value.item}>{value.item}</option>
                                    )
                                }
                            </Field>
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
                                disabled
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
                                disabled
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
                                disabled
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
                            {this.props.formType === '2' ? 'Restaurar' : 'Limpar'}
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
    initialValues: {
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
})(ManutMdfItemForm);


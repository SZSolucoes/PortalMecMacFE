import React from 'react'
import { connect } from 'react-redux';
import { Field, reduxForm, change } from 'redux-form';
import _ from 'lodash';

import { store } from '../../../../index';
import {
    required
} from '../../../utils/validForms';

//import { doPutCompAros } from '../CBArosActions';
//import { doGetDataTableCBArosSub } from '../CBArosActions';
//import { doPutManutencao } from '../../manutencao/ManutencaoActions';

class CBArosMdfForm extends React.Component {   
    constructor(props) {
        super(props);

        this.renderField = this.renderField.bind(this);
        this.onSubmitModifyForm = this.onSubmitModifyForm.bind(this);
        this.resetFields = this.resetFields.bind(this);
    }

    onSubmitModifyForm(values) {
        const {
            id,
            arocombo,
            arosubcombo
        } = values;

        if (!(arocombo && arosubcombo)) {
            alert('Para realizar a inclusão é necessário informar todos os campos.');
            return;
        }

        const params = {
            id,
            aro: arocombo,
            subcat: arosubcombo
        };

        //this.props.doPutCompAros(params, () => this.closeBtn);
    }

    resetFields(reset) {
        const {
            formValues
        } = this.props;

        reset();

        store.dispatch(change('cbarosmdfform', 'id', formValues.id));
        store.dispatch(change('cbarosmdfform', 'vehicletype', formValues.aro));
        store.dispatch(change('cbarosmdfform', 'aro', formValues.subcat));
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
        const { handleSubmit, pristine, reset, submitting } = this.props;

        return (
            <form onSubmit={handleSubmit(this.onSubmitModifyForm)}>
                <div className="row">
                    <div className="col-12 col-md-3">
                        <div className="form-group">
                            <label htmlFor="id">ID</label>
                            <Field 
                                component="input"
                                type="text"
                                className="form-control" 
                                name="id"
                                disabled
                            />
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="form-group">
                            <label htmlFor="vehicletype">Tipo de Veículo *</label>
                            <Field 
                                component="select" 
                                className="form-control" 
                                name="vehicletype"
                            >
                                <option key={'1'} value={'1'}>Carro</option>
                                <option key={'2'} value={'3'}>Caminhão</option>
                                <option key={'3'} value={'2'}>Moto</option>
                            </Field>
                        </div>
                    </div> 
                    <div className="col-12 col-md-5">
                        <div className="form-group">
                            <label htmlFor="aro">Aro *</label>
                            <Field 
                                component={this.renderField}
                                type="text"
                                className="form-control" 
                                name="aro"
                                validate={[ required ]}
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
    initialValues: {
        id: '',
        vehicletype: '1',
        aro: ''
    }
});

CBArosMdfForm = reduxForm({
    form: 'cbarosmdfform',
    destroyOnUnmount: false
})(CBArosMdfForm); 

export default connect(mapStateToProps, {
    //doPutCompAros
})(CBArosMdfForm);


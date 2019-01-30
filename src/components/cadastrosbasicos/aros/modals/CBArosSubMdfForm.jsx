import React from 'react'
import { connect } from 'react-redux';
import { Field, reduxForm, change } from 'redux-form';

import { store } from '../../../../index';
import {
    required
} from '../../../utils/validForms';

import { doPutItemSub } from '../CBArosActions';

class CBArosSubMdfForm extends React.Component {   
    constructor(props) {
        super(props);

        this.renderField = this.renderField.bind(this);
        this.onSubmitModifyForm = this.onSubmitModifyForm.bind(this);
        this.resetFields = this.resetFields.bind(this);
    }

    onSubmitModifyForm(values) {
        const {
            id,
            idaro,
            subcat
        } = values;

        if (!(id && idaro && subcat.trim())) {
            alert('Para realizar a inclusão é necessário informar todos os campos.');
            return;
        }

        const params = {
            id,
            subcat,
            idaro 
        };

        this.props.doPutItemSub(params, () => this.closeBtn);
    }

    resetFields(reset) {
        const {
            formValuesArosSub
        } = this.props;

        reset();

        store.dispatch(change('cbarossubmdfform', 'id', formValuesArosSub.id));
        store.dispatch(change('cbarossubmdfform', 'idaro', formValuesArosSub.idaro));
        store.dispatch(change('cbarossubmdfform', 'subcat', formValuesArosSub.subcat));
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
        const { handleSubmit, pristine, reset, submitting, arosSubValues } = this.props
        const idaro = arosSubValues.id || '';
        const aro = arosSubValues.aro || '';
        let vehicletype = arosSubValues.vehicletype || '';

        if (vehicletype === '1') {
            vehicletype = 'Carro';
        } else if (vehicletype === '2') {
            vehicletype = 'Moto';
        } else if (vehicletype === '3') {
            vehicletype = 'Caminhão';
        }

        return (
            <form onSubmit={handleSubmit(this.onSubmitModifyForm)}>
                <div className="row">
                    <div className="col-12 col-md-2">
                        <div className="form-group">
                            <label htmlFor="id">ID Aro</label>
                            <input 
                                type="text"
                                className="form-control" 
                                name="idaro"
                                disabled
                                value={idaro}
                            />
                        </div>
                    </div>
                    <div className="col-12 col-md-3">
                        <div className="form-group">
                            <label 
                                htmlFor="vehicletype"
                                style={{
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                Tipo de Veículo
                            </label>
                            <input 
                                type="text"
                                className="form-control" 
                                name="vehicletype"
                                disabled
                                value={vehicletype}
                            />
                        </div>
                    </div> 
                    <div className="col-12 col-md-3">
                        <div className="form-group">
                            <label htmlFor="aro">Aro</label>
                            <input 
                                type="text"
                                className="form-control" 
                                name="ano"
                                disabled
                                value={aro}
                            />
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="form-group">
                            <label htmlFor="subcat">Sub-categoria *</label>
                            <Field 
                                component={this.renderField}
                                type="text"
                                className="form-control" 
                                name="subcat"
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
    formValuesArosSub: state.CBArosReducer.formValuesArosSub,
    arosSubValues: state.CBArosReducer.arosSubValues,
    initialValues: {
        id: '',
        subcat: ''
    }
});

CBArosSubMdfForm = reduxForm({
    form: 'cbarossubmdfform',
    destroyOnUnmount: false
})(CBArosSubMdfForm); 

export default connect(mapStateToProps, {
    doPutItemSub
})(CBArosSubMdfForm);


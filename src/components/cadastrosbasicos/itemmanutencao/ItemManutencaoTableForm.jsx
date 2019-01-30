import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, change } from 'redux-form';

import {
    required
} from '../../utils/validForms';
import { doPostItem } from './ItemManutencaoActions';
import { store } from '../../../index';

class ItemManutencaoTableForm extends React.Component {

    constructor(props) {
        super(props);

        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.renderField = this.renderField.bind(this);
    }

    onSubmitForm(values) {
        this.props.doPostItem(
            { 
                item: values.item, 
                itemabrev: values.itemabrev 
            }, 
            this.buttonFecharRef
        );
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
            <form onSubmit={handleSubmit(this.onSubmitForm)}>
                <div className="form">
                    <div className="itemmanutencaodivtablebasic">
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
                                    <label htmlFor="itemabrev">Nome Abreviado *</label>
                                    <Field 
                                        component={this.renderField}
                                        type="text"
                                        className="form-control" 
                                        name="itemabrev"
                                        validate={[ required ]}
                                    />
                                </div>
                            </div> 
                            <div className="col-12 col-md-5">
                                <div className="form-group">
                                    <label htmlFor="item">Item *</label>
                                    <Field 
                                        component={this.renderField}
                                        type="text"
                                        className="form-control" 
                                        name="item"
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
                                    className="btn btn-secondary"
                                    type="button"
                                    disabled={pristine || submitting}
                                    onClick={() => {
                                        store.dispatch(
                                            change(
                                                'itemmanutencaotableform', 
                                                'item', 
                                                ''
                                            )
                                        );
                                    }}
                                >
                                    Limpar
                                </button>
                                <button
                                    ref={ref => (this.buttonFecharRef = ref)} 
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
    initialValues: {
        id: '',
        item: '',
        itemabrev: ''
    }
});

ItemManutencaoTableForm = reduxForm({
    form: 'itemmanutencaotableform',
    destroyOnUnmount: false
})(ItemManutencaoTableForm); 

export default connect(mapStateToProps, {
    doPostItem
})(ItemManutencaoTableForm);


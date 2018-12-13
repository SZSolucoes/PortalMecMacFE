import React from 'react'
import { connect } from 'react-redux';
import { Field, reduxForm, getFormValues, change } from 'redux-form';
import _ from 'lodash';
import Main from '../../templates/Main';
import ArosTable from './ArosTable';

import { store } from '../../../index';

import { doPostCompAros } from './ArosActions';
import { doGetDataTableCBArosSub } from '../../cadastrosbasicos/aros/CBArosActions';
import './Aros.css';

class Aros extends React.Component {
    
    constructor(props) {
        super(props);

        this.onClickAdicionar = this.onClickAdicionar.bind(this);
        this.renderField = this.renderField.bind(this);
        this.getSubCat = this.getSubCat.bind(this);

        this.state = {
            subcatDisabled: false
        }
    }

    onClickAdicionar() {
        const formValues = getFormValues('aros')(store.getState());
        const vehicle = { ...this.props.item };
        const valueValid = formValues.arocombo && formValues.arosubcombo;
        if (typeof vehicle === 'object' && Object.keys(vehicle).length && valueValid) {
            if (vehicle.vehicletype) {
                let keyTable = {};
                if (vehicle.vehicletype === '1') {
                    keyTable.idcar = vehicle.id
                } else if (vehicle.vehicletype === '2') {
                    keyTable.idbike = vehicle.id
                } else if (vehicle.vehicletype === '3') {
                    keyTable.idtruck = vehicle.id
                }

                this.props.doPostCompAros({
                    aro: formValues.arocombo,
                    subcat: formValues.arosubcombo,
                    ...keyTable
                });
            }
        }
    }

    async getSubCat(event) {
        this.setState({ subcatDisabled: true });
        if (event.target.value) {
            const newValue = _.findIndex(this.props.aroCombo, (item) => item.aro === event.target.value);
            if (newValue !== -1) {
                const dataTableArosSub = await doGetDataTableCBArosSub({ idaro: this.props.aroCombo[newValue].id });
                if (dataTableArosSub && dataTableArosSub.success) {
                    store.dispatch({
                        type: 'modify_arosubcombo_aros',
                        payload: dataTableArosSub.data
                    });
    
                    if (dataTableArosSub.data[0] && dataTableArosSub.data[0].subcat) {
                        store.dispatch(change('aros', 'arosubcombo', dataTableArosSub.data[0].subcat));
                    }
                }
            }
        }
        this.setState({ subcatDisabled: false });
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
        return (
            <div id='arosmain'>
                <div id={'arosmaincad'}>
                    <Main>
                        <div className='row'>
                            <div className='col-12 col-md-4'>
                                <div className='form-group'>
                                    <label htmlFor='arocombo'>Aro</label>
                                    <Field 
                                        component="select" 
                                        className="form-control" 
                                        name="arocombo"
                                        onChange={event => this.getSubCat(event)}
                                    >
                                        {
                                             this.props.aroCombo.map((value, index) => 
                                                <option key={index} value={value.aro}>{value.aro}</option>
                                            )
                                        }
                                    </Field>
                                </div>
                            </div>
                            <div className='col-12 col-md-8'>
                                <div className='form-group'>
                                    <label htmlFor='arosubcombo'>Sub-categoria</label>
                                    <Field 
                                        component="select" 
                                        className="form-control" 
                                        name="arosubcombo"
                                        disabled={this.state.subcatDisabled}
                                        //onChange={event => this.consultarFipe(event, 'fipeperiodoref')}
                                    >
                                        {
                                             this.props.aroSubCombo.map((value, index) => 
                                                <option key={index} value={value.subcat}>{value.subcat}</option>
                                            )
                                        }
                                    </Field>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12 d-flex justify-content-start'>
                                <button 
                                    className='btn btn-primary'
                                    type='button'
                                    onClick={() => this.onClickAdicionar()}
                                >
                                    Adicionar
                                </button>
                            </div>
                        </div>
                        <hr />
                    </Main>
                </div>
                <div id={'arosmaintable'}>
                    <Main>
                        <ArosTable itemsAro={this.props.dataTableAros} />
                    </Main>   
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    item: state.ComplementosReducer.item,
    aroCombo: state.ArosReducer.aroCombo,
    aroSubCombo: state.ArosReducer.aroSubCombo,
    dataTableAros: state.ArosReducer.dataTableAros,
    initialValues: {
        arocombo: '',
        arosubcombo: ''
    }
});

Aros = reduxForm({
    form: 'aros',
    destroyOnUnmount: false
})(Aros); 

export default connect(mapStateToProps, {
    doPostCompAros
})(Aros);


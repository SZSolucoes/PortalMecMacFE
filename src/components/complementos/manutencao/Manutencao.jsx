import React from 'react'
import { connect } from 'react-redux';
import { Field, reduxForm, getFormValues } from 'redux-form';
import Main from '../../templates/Main';
import RadioGroup from '../../utils/RadioGroup';
import ManutencaoTable from './ManutencaoTable';
import ManutMdfItem from './modals/ManutMdfItem';

import { store } from '../../../index';

import { doPostManutencao } from './ManutencaoActions';
import './Manutencao.css';

class Manutencao extends React.Component {
    
    constructor(props) {
        super(props);

        this.onClickAdicionar = this.onClickAdicionar.bind(this);
        this.renderField = this.renderField.bind(this);
    }

    onClickAdicionar() {
        const formValues = getFormValues('manutencao')(store.getState());
        const vehicle = { ...this.props.item };
        if (typeof vehicle === 'object' && Object.keys(vehicle).length && formValues.iditemmanut) {
            if (vehicle.vehicletype) {
                let keyTable = {};
                if (vehicle.vehicletype === '1') {
                    keyTable.idcar = vehicle.id
                } else if (vehicle.vehicletype === '2') {
                    keyTable.idbike = vehicle.id
                } else if (vehicle.vehicletype === '3') {
                    keyTable.idtruck = vehicle.id
                }

                this.props.doPostManutencao({
                    iditemmanut: formValues.iditemmanut,
                    mes: formValues.mes,
                    milhas: formValues.milhas,
                    quilometros: formValues.km,
                    tipomanut: formValues.manutencao,
                    ...keyTable
                });
            }
        }
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

        return (
            <div id='manutmain'>
                <div id={'manutmaincad'}>
                    <Main>
                        <div className='row'>
                            <div className='col-12'>
                                <div className='form-group'>
                                    <label htmlFor='iditemmanut'>Itens de Manutenção</label>
                                    <Field 
                                        component="select" 
                                        className="form-control" 
                                        name="iditemmanut"
                                        //onChange={event => this.consultarFipe(event, 'fipeperiodoref')}
                                    >
                                        {
                                             this.props.itemManutencaoCombo.map((value, index) => {
                                                 if (value.itemabrev) {
                                                    return (
                                                        <option 
                                                            key={index} 
                                                            value={value.itemmanutid}
                                                        >
                                                            {value.itemabrev}
                                                        </option>
                                                    );
                                                 }

                                                 return null;
                                             }
                                                
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
                <div id={'manutmaintable'}>
                    <Main>
                        <ManutencaoTable itemsManut={this.props.dataTableManutencao} />
                    </Main>   
                </div>
                <ManutMdfItem />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    item: state.ComplementosReducer.item,
    itemManutencaoCombo: state.ManutencaoReducer.itemManutencaoCombo,
    dataTableManutencao: state.ManutencaoReducer.dataTableManutencao,
    initialValues: {
        iditemmanut: '',
        mes: '',
        milhas: '',
        km: '',
        manutencao: 'vistoria'
    }
});

Manutencao = reduxForm({
    form: 'manutencao',
    destroyOnUnmount: false
})(Manutencao); 

export default connect(mapStateToProps, {
    doPostManutencao
})(Manutencao);


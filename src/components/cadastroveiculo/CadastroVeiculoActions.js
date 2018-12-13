
import { reset, change } from 'redux-form';
import Axios from 'axios';
import { toastr } from 'react-redux-toastr';
import { BASEURL } from '../utils/urls';
import { dbToState } from '../utils/dates';

import { consultarMarcas, consultarModelos, consultarAnoModelo } from '../utils/fipeApi';
import { doFetchVehicle } from '../utils/UtilsActions';
import { store } from '../../index';

export const doOpenVeiculoModal = (formType, veiculoType, idVeiculo, formValues) => dispatch => {
    const veiculo = veiculoType || '1';
    const fipeTabRef = store.getState().CadastroVeiculoReducer.fipeTabRef;
    dispatch({
        type: 'modify_formtype_cadastroveiculo',
        payload: formType || '1'
    });
    dispatch({
        type: 'modify_formveiculotype_cadastroveiculo',
        payload: veiculo
    });
    dispatch({
        type: 'modify_idveiculo_cadastroveiculo',
        payload: idVeiculo || '-1'
    });

    if (fipeTabRef && fipeTabRef.length > 0) {
        const funExec = async () => {
            dispatch(change('cadastroveiculos', 'fipeperiodoref', fipeTabRef[0].Codigo));
            const marcas = await consultarMarcas(fipeTabRef[0].Codigo, veiculo);
            if (marcas.success) {
                dispatch({
                    type: 'modify_fipemarcas_cadastroveiculo',
                    payload: marcas.data
                })
                dispatch(change('cadastroveiculos', 'fipemarca', marcas.data[0].Value));
            } else { return }

            const modelos = await consultarModelos(fipeTabRef[0].Codigo, veiculo, marcas.data[0].Value);
            if (modelos.success) {
                dispatch({
                    type: 'modify_fipemodelos_cadastroveiculo',
                    payload: modelos.data
                })
                dispatch(change('cadastroveiculos', 'fipemodelo', modelos.data[0].Value));
            } else { return }

            const anos = await consultarAnoModelo(fipeTabRef[0].Codigo, veiculo, marcas.data[0].Value, modelos.data[0].Value);
            if (anos.success) {
                dispatch({
                    type: 'modify_fipeanos_cadastroveiculo',
                    payload: anos.data
                })
                dispatch(change('cadastroveiculos', 'fipeano', anos.data[0].Value));
            } else { return }
        }
        funExec();
    }
};

export const modifyFormValues = (fields) => dispatch => {
    dispatch(change('cadastroveiculos', 'marca', fields.marca));
    dispatch(change('cadastroveiculos', 'modelo', fields.modelo));
    dispatch(change('cadastroveiculos', 'ano', fields.ano));
    dispatch(change('cadastroveiculos', 'valor', fields.valor));
    dispatch(change('cadastroveiculos', 'combustivel', fields.combustivel));
    dispatch(change('cadastroveiculos', 'recurso', fields.recurso));
    dispatch(change('cadastroveiculos', 'auditsqa', fields.auditsqa));
    dispatch(change('cadastroveiculos', 'przentreg', fields.przentreg));
    dispatch(change('cadastroveiculos', 'observ', fields.observ));
    dispatch(change('cadastroveiculos', 'horasproj', fields.horasproj));
    dispatch(change('cadastroveiculos', 'horasapont', fields.horasapont));
    dispatch(change('cadastroveiculos', 'status', fields.status));
};

export const modifyCadIdVeiculo = (value) => ({
    type: 'modify_idveiculo_cadastroveiculo',
    payload: value
});

export const modifyFormType = (value) => ({
    type: 'modify_formtype_cadastroveiculo',
    payload: value
});

export const modifyVeiculoType = (value) => ({
    type: 'modify_veiculotype_cadastroveiculo',
    payload: value
});

export const doPostVeiculo = (params, funCleanModal) => dispatch => {
    Axios.post(`${BASEURL}veiculos`, params)
        .then(res => onPostVeiculoSuccess(dispatch, res, params, funCleanModal))
        .catch(() => toastr.error('Erro', 'Falha de comunicação com o servidor.'));
};

const onPostVeiculoSuccess = (dispatch, res, params, funCleanModal) => {
    if (res && res.data) {
        if (res.data.success === 'true') {
            toastr.success('Sucesso', 'Cadastro realizado com sucesso.');
            
            funCleanModal(params);
            
            refreshVehicle(params.vehicletype);
        } else {
            const lowerMsg = res.data.message.toLowerCase();
            if (lowerMsg.indexOf('duplicate') !== -1) {
                toastr.error('Erro', 'Veículo já cadastrado.');
            }
        }
    }
};

export const doRemoveVeiculo = (id, vehicletype) => dispatch => {
    Axios.delete(`${BASEURL}veiculos`, { params: { id, vehicletype } })
        .then(res => onDeleteVeiculoSuccess(dispatch, res, vehicletype))
        .catch(() => toastr.error('Erro', 'Falha de comunicação com o servidor.'));
};

const onDeleteVeiculoSuccess = (dispatch, res, vehicletype) => {
    if (res && res.data) {
        if (res.data.success === 'true') {
            toastr.success('Sucesso', res.data.message);
            refreshVehicle(vehicletype);
        } else {
            toastr.error('Erro', res.data.message); 
        }
    }
};

const onFetchSuccess = (dispatch, res) => {
    if (res.data && Array.isArray(res.data)) {
        res.data.map((prop) => {
            prop.dtentreg = dbToState(prop.dtentreg);
            prop.przentreg = dbToState(prop.przentreg);
            prop.dtaprov = dbToState(prop.dtaprov);
            return prop;
        });
        dispatch({
            type: 'modify_listprop_monitor',
            payload: res.data
        });
    }
};

const onFetchError = (e) => {

};

export const doPutVeiculo = (params, type='', funCleanModal) => dispatch => {
    Axios.put(`${BASEURL}propostas`, params)
        .then(res => onPutVeiculoSuccess(dispatch, res, type, funCleanModal, params))
        .catch(() => toastr.error('Erro', 'Falha de comunicação com o servidor.'));
};

const onPutVeiculoSuccess = (dispatch, res, type, funCleanModal, params) => {
    if (res && res.data) {
        if (res.data.success === 'true') {
            Axios.get(`${BASEURL}propostas`
            )
                .then(res => onFetchSuccess(dispatch, res, type))
                .catch((e) => onFetchError(e));
            if (type === 'finish') {
                toastr.success('Sucesso', 'Finalização realizada com sucesso.');
            } else {
                toastr.success('Sucesso', 'Alteração realizada com sucesso.');
            }

            funCleanModal(params);

            dispatch(reset('cadastroprop'));
            dispatch({ 
                type: 'modify_formproptype_cadastroprop',
                payload: ''
            });
        } else {
            if (type === 'finish') {
                toastr.success('Sucesso', 'Falha ao finaliza a proposta.');
            } else {
                toastr.error('Erro', 'Falha ao alterar a proposta.');
            }
           
        }
    }
};

const refreshVehicle = (vehicletype) => {
    const asyncFunExec = async () => {
        const veiculo = await doFetchVehicle({ vehicletype });
        if (veiculo && veiculo.success) {
            if (vehicletype === '1') {
                store.dispatch({
                    type: 'modify_listcarros_veiculos',
                    payload: veiculo.data
                });
            } else if (vehicletype === '2') {
                store.dispatch({
                    type: 'modify_listmotos_veiculos',
                    payload: veiculo.data
                });
            } else if (vehicletype === '3') {
                store.dispatch({
                    type: 'modify_listcaminhoes_veiculos',
                    payload: veiculo.data
                });
            }  
        }
    }
    asyncFunExec();
}


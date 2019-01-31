import Axios from 'axios';
import { toastr } from 'react-redux-toastr';
import { BASEURL } from '../../utils/urls';

export const modifyCleanManutencao = () => ({
    type: 'modify_clean_manutencao'
});

export const doGetManutencao = async (params) => {
    return Axios.get(`${BASEURL}manutencao`, {
        params
    })
    .then((res) => {
        if (res.data && res.data.length) {
            return { success: true, data: res.data }
        }

        return { success: true, data: [] }
    })
    .catch(() => ({ success: false, data: [] }));
}

export const doPostManutencao = (params) => dispatch => {
    Axios.post(`${BASEURL}manutencao`, params)
        .then(res => {
            if (res && res.data) {
                if (res.data.success === 'true') {
                    toastr.success('Sucesso', 'Adição realizada com sucesso.');
                } else {
                    const lowerMsg = res.data.message.toLowerCase();
                    if (lowerMsg.indexOf('duplicate') !== -1) {
                        toastr.error('Erro', 'Registro já cadastrado.');
                        return;
                    }

                    if (res.data.success === 'false') {
                        toastr.error('Erro', 'Falha ao incluir item de manutenção.');
                    }
                }
            }
        })
        .catch(() => toastr.error('Erro', 'Falha de comunicação com o servidor.'));
}

export const doPostManutencaoLote = (params, cleanLoteState) => dispatch => {
    Axios.post(`${BASEURL}manutencaolote`, params)
        .then(res => {
            if (res && res.data) {
                if (res.data.success === 'true') {
                    if (cleanLoteState) {
                        cleanLoteState();
                    }
                    toastr.success('Sucesso', 'Adição realizada com sucesso.');
                } else {
                    const lowerMsg = res.data.message.toLowerCase();
                    if (lowerMsg.indexOf('duplicate') !== -1) {
                        toastr.error('Erro', 'Registro já cadastrado.');
                        return;
                    }

                    if (res.data.success === 'false') {
                        toastr.error('Erro', 'Falha ao incluir item de manutenção.');
                    }
                }
            }
        })
        .catch(() => toastr.error('Erro', 'Falha de comunicação com o servidor.'));
}

export const doPutManutencao = (params, closeModalBtn) => dispatch => {
    Axios.put(`${BASEURL}manutencao`, params)
        .then(res => {
            if (res && res.data) {
                if (res.data.success === 'true') {
                    dispatch({
                        type: 'modify_isrefreshmanut_manutencao',
                        payload: true
                    })
                    closeModalBtn().click();
                    toastr.success('Sucesso', 'Modificação realizada com sucesso.');
                } else {
                    const lowerMsg = res.data.message.toLowerCase();
                    if (lowerMsg.indexOf('duplicate') !== -1) {
                        toastr.error('Erro', 'Registro já cadastrado.');
                        return;
                    }

                    toastr.error('Erro', 'Falha na modificação do item.');
                }
            }
        })
        .catch(() => toastr.error('Erro', 'Falha de comunicação com o servidor.'));
}

export const doPutVehicleComp = (params) => dispatch => {
    Axios.put(`${BASEURL}veiculoscomp`, params)
    .then(res => {
        if (res && res.data) {
            if (res.data.success === 'true') {
                toastr.success('Sucesso', 'Salvo com sucesso.');
            } else {
                toastr.error('Erro', 'Falha ao salvar link.');
            }
        }
    })
    .catch(() => {
        toastr.error('Erro', 'Falha de comunicação com o servidor.');
    });
}

export const doDeleteManutencao = (id) => dispatch => {
    Axios.delete(`${BASEURL}manutencao`, {
        params: {
            id
        }
    })
    .then((res) => {
        if (res && res.data) {
            if (res.data.success === 'true') {
                toastr.success('Sucesso', res.data.message);
            } else {
                toastr.error('Erro', res.data.message); 
            }
        }
    })
    .catch(() => toastr.error('Erro', 'Falha de comunicação com o servidor.'))
}


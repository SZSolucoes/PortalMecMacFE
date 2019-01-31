import Axios from 'axios';
import { toastr } from 'react-redux-toastr';

import { BASEURL } from '../../utils/urls';

export const doPostItem = (params, btnClick) => dispatch => {
    Axios.post(`${BASEURL}aros`, params)
    .then((res) => {
        if (res && res.data) {
            if (res.data.success === 'true') {
                btnClick.click();
                toastr.success('Sucesso', 'Inclusão realizada com sucesso.');
            } else {
                const lowerMsg = res.data.message.toLowerCase();
                if (lowerMsg.indexOf('duplicate') !== -1) {
                    toastr.error('Erro', 'Registro já existe.');
                    return;
                }
                if (res.data.success === 'false') {
                    toastr.error('Erro', 'Falha ao inserir registro.');
                }
            }
        }
    })
    .catch(() => toastr.error('Erro', 'Falha de comunicação com o servidor.'))
}

export const doPutItem = (params, btnClose) => dispatch => {
    Axios.put(`${BASEURL}aros`, params)
    .then((res) => {
        if (res && res.data) {
            if (res.data.success === 'true') {
                dispatch({
                    type: 'modify_refreshtablearos_cbaros',
                    payload: true
                })
                btnClose().click();
                toastr.success('Sucesso', 'Modificação realizada com sucesso.');
            } else {
                const lowerMsg = res.data.message.toLowerCase();
                if (lowerMsg.indexOf('duplicate') !== -1) {
                    toastr.error('Erro', 'Registro já existe.');
                    return;
                }
                if (res.data.success === 'false') {
                    toastr.error('Erro', 'Falha ao modificar registro.');
                }
            }
        }
    })
    .catch(() => toastr.error('Erro', 'Falha de comunicação com o servidor.'))
}

export const doPostArosCsvItens = (params) => dispatch => {
    Axios.post(`${BASEURL}arosbatch`, params)
    .then((res) => {
        if (res && res.data) {
            if (res.data.success === 'true') {
                toastr.success('Sucesso', 'Inclusão efetuada com sucesso.');
            } else {
                const lowerMsg = res.data.message.toLowerCase();
                if (lowerMsg.indexOf('duplicate') !== -1) {
                    toastr.error('Erro', 'Registro já existe.');
                    return;
                }

                if (res.data.success === 'false') {
                    toastr.error('Erro', 'Falha ao incluir registro.');
                }
            }
        }
    })
    .catch(() => toastr.error('Erro', 'Falha de comunicação com o servidor.'))
}

export const doPostItemSub = (params, btnClick) => dispatch => {
    Axios.post(`${BASEURL}arossub`, params)
    .then((res) => {
        if (res && res.data) {
            if (res.data.success === 'true') {
                btnClick.click();
                toastr.success('Sucesso', 'Inclusão realizada com sucesso.');
            } else {
                const lowerMsg = res.data.message.toLowerCase();
                if (lowerMsg.indexOf('duplicate') !== -1) {
                    toastr.error('Erro', 'Registro já existe.');
                    return;
                }
                if (res.data.success === 'false') {
                    toastr.error('Erro', 'Falha ao inserir registro.');
                }
            }
        }
    })
    .catch(() => toastr.error('Erro', 'Falha de comunicação com o servidor.'))
}

export const doPutItemSub = (params, btnClose) => dispatch => {
    Axios.put(`${BASEURL}arossub`, params)
    .then((res) => {
        if (res && res.data) {
            if (res.data.success === 'true') {
                dispatch({
                    type: 'modify_refreshtablearossub_cbaros',
                    payload: true
                })
                btnClose().click();
                toastr.success('Sucesso', 'Modificação realizada com sucesso.');
            } else {
                const lowerMsg = res.data.message.toLowerCase();
                if (lowerMsg.indexOf('duplicate') !== -1) {
                    toastr.error('Erro', 'Registro já existe.');
                    return;
                }
                if (res.data.success === 'false') {
                    toastr.error('Erro', 'Falha ao modificar registro.');
                }
            }
        }
    })
    .catch(() => toastr.error('Erro', 'Falha de comunicação com o servidor.'))
}

export const doPostArosSubCsvItens = (params) => dispatch => {
    Axios.post(`${BASEURL}arossubbatch`, params)
    .then((res) => {
        if (res && res.data) {
            if (res.data.success === 'true') {
                toastr.success('Sucesso', 'Inclusão realizada com sucesso.');
            } else {
                const lowerMsg = res.data.message.toLowerCase();
                if (lowerMsg.indexOf('duplicate') !== -1) {
                    toastr.error('Erro', 'Registro já existe.');
                    return;
                }
                if (res.data.success === 'false') {
                    toastr.error('Erro', 'Falha ao inserir registro.');
                }
            }
        }
    })
    .catch(() => toastr.error('Erro', 'Falha de comunicação com o servidor.'))
}

export const doDeleteCBAros = (id) => dispatch => {
    Axios.delete(`${BASEURL}aros`, {
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

export const doDeleteCBArosSub = (params) => dispatch => {
    Axios.delete(`${BASEURL}arossub`, {
        params
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

export const doGetLastId = async () => {
    return Axios.get(`${BASEURL}arosid`)
            .then((res) => ({ success: true, data: res.data }))
            .catch(() => ({ success: false, data: [] }));
}

export const doGetDataTableCBAros = async () => {
    return Axios.get(`${BASEURL}aros`)
            .then((res) => ({ success: true, data: res.data }))
            .catch(() => ({ success: false, data: [] }));
}

export const doGetDataTableCBArosSub = async (params) => {
    return Axios.get(`${BASEURL}arossub`, { params })
            .then((res) => ({ success: true, data: res.data }))
            .catch(() => ({ success: false, data: [] }));
}

export const doFetchCBArosSubs = (params) => dispatch => {
    Axios.get(`${BASEURL}arossub`, { params })
    .then((res) => {
        if (res && res.data) {
            dispatch({
                type: 'modify_datatablecbarossub_cbaros',
                payload: res.data
            });
        }
        dispatch({
            type: 'modify_arossubloading_cbaros',
            payload: false
        });
    })
    .catch(() => { 
        dispatch({
            type: 'modify_arossubloading_cbaros',
            payload: false
        });
        toastr.error('Erro', 'Falha de comunicação com o servidor.');
    });
}



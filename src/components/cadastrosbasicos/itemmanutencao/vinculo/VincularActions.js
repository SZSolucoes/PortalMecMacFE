import Axios from 'axios';
import { toastr } from 'react-redux-toastr';
import { BASEURL } from "../../../utils/urls";

export const modifyVincularItem = (value) => ({
    type: 'modify_item_vincularitemmanut',
    payload: value
});

export const getVeicVincItens = async (id) => {
    return await Axios.get(`${BASEURL}itemmanutxvehiclevtwo`, { params: { id } })
        .then((res) => {
            if (res && res.data) {
                    return res.data;
            } else {
                return [];
            }
        })
        .catch(() => []);
}

export const doConfirmVincular = (params, btnCloseModal) => async dispatch => {
    dispatch({
        type: 'modify_overlaymodal_vincularitemmanut',
        payload: true
    });

    await Axios.post(`${BASEURL}itemmanutxvehicle`, params)
        .then((res) => {
            if (res && res.data) {
                if (res.data.success === 'true') {
                    dispatch({
                        type: 'modify_overlaymodal_vincularitemmanut',
                        payload: false
                    });
                    if (btnCloseModal) {
                        setTimeout(() => btnCloseModal.click(), 500);
                    }
                    setTimeout(() => toastr.success('Sucesso', res.data.message), 1000);
                    return true;
                } else {
                    dispatch({
                        type: 'modify_overlaymodal_vincularitemmanut',
                        payload: false
                    });
                    toastr.error('Erro', res.data.message);
                    return false;
                }
            }
        })
        .catch(() => false);
    dispatch({
        type: 'modify_overlaymodal_vincularitemmanut',
        payload: false
    });
}

export const doConfirmVincularSimp = async (params, btnAction) => {
    await Axios.post(`${BASEURL}itemmanutxvehicle`, params)
        .then((res) => {
            if (res && res.data) {
                if (res.data.success === 'true') {
                    if (btnAction) {
                        btnAction();
                    }
                    setTimeout(() => toastr.success('Sucesso', res.data.message), 1000);
                    return true;
                } else {
                    const lowerMsg = res.data.message.toLowerCase();
                    if (lowerMsg.indexOf('duplicate') !== -1 || lowerMsg.indexOf('constraint fails') !== -1) {
                        toastr.error('Erro', 'Item já vinculado.');
                        return;
                    }
    
                    if (res.data.success === 'false') {
                        console.log(res.data.message);
                        toastr.error('Erro', 'Falha ao vincular item.');
                    }
                    return false;
                }
            }
        })
        .catch(() => false);
}


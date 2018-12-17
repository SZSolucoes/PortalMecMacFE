import Axios from 'axios';
import { toastr } from 'react-redux-toastr';
import { BASEURL } from "../../../utils/urls";

export const modifyVincularItem = (value) => ({
    type: 'modify_item_vincularitemmanut',
    payload: value
});

export const doConfirmVincular = (params, btnCloseModal) => async dispatch => {
    dispatch({
        type: 'modify_overlaymodal_vincularitemmanut',
        payload: true
    });

    await Axios.post(`${BASEURL}itemmanutxvehicle`, params)
            .then((res) => {
                if (res && res.data) {
                    if (res.data.success === 'true') {
                        btnCloseModal.click();
                        setTimeout(() => toastr.success('Sucesso', res.data.message), 500);
                        return true;
                    } else {
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


import Axios from "axios";
import { BASEURL } from '../utils/urls';
import { doRemoveVeiculo } from '../cadastroveiculo/CadastroVeiculoActions';
import { 
    doDeleteItemManutencao, 
    doPostCsvItens, 
    doDeleteVincular, 
    doPostVincCsvItens 
} from '../cadastrosbasicos/itemmanutencao/ItemManutencaoActions';
import { 
    doDeleteCBAros, 
    doDeleteCBArosSub, 
    doPostArosCsvItens, 
    doPostArosSubCsvItens 
} from '../cadastrosbasicos/aros/CBArosActions';
import { doDeleteManutencao } from '../complementos/manutencao/ManutencaoActions';
import { doDeleteCompAros } from '../complementos/aros/ArosActions';
import { doConfirmCPManual } from '../veiculos/cpmanual/CPManualActions';
import { doConfirmVincular } from '../cadastrosbasicos/itemmanutencao/vinculo/VincularActions';

export const modifyModalTitle = (value) => ({
    type: 'modify_modaltitle_utils',
    payload: value
});

export const modifyModalMessage = (value) => ({
    type: 'modify_modalmessage_utils',
    payload: value
});

export const modifyBtnType = (value) => ({
    type: 'modify_btntype_utils',
    payload: value
});

export const modifyExtraData = (value) => ({
    type: 'modify_extradata_utils',
    payload: value
});

export const doFetchVehicle = async (params) => {
    return Axios.get(`${BASEURL}veiculos`, {
        params: {
            ...params
        }
    })
    .then((res) => ({ success: true, data: res.data }))
    .catch(() => ({ success: false, data: [] }));
}

export const doRemoveVehicle = async (params) => {
    return Axios.get(`${BASEURL}veiculos`, {
        params: {
            ...params
        }
    })
    .then((res) => ({ success: true, data: res.data }))
    .catch(() => ({ success: false, data: [] }));
}

export const doModalAction = (extraData) => dispatch => {
    if (extraData.action && extraData.action === 'remove') {
        doRemoveVeiculo(extraData.item.id, extraData.vehicletype)(dispatch);
    } else if (extraData.action && extraData.action === 'remove_itemmanutencaotable') {
        doDeleteItemManutencao(extraData.item.id)(dispatch);
    } else if (extraData.action && extraData.action === 'incluibatch_itemmanutencaotable') {
        doPostCsvItens(extraData)(dispatch);
    } else if (extraData.action && extraData.action === 'incluibatch_cbarostable') {
        doPostArosCsvItens(extraData)(dispatch);
    } else if (extraData.action && extraData.action === 'incluibatch_cbarossubtable') {
        doPostArosSubCsvItens(extraData)(dispatch);
    } else if (extraData.action && extraData.action === 'remove_manutencaotable') {
        doDeleteManutencao(extraData.item.id)(dispatch);
    } else if (extraData.action && extraData.action === 'remove_cbarostable') {
        doDeleteCBAros(extraData.item.id)(dispatch);
    } else if (extraData.action && extraData.action === 'remove_cbarossubtable') {
        doDeleteCBArosSub(extraData.item)(dispatch);
    } else if (extraData.action && extraData.action === 'remove_comparostable') {
        doDeleteCompAros(extraData.item.id)(dispatch);
    } else if (extraData.action && extraData.action === 'confirm_cpmanual') {
        doConfirmCPManual(extraData.params)(dispatch);
    } else if (extraData.action && extraData.action === 'confirm_vincularitemmanut') {
        doConfirmVincular(extraData.params, extraData.btnCloseModal)(dispatch);
    } else if (extraData.action && extraData.action === 'remove_vincularitemmanut') {
        doDeleteVincular(extraData.item)(dispatch);
    } else if (extraData.action && extraData.action === 'incluibatch_vincularitemmanut') {
        doPostVincCsvItens(extraData.item)(dispatch);
    }
}


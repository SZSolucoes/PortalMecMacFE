import { combineReducers } from 'redux'
import { reducer as ToastrReducer } from 'react-redux-toastr';
import { reducer as formReducer } from 'redux-form';

import VeiculosReducer from '../veiculos/VeiculosReducer';
import CadastroVeiculoReducer from '../cadastroveiculo/CadastroVeiculoReducer';
import ParametrosReducer from '../parametros/ParametrosReducer';
import UtilsReducer from '../utils/UtilsReducer';
import ComplementosReducer from '../complementos/ComplementosReducer';
import ManutencaoReducer from '../complementos/manutencao/ManutencaoReducer';
import ArosReducer from '../complementos/aros/ArosReducer';
import ItemManutencaoReducer from '../cadastrosbasicos/itemmanutencao/ItemManutencaoReducer';
import CBArosReducer from '../cadastrosbasicos/aros/CBArosReducer';
import CPManualReducer from '../veiculos/cpmanual/CPManualReducer';
import VincularReducer from '../cadastrosbasicos/itemmanutencao/vinculo/VincularReducer';

export default combineReducers({
    VeiculosReducer,
    CadastroVeiculoReducer,
    ParametrosReducer,
    ComplementosReducer,
    ItemManutencaoReducer,
    ArosReducer,
    CBArosReducer,
    CPManualReducer,
    VincularReducer,
    UtilsReducer,
    ManutencaoReducer,
    toastr: ToastrReducer,
    form: formReducer
});


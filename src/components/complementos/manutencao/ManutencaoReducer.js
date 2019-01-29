
const INITIAL_STATE = {
    itemManutencaoCombo: [],
    dataTableManutencao: [],
    formValuesItemManut: {},
    isRefreshManut: false,
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'modify_itemmanutencaocombo_manutencao':
            return {
                ...state,
                itemManutencaoCombo: [...action.payload]
            };
        case 'modify_datatablemanutencao_manutencao':
            return {
                ...state,
                dataTableManutencao: [...action.payload]
            };
        case 'modify_formvaluesitemmanut_manutencao':
            return {
                ...state,
                formValuesItemManut: { ...action.payload }
            };
        case 'modify_isrefreshmanut_manutencao':
            return {
                ...state,
                isRefreshManut: action.payload
            };
        case 'modify_clean_manutencao':
            return {
                ...state,
                itemManutencaoCombo: [],
                dataTableManutencao: [],
                formValuesItemManut: {},
                isRefreshManut: false
            };
        default:
            return state;
    }
}



const INITIAL_STATE = {
    itemManutencaoCombo: [],
    dataTableManutencao: []
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
        case 'modify_clean_manutencao':
            return {
                ...state,
                itemManutencaoCombo: [],
                dataTableManutencao: []
            };
        default:
            return state;
    }
}


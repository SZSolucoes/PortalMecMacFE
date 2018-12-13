const INITIAL_STATE = {
    dataTableItemManutencao: []
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'modify_datatableitemmanutencao_itemmanutencao':
            return {
                ...state,
                dataTableItemManutencao: [...action.payload]
        };
        case 'modify_clean_itemmanutencao':
            return {
                ...state,
                dataTableItemManutencao: []
            };
        default:
            return state;
    }
}



const INITIAL_STATE = {
    aroCombo: [],
    aroSubCombo: [],
    dataTableAros: []
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'modify_arocombo_aros':
            return {
                ...state,
                aroCombo: [...action.payload]
            };
        case 'modify_arosubcombo_aros':
            return {
                ...state,
                aroSubCombo: [...action.payload]
            };
        case 'modify_datatablearos_aros':
            return {
                ...state,
                dataTableAros: [...action.payload]
            };
        case 'modify_clean_manutencao':
            return {
                ...state,
                aroCombo: [],
                aroSubCombo: [],
                dataTableAros: []
            };
        default:
            return state;
    }
}


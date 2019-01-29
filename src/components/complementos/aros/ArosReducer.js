
const INITIAL_STATE = {
    aroCombo: [],
    aroSubCombo: [],
    aroSubComboMdf: [],
    dataTableAros: [],
    formValues: {},
    refreshTable: false
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
        case 'modify_arosubcombomdf_aros':
            return {
                ...state,
                aroSubComboMdf: [...action.payload]
            };
        case 'modify_datatablearos_aros':
            return {
                ...state,
                dataTableAros: [...action.payload]
            };
        case 'modify_formvalues_aros':
            return {
                ...state,
                formValues: { ...action.payload }
            };
        case 'modify_refreshtable_aros':
            return {
                ...state,
                refreshTable: action.payload
            };
        case 'modify_clean_aros':
            return {
                ...state,
                aroCombo: [],
                aroSubCombo: [],
                aroSubComboMdf: [],
                dataTableAros: [],
                formValues: {},
                refreshTable: false
            };
        default:
            return state;
    }
}


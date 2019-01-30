const INITIAL_STATE = {
    dataTableCBAros: [],
    dataTableCBArosSub: [],
    arosSubLoading: false,
    arosSubValues: {},
    formValuesAros: {},
    formValuesArosSub: {},
    refreshTableAros: false,
    refreshTableArosSub: false
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'modify_datatablecbaros_cbaros':
            return {
                ...state,
                dataTableCBAros: [...action.payload]
        };
        case 'modify_datatablecbarossub_cbaros':
            return {
                ...state,
                dataTableCBArosSub: [...action.payload]
        };
        case 'modify_arossubloading_cbaros':
            return {
                ...state,
                arosSubLoading: action.payload
        };
        case 'modify_arossubvalues_cbaros':
            return {
                ...state,
                arosSubValues: { ...action.payload }
        };
        case 'modify_formvaluesaros_cbaros':
            return {
                ...state,
                formValuesAros: { ...action.payload }
        };
        case 'modify_formvaluesarossub_cbaros':
            return {
                ...state,
                formValuesArosSub: { ...action.payload }
        };
        case 'modify_refreshtablearos_cbaros':
            return {
                ...state,
                refreshTableAros: action.payload
        };
        case 'modify_refreshtablearossub_cbaros':
            return {
                ...state,
                refreshTableArosSub: action.payload
        };
        case 'modify_clean_cbaros':
            return {
                ...state,
                dataTableCBAros: [],
                dataTableCBArosSub: [],
                arosSubLoading: false,
                arosSubValues: {},
                formValuesAros: {},
                formValuesArosSub: {},
                refreshTableAros: false,
                refreshTableArosSub: false
            };
        default:
            return state;
    }
}


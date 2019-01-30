const INITIAL_STATE = {
    dataTableItemManutencao: [],
    dataTableVehicles: [],
    vehiclesLoading: false,
    formValues: {},
    refreshTable: false
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'modify_datatableitemmanutencao_itemmanutencao':
            return {
                ...state,
                dataTableItemManutencao: [...action.payload]
        };
        case 'modify_datatablevehicles_itemmanutencao':
            return {
                ...state,
                dataTableVehicles: [...action.payload]
        };
        case 'modify_veiculosloading_itemmanutencao':
            return {
                ...state,
                vehiclesLoading: action.payload
        };
        case 'modify_formvalues_itemmanutencao':
            return {
                ...state,
                formValues: { ...action.payload }
        };
        case 'modify_refreshtable_itemmanutencao':
            return {
                ...state,
                refreshTable: { ...action.payload }
        };
        case 'modify_clean_itemmanutencao':
            return {
                ...state,
                dataTableItemManutencao: [],
                dataTableVehicles: [],
                vehiclesLoading: false,
                formValues: {},
                refreshTable: false
            };
        default:
            return state;
    }
}


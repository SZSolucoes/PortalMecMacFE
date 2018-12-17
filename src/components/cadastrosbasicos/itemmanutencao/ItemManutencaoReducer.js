const INITIAL_STATE = {
    dataTableItemManutencao: [],
    dataTableVehicles: [],
    vehiclesLoading: false
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
        case 'modify_clean_itemmanutencao':
            return {
                ...state,
                dataTableItemManutencao: [],
                dataTableVehicles: [],
                vehiclesLoading: false
            };
        default:
            return state;
    }
}


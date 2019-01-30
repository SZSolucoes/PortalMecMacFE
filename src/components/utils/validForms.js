
export const required = (value) => {
    if (value) {
        if (!(typeof value === 'string' && value.trim())) {
            return 'Campo obrigatório';
        }

        return undefined;
    } else {
        return 'Campo obrigatório';
    }
};
export const number = (value, prevvalue) => value && isNaN(Number(value)) ? prevvalue : value; 
export const dataLength = (value) => {
    if (value && value.length !== 10) {
        return 'Data inválida';
    }
    
    return undefined;
};
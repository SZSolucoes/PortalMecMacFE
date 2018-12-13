
export const required = (value) => value ? undefined : 'Campo obrigatório';
export const number = (value, prevvalue) => value && isNaN(Number(value)) ? prevvalue : value; 
export const dataLength = (value) => {
    if (value && value.length !== 10) {
        return 'Data inválida';
    }
    
    return undefined;
};
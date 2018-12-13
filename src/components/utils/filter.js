
export const checkFilterCarros = (item, newFilter) => {
    const bFipeMes = newFilter.fipeperiodoref ? 
    item.fipeperiodoref.toLowerCase().includes(newFilter.fipeperiodoref.toLowerCase()) : true;

    const bMarca = newFilter.marca ? 
    item.marca.toLowerCase().includes(newFilter.marca.toLowerCase()) : true;

    const bModelo = newFilter.modelo ? 
    item.modelo.toLowerCase().includes(newFilter.modelo.toLowerCase()) : true;

    const bAno = newFilter.ano ? 
    item.ano.toLowerCase().includes(newFilter.ano.toLowerCase()) : true;

    const bValor = newFilter.valor ? 
    item.valor.toLocaleString(undefined , { minimumFractionDigits: 2 })
    .replace('.', '').replace(',', '').startsWith(
        newFilter.valor
    ) : true;

    const bCombustivel = newFilter.combustivel ? 
    item.combustivel.toLowerCase().includes(newFilter.combustivel.toLowerCase()) : true;

    return bFipeMes && bMarca && bModelo && bAno && bValor && bCombustivel;
};


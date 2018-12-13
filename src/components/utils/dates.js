
export const dbToState = (value) => {
    if (value) {
        const year = value.substr(0, 4);
        const month = value.substr(4, 2);
        const day = value.substr(6, 2);
        let newValue = `${year}-${month}-${day}`;

        return newValue;
    }

    return value;
};

export const stateToDb = (value) => {
    let newValue = value.replace(/-/g, '');
    return newValue;
};

export const diffDates = (dateStrOne, dateStrTwo) => {
    const oneDay = 24*60*60*1000;
    const firstDate = new Date(dateStrOne.replace(/-/g, '/'));
    const secondDate = new Date(dateStrTwo.replace(/-/g, '/'));

    return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay))); 
};


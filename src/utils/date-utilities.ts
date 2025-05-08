export function getStartOfMonth(year: number, month: number) {
    return new Date(year, month, 1);
}

export const getAllYearMonths = (year: number) => {
    let months: Date[] = [];
    for (let i = 0; i < 12; i++) {
        months.push(getStartOfMonth(year, i));
    }
    return months;
}

export const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

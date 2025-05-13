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

export function combineDateAndTime(dateStr: string, timeStr: string): Date {
    return new Date(`${dateStr}T${timeStr}:00`);
}

export function excelDateToJSDate(serial: number): Date {
    const excelEpoch = new Date(1899, 11, 30);
    const milliseconds = serial * 24 * 60 * 60 * 1000;
    return new Date(excelEpoch.getTime() + milliseconds);
}

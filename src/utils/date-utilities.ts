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
 const epoch = new Date(Date.UTC(1899, 11, 30)); // Excel's base date is 1899-12-30
    const msPerDay = 86400000; // Number of milliseconds in one day
    const date = new Date(epoch.getTime() + serial * msPerDay);
    return date;
}

export const dateFormatter = (value:string) => {
    const date = new Date(value);
    const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    return formattedDate
}
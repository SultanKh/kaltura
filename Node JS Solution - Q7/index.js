const fs = require('fs');
const { parse } = require('csv-parse');
const moment = require('moment');

class OfficeReservationAnalyzer {
    constructor(csvFilePath) {
        this.csvFilePath = csvFilePath;
        this.reservations = [];
    }

    async loadData() {
        return new Promise((resolve, reject) => {
            let isFirstRow = true;
            fs.createReadStream(this.csvFilePath)
                .pipe(parse({
                    columns: ['capacity', 'monthlyPrice', 'startDay', 'endDay'],
                    cast: (value, context) => {
                        if (context.column === 'capacity') return parseInt(value);
                        if (context.column === 'monthlyPrice') return parseFloat(value);
                        return value;
                    }
                }))
                .on('data', (data) => {
                    if (isFirstRow) {
                        isFirstRow = false; 
                        return;
                    }
                    this.reservations.push(data);
                })
                .on('end', () => resolve())
                .on('error', (error) => reject(error));
        });
    }

    analyzeMonth(yearMonth) {
        const targetDate = moment(yearMonth, 'YYYY-MM');
        const daysInMonth = targetDate.daysInMonth();
        let revenue = 0;
        let totalCapacity = 0;
        let reservedOffices = new Set();

        this.reservations.forEach(reservation => {
            const startDate = moment(reservation.startDay);
            const endDate = reservation.endDay ? moment(reservation.endDay) : moment('9999-12-31');

            // Check if reservation overlaps with target month
            if (this.isOverlapping(targetDate, startDate, endDate)) {
                // Calculate prorated revenue
                const daysReserved = this.calculateDaysReserved(
                    targetDate,
                    startDate,
                    endDate,
                    daysInMonth
                );

                revenue += (reservation.monthlyPrice * daysReserved) / daysInMonth;
                reservedOffices.add(reservation.capacity);
            } else {
                totalCapacity += reservation.capacity;
            }
        });

        return {
            revenue: Math.round(revenue),
            unreservedCapacity: totalCapacity
        };
    }

    isOverlapping(targetDate, startDate, endDate) {
        const monthStart = moment(targetDate).startOf('month');
        const monthEnd = moment(targetDate).endOf('month');
        return startDate <= monthEnd && endDate >= monthStart;
    }

    calculateDaysReserved(targetDate, startDate, endDate, daysInMonth) {
        const monthStart = moment(targetDate).startOf('month');
        const monthEnd = moment(targetDate).endOf('month');

        const reservationStart = moment.max(startDate, monthStart);
        const reservationEnd = moment.min(endDate, monthEnd);

        return reservationEnd.diff(reservationStart, 'days') + 1;
    }

    formatResult(yearMonth, result) {
        return `${yearMonth}: expected revenue: $${result.revenue}, ` +
            `expected total capacity of the unreserved offices: ${result.unreservedCapacity}`;
    }
}


// Usage
async function analyzeReservations(dates) {
    try {
        const analyzer = new OfficeReservationAnalyzer('data-field.csv');
        await analyzer.loadData();

        dates.forEach(date => {
            const result = analyzer.analyzeMonth(date);
            console.log(analyzer.formatResult(date, result));
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Analyze specific months
const datesToAnalyze = [
    '2013-01',
    '2013-06',
    '2014-03',
    '2014-09',
    '2015-07'
];

analyzeReservations(datesToAnalyze);





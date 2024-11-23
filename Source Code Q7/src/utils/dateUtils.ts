

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateRevenueAndUnreservedCapacity = (rows: any[], yearMonth: string) => {
  const [year, month] = yearMonth.split('-').map(Number);
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0);

  let totalRevenue = 0;
  let totalUnreservedCapacity = 0;

  rows.forEach(row => {
      const capacity = parseInt(row[0], 10)
      const monthlyPrice = parseFloat(row[1]);
      const startDay = new Date(row[2]);
      const endDay = row[3] ? new Date(row[3]) : null;

      if (
        startDay &&
        ((startDay <= monthEnd && (!endDay || endDay >= monthStart))) // Reservation overlaps the month
    ) {
        const reservationStart = startDay > monthStart ? startDay : monthStart; // Later of startDay or monthStart
        const reservationEnd = endDay && endDay < monthEnd ? endDay : monthEnd; // Earlier of endDay or monthEnd

        // Calculate the number of overlapping days
        const daysInReservation =
            (reservationEnd.getTime() - reservationStart.getTime()) / (1000 * 60 * 60 * 24) + 1; // Convert milliseconds to days

        const daysInMonth = (monthEnd.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24) + 1;
        const proratedRevenue = (daysInReservation / daysInMonth) * monthlyPrice;

        totalRevenue += proratedRevenue;
    } else {
        // If the office is not reserved for the month, add its capacity to unreserved total
        totalUnreservedCapacity += capacity;
    }
  });

  return `${yearMonth} expectd revenue: ${formatCurrency(totalRevenue)},\nexpected total capacity of the unreserved offices: ${totalUnreservedCapacity}`

};

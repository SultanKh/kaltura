export interface OfficeReservation {
    officeId: number;
    capacity: number;
    monthlyPrice: number;
    startDate: string;
    endDate: string;
  }
  
  export interface AnalyticsResult {
    month: string;
    revenue: number;
    unreservedCapacity: number;
  }
  
  export interface OfficeData {
    officeId: number;
    capacity: number;
    monthlyPrice: number;
  }
  
  export interface ReservationPeriod {
    startDate: Date;
    endDate: Date;
  }
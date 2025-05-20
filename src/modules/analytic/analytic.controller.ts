import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticService } from './analytic.service';

@Controller('analytics')
export class AnalyticController {
    constructor(private readonly service: AnalyticService) { }

    @Get("customer/revenue/year")
    findTotalYearRevenue(@Query() args: { customerId: string, year: number }) {        
        return this.service.getTotalYearRevenue(args.customerId, args.year);
    }

    @Get("customer/revenue/month")
    findCustomerInvoicesPerMonth(@Query() args: { month: number, year: number }) {
        return this.service.getCustomerInvoicesPerMonth(args.month, args.year);
    }

    @Get("customer/receipts")
    findAll(@Query() args: { customerId: string, year: number }) {
        return this.service.getKaserGoldRevenue(args.customerId, args.year);
    }

}

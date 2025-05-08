import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticService } from './analytic.service';

@Controller('analytics')
export class AnalyticController {
    constructor(private readonly service: AnalyticService) { }

    @Get("revenue")
    findTotalYearRevenue(@Query() args: { customerId: string, year: number }) {
        return this.service.getTotalYearRevenue(args.customerId, args.year);
    }

    @Get("month")
    findCustomerInvoicesPerMonht(@Query() args: { month: number, year: number }) {
        return this.service.getCustomerInvoicesPerMonth(args.month, args.year);
    }

    @Get("payments")
    findAll(@Query() args: { customerId: string, year: number }) {
        return this.service.getKaserGoldRevenue(args.customerId, args.year);
    }

}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CustomerService } from '../customer/customer.service';
import { InvoiceService } from '../invoice/invoice.service';
import { CustomerPaymentService } from '../receipts/payment.service';
import { OrderService } from '../order/order.service';
import { ItemType } from '../order/schema/order.schema';
import { getAllYearMonths, getStartOfMonth, monthShort, resolveAnalyticsDateRange } from '../../utils/date-utilities';
import { GetCustomerAnalyticsDto } from './dto/get-customer-analytics.dto';

@Injectable()
export class AnalyticService {
    constructor(
        private readonly customerService: CustomerService,
        private readonly invoiceService: InvoiceService,
        private readonly customerPaymentService: CustomerPaymentService,
        private readonly orderService: OrderService,
    ) { }

    async getTotalYearRevenue(customerId: string | null, year: number = new Date().getFullYear()) {        
        try {
            if (customerId) {
                await this.customerService.findOne(customerId);
            }

            const aggregatedData = await this.invoiceService.aggregateYearlyRevenue(customerId, year);            

            // Format to include all 12 months even if some are missing
            const revenues = monthShort.map((month, i) => {
                const found = aggregatedData.find(item => item._id === i + 1);
                return {
                    month,
                    totalCash: found?.totalCash || 0,
                    totalWeight: found?.totalWeight || 0,
                };
            });

            return revenues;
        } catch (error) {
            throw new InternalServerErrorException('Unable to get total year revenue', { cause: error });
        }
    }

    async getCustomerInvoicesPerMonth(month: number, year: number = new Date().getFullYear()) {
        try {
            const currentMonth = getStartOfMonth(year, month);
            const endOfMonth = new Date(year, month, 31, 23, 59, 59);
            const graph: { customer: string, totalCash: 0, totalWeight: 0 }[] = [];

            const revenues = await this.invoiceService.findGroupedByCustomerAndDate(currentMonth, endOfMonth);
            const customers = await this.customerService.findAll({});

            for (const customer of customers.data) {
                const result = revenues.find((v) => v.customer === customer.name);
                graph.push(result || { customer: customer.name, totalCash: 0, totalWeight: 0 });
            }

            return graph.sort((a, b) => a.customer.toLowerCase().localeCompare(b.customer.toLowerCase()));
        } catch (error) {
            throw new InternalServerErrorException('Unable to get monthly invoices', { cause: error });
        }
    }

    async getKaserGoldRevenue(customer: string, year: number = new Date().getFullYear()) {
        try {
            if (customer) {
                await this.customerService.findOne(customer);
            }

            const aggregated = await this.customerPaymentService.aggregateKaserGoldRevenue(customer, year);            
            
            const kaser = monthShort.map((month, index) => {
                const record = aggregated.find(item => item._id === index + 1);

                return {
                    month,
                    totalCash: record?.totalCash || 0,
                    totalWeight18k: record?.totalWeight18k || 0,
                    totalWeight21k: record?.totalWeight21k || 0,
                    totalWeight995: record?.totalWeight995 || 0,
                    totalWeight999: record?.totalWeight999 || 0,
                };
            });

            return kaser;
        } catch (error) {
            throw new InternalServerErrorException('Unable to get Kaser gold revenue', { cause: error });
        }
    }

    async getCustomerOrderTypeBreakdown(args: GetCustomerAnalyticsDto) {
        try {
            if (args.customerId) {
                await this.customerService.findOne(args.customerId);
            }

            const { start, end } = resolveAnalyticsDateRange(args);
            const aggregated = await this.orderService.aggregateTypeBreakdown(
                args.customerId ?? null,
                start,
                end,
            );

            // Include every ItemType even when the customer bought none of it
            return Object.values(ItemType).map((type) => {
                const found = aggregated.find((item) => item._id === type);

                return {
                    type,
                    count: found?.count || 0,
                    totalQuantity: found?.totalQuantity || 0,
                    totalWeight: found?.totalWeight || 0,
                    totalCash: found?.totalCash || 0,
                };
            });
        } catch (error) {
            throw new InternalServerErrorException('Unable to get customer order type breakdown', { cause: error });
        }
    }

}

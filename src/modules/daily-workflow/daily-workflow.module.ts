import { Module } from '@nestjs/common';
import { DailyWorkflowController } from './daily-workflow.controller';
import { DailyWorkflowService } from './daily-workflow.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DailyWorkflow, DailyWorkflowSchema } from './schema/daily-workflow.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: DailyWorkflow.name, schema: DailyWorkflowSchema }])],
  controllers: [DailyWorkflowController],
  providers: [DailyWorkflowService]
})
export class DailyWorkflowModule { }

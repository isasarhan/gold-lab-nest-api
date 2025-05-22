import { Test, TestingModule } from '@nestjs/testing';
import { DailyWorkflowController } from './daily-workflow.controller';

describe('DailyWorkflowController', () => {
  let controller: DailyWorkflowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DailyWorkflowController],
    }).compile();

    controller = module.get<DailyWorkflowController>(DailyWorkflowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { DailyWorkflowService } from './daily-workflow.service';

describe('DailyWorkflowService', () => {
  let service: DailyWorkflowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyWorkflowService],
    }).compile();

    service = module.get<DailyWorkflowService>(DailyWorkflowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeAttendenceController } from './attendence.controller';

describe('EmployeeAttendenceController', () => {
  let controller: EmployeeAttendenceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeAttendenceController],
    }).compile();

    controller = module.get<EmployeeAttendenceController>(EmployeeAttendenceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

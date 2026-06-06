import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeAttendanceController } from './attendance.controller';

describe('EmployeeAttendanceController', () => {
  let controller: EmployeeAttendanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeAttendanceController],
    }).compile();

    controller = module.get<EmployeeAttendanceController>(EmployeeAttendanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

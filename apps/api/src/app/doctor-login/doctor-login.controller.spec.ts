import { Test, TestingModule } from '@nestjs/testing';
import { DoctorLoginController } from './doctor-login.controller';

describe('DoctorLoginController', () => {
  let controller: DoctorLoginController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorLoginController],
    }).compile();

    controller = module.get<DoctorLoginController>(DoctorLoginController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

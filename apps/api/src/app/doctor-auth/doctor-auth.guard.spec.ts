import { DoctorAuthGuard } from './doctor-auth.guard';

describe('AuthGuard', () => {
  it('should be defined', () => {
    expect(new DoctorAuthGuard()).toBeDefined();
  });
});

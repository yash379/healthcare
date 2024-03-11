import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';
import { PrismaClient, SuperRoleName, OrganizationRoleName ,HospitalRoleName} from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  private prisma = new PrismaClient();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    //console.log(requiredRoles);
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    let condition = false;
    if (user) {
      for (const role of requiredRoles) {
        switch (role) {
          case Role.POYV_ADMIN: {
            //console.log('poyvlab admin')
            const poyvRole = await this.prisma.superRole.findFirst({
              where: { name: SuperRoleName.ADMIN },
            });
            //console.log('poyvlab role id', poyvRole.id);
            const frcondition =
              (await this.prisma.userSuperRole.count({
                where: { userId: user.id, superRoleId: poyvRole.id },
              })) > 0;
            //console.log('frcondition', frcondition);
            condition = condition || frcondition;
            break;
          }
          case Role.ORGANIZATION_ADMIN: {
            //console.log('organization admin')
            const orgrole = await this.prisma.organizationRole.findFirst({
              where: { name: OrganizationRoleName.ADMIN },
            });
            //console.log('organization role id ',orgrole.id);
            const orcondition =
              (await this.prisma.userOrganizationRole.count({
                where: { userId: user.id, organizationRoleId: orgrole.id },
              })) > 0;
            //console.log('orcondition', orcondition)
            condition = condition || orcondition;
            break;
          }
          case Role.HOSPITAL_ADMIN: {
            //console.log('hospital admin')
            const hospitalRole = await this.prisma.hospitalRole.findFirst({
              where: { name: HospitalRoleName.ADMIN },
            });
            //console.log('hospital role id ',hosrole.id);
            const hospitalcondition =
              (await this.prisma.userHospitalRole.count({
                where: { userId: user.id, hospitalRoleId: hospitalRole.id },
              })) > 0;
            //console.log('orcondition', orcondition)
            condition = condition || hospitalcondition;
            break;
          }
        }
      }
    }
    //console.log('condition', condition);
    return condition;
  }
}

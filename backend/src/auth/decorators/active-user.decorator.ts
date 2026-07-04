import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface ActiveUserData {
  id: string;
  email: string;
  role: string;
  tenantId: string;
}

export const ActiveUser = createParamDecorator(
  (data: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);

export interface ActiveUserData {
    id: string;
    email: string;
    role: string;
    tenantId: string;
}
export declare const ActiveUser: (...dataOrPipes: (keyof ActiveUserData | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | undefined)[]) => ParameterDecorator;

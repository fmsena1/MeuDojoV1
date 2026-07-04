"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterTenantDto = exports.registerTenantSchema = void 0;
const zod_1 = require("zod");
exports.registerTenantSchema = zod_1.z.object({
    academyName: zod_1.z
        .string()
        .min(3, 'O nome da academia deve ter pelo menos 3 caracteres'),
    adminName: zod_1.z
        .string()
        .min(2, 'O nome do administrador deve ter pelo menos 2 caracteres'),
    email: zod_1.z.string().email('E-mail inválido'),
    password: zod_1.z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});
class RegisterTenantDto {
    academyName;
    adminName;
    email;
    password;
}
exports.RegisterTenantDto = RegisterTenantDto;
//# sourceMappingURL=register-tenant.schema.js.map
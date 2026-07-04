"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInternalUserDto = exports.createInternalUserSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createInternalUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
    email: zod_1.z.string().email('E-mail inválido'),
    password: zod_1.z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    role: zod_1.z.nativeEnum(client_1.Role, { message: 'Cargo (Role) inválido' }),
});
class CreateInternalUserDto {
    name;
    email;
    password;
    role;
}
exports.CreateInternalUserDto = CreateInternalUserDto;
//# sourceMappingURL=create-user.schema.js.map
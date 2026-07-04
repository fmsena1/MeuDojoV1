"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginDto = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('E-mail inválido'),
    password: zod_1.z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});
class LoginDto {
    email;
    password;
}
exports.LoginDto = LoginDto;
//# sourceMappingURL=login.schema.js.map
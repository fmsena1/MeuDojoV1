"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateStudentDto = exports.createStudentSchema = void 0;
const zod_1 = require("zod");
exports.createStudentSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
    email: zod_1.z.string().email('E-mail inválido').optional().nullable(),
    phone: zod_1.z.string().optional().nullable(),
    birthDate: zod_1.z.preprocess((val) => (typeof val === 'string' && val !== '' ? new Date(val) : val), zod_1.z.date().optional().nullable()),
    gender: zod_1.z.string().optional().nullable(),
    rg: zod_1.z.string().optional().nullable(),
    cpf: zod_1.z.string().optional().nullable(),
    street: zod_1.z.string().optional().nullable(),
    number: zod_1.z.string().optional().nullable(),
    complement: zod_1.z.string().optional().nullable(),
    neighborhood: zod_1.z.string().optional().nullable(),
    city: zod_1.z.string().optional().nullable(),
    state: zod_1.z.string().optional().nullable(),
    zipCode: zod_1.z.string().optional().nullable(),
    status: zod_1.z.string().default('ACTIVE'),
    createUserAccess: zod_1.z.boolean().default(false),
    password: zod_1.z
        .string()
        .min(6, 'A senha deve ter pelo menos 6 caracteres')
        .optional()
        .nullable(),
});
class CreateStudentDto {
    name;
    email;
    phone;
    birthDate;
    gender;
    rg;
    cpf;
    street;
    number;
    complement;
    neighborhood;
    city;
    state;
    zipCode;
    status;
    createUserAccess;
    password;
}
exports.CreateStudentDto = CreateStudentDto;
//# sourceMappingURL=create-student.schema.js.map
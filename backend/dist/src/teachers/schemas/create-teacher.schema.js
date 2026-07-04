"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTeacherDto = exports.createTeacherSchema = void 0;
const zod_1 = require("zod");
exports.createTeacherSchema = zod_1.z.object({
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
    bio: zod_1.z.string().optional().nullable(),
    specialties: zod_1.z.string().optional().nullable(),
    graduation: zod_1.z.string().optional().nullable(),
    status: zod_1.z.string().default('ACTIVE'),
    createUserAccess: zod_1.z.boolean().default(false),
    password: zod_1.z
        .string()
        .min(6, 'A senha deve ter pelo menos 6 caracteres')
        .optional()
        .nullable(),
});
class CreateTeacherDto {
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
    bio;
    specialties;
    graduation;
    status;
    createUserAccess;
    password;
}
exports.CreateTeacherDto = CreateTeacherDto;
//# sourceMappingURL=create-teacher.schema.js.map
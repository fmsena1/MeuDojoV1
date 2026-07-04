"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEnrollmentDto = exports.CreateEnrollmentDto = exports.updateEnrollmentSchema = exports.createEnrollmentSchema = void 0;
const zod_1 = require("zod");
exports.createEnrollmentSchema = zod_1.z.object({
    studentId: zod_1.z.string().uuid('ID do aluno inválido'),
    classId: zod_1.z.string().uuid('ID da turma inválido'),
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});
exports.updateEnrollmentSchema = zod_1.z.object({
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE']),
});
class CreateEnrollmentDto {
    studentId;
    classId;
    status;
}
exports.CreateEnrollmentDto = CreateEnrollmentDto;
class UpdateEnrollmentDto {
    status;
}
exports.UpdateEnrollmentDto = UpdateEnrollmentDto;
//# sourceMappingURL=enrollment.schema.js.map
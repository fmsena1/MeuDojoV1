"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkCreateAttendanceDto = exports.AttendanceRecordDto = exports.bulkCreateAttendanceSchema = exports.attendanceRecordSchema = void 0;
const zod_1 = require("zod");
exports.attendanceRecordSchema = zod_1.z.object({
    studentId: zod_1.z.string().uuid('ID do aluno inválido'),
    status: zod_1.z.enum(['PRESENT', 'ABSENT', 'LATE', 'JUSTIFIED']),
    notes: zod_1.z.string().optional().nullable(),
});
exports.bulkCreateAttendanceSchema = zod_1.z.object({
    classId: zod_1.z.string().uuid('ID da turma inválido'),
    date: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'A data deve estar no formato AAAA-MM-DD'),
    records: zod_1.z
        .array(exports.attendanceRecordSchema)
        .min(1, 'Pelo menos um registro de presença deve ser enviado'),
});
class AttendanceRecordDto {
    studentId;
    status;
    notes;
}
exports.AttendanceRecordDto = AttendanceRecordDto;
class BulkCreateAttendanceDto {
    classId;
    date;
    records;
}
exports.BulkCreateAttendanceDto = BulkCreateAttendanceDto;
//# sourceMappingURL=attendance.schema.js.map
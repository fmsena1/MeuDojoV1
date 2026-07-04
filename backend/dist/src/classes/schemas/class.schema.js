"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateClassDto = exports.CreateClassDto = exports.ClassScheduleDto = exports.updateClassSchema = exports.createClassSchema = exports.classScheduleSchema = void 0;
const zod_1 = require("zod");
exports.classScheduleSchema = zod_1.z.object({
    dayOfWeek: zod_1.z
        .number()
        .int()
        .min(0)
        .max(6, 'Dia da semana deve ser de 0 (Domingo) a 6 (Sábado)'),
    startTime: zod_1.z
        .string()
        .regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário de início inválido (HH:MM)'),
    endTime: zod_1.z
        .string()
        .regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário de término inválido (HH:MM)'),
});
exports.createClassSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'O nome da turma deve ter pelo menos 2 caracteres'),
    description: zod_1.z.string().optional().nullable(),
    martialArtId: zod_1.z.string().uuid('ID da modalidade inválido'),
    teacherId: zod_1.z.string().uuid('ID do professor inválido'),
    schedules: zod_1.z
        .array(exports.classScheduleSchema)
        .min(1, 'A turma deve ter pelo menos um horário definido'),
});
exports.updateClassSchema = exports.createClassSchema.partial();
class ClassScheduleDto {
    dayOfWeek;
    startTime;
    endTime;
}
exports.ClassScheduleDto = ClassScheduleDto;
class CreateClassDto {
    name;
    description;
    martialArtId;
    teacherId;
    schedules;
}
exports.CreateClassDto = CreateClassDto;
class UpdateClassDto {
    name;
    description;
    martialArtId;
    teacherId;
    schedules;
}
exports.UpdateClassDto = UpdateClassDto;
//# sourceMappingURL=class.schema.js.map
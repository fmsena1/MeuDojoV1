"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGraduationDto = exports.CreateGraduationDto = exports.updateGraduationSchema = exports.createGraduationSchema = void 0;
const zod_1 = require("zod");
exports.createGraduationSchema = zod_1.z.object({
    martialArtId: zod_1.z.string().uuid('ID da modalidade inválido'),
    name: zod_1.z.string().min(1, 'O nome da faixa é obrigatório'),
    order: zod_1.z.number().int().min(0).default(0),
    color: zod_1.z.string().optional().nullable(),
});
exports.updateGraduationSchema = exports.createGraduationSchema
    .omit({ martialArtId: true })
    .partial();
class CreateGraduationDto {
    martialArtId;
    name;
    order;
    color;
}
exports.CreateGraduationDto = CreateGraduationDto;
class UpdateGraduationDto {
    name;
    order;
    color;
}
exports.UpdateGraduationDto = UpdateGraduationDto;
//# sourceMappingURL=graduation.schema.js.map
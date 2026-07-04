"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMartialArtDto = exports.CreateMartialArtDto = exports.updateMartialArtSchema = exports.createMartialArtSchema = void 0;
const zod_1 = require("zod");
exports.createMartialArtSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
    description: zod_1.z.string().optional().nullable(),
});
exports.updateMartialArtSchema = exports.createMartialArtSchema.partial();
class CreateMartialArtDto {
    name;
    description;
}
exports.CreateMartialArtDto = CreateMartialArtDto;
class UpdateMartialArtDto {
    name;
    description;
}
exports.UpdateMartialArtDto = UpdateMartialArtDto;
//# sourceMappingURL=martial-art.schema.js.map
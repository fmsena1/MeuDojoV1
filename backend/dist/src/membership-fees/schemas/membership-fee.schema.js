"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayMembershipFeeDto = exports.BulkGenerateMembershipFeesDto = exports.CreateMembershipFeeDto = exports.payMembershipFeeSchema = exports.bulkGenerateMembershipFeesSchema = exports.createMembershipFeeSchema = void 0;
const zod_1 = require("zod");
exports.createMembershipFeeSchema = zod_1.z.object({
    studentId: zod_1.z.string().uuid('ID do aluno inválido'),
    amount: zod_1.z.number().positive('O valor deve ser maior que zero'),
    dueDate: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'A data de vencimento deve estar no formato AAAA-MM-DD'),
    notes: zod_1.z.string().optional().nullable(),
});
exports.bulkGenerateMembershipFeesSchema = zod_1.z.object({
    month: zod_1.z.number().int().min(1).max(12),
    year: zod_1.z.number().int().min(2000).max(2100),
    amount: zod_1.z.number().positive('O valor padrão deve ser maior que zero'),
    dueDate: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'A data de vencimento deve estar no formato AAAA-MM-DD'),
});
exports.payMembershipFeeSchema = zod_1.z.object({
    paidAt: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'A data de pagamento deve estar no formato AAAA-MM-DD')
        .optional()
        .nullable(),
});
class CreateMembershipFeeDto {
    studentId;
    amount;
    dueDate;
    notes;
}
exports.CreateMembershipFeeDto = CreateMembershipFeeDto;
class BulkGenerateMembershipFeesDto {
    month;
    year;
    amount;
    dueDate;
}
exports.BulkGenerateMembershipFeesDto = BulkGenerateMembershipFeesDto;
class PayMembershipFeeDto {
    paidAt;
}
exports.PayMembershipFeeDto = PayMembershipFeeDto;
//# sourceMappingURL=membership-fee.schema.js.map
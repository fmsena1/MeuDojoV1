"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTransactionDto = exports.createTransactionSchema = void 0;
const zod_1 = require("zod");
exports.createTransactionSchema = zod_1.z.object({
    type: zod_1.z.enum(['REVENUE', 'EXPENSE']),
    category: zod_1.z.string().min(2, 'A categoria é obrigatória'),
    amount: zod_1.z.number().positive('O valor deve ser maior que zero'),
    date: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'A data deve estar no formato AAAA-MM-DD'),
    description: zod_1.z
        .string()
        .min(3, 'A descrição deve ter pelo menos 3 caracteres'),
});
class CreateTransactionDto {
    type;
    category;
    amount;
    date;
    description;
}
exports.CreateTransactionDto = CreateTransactionDto;
//# sourceMappingURL=transaction.schema.js.map
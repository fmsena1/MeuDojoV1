"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipFeesController = void 0;
const common_1 = require("@nestjs/common");
const membership_fees_service_1 = require("./membership-fees.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const active_user_decorator_1 = require("../auth/decorators/active-user.decorator");
const zod_validation_pipe_1 = require("../common/pipes/zod-validation.pipe");
const prisma_service_1 = require("../prisma/prisma.service");
const membership_fee_schema_1 = require("./schemas/membership-fee.schema");
let MembershipFeesController = class MembershipFeesController {
    membershipFeesService;
    prisma;
    constructor(membershipFeesService, prisma) {
        this.membershipFeesService = membershipFeesService;
        this.prisma = prisma;
    }
    async create(dto, user) {
        return this.membershipFeesService.create(dto, user.tenantId);
    }
    async bulkGenerate(dto, user) {
        return this.membershipFeesService.bulkGenerate(dto, user.tenantId);
    }
    async findAll(user, status, studentId) {
        let targetStudentId = studentId;
        if (user.role === client_1.Role.STUDENT) {
            const student = await this.prisma.student.findUnique({
                where: { userId: user.id },
            });
            targetStudentId = student?.id || 'none';
        }
        return this.membershipFeesService.findAll(user.tenantId, {
            status,
            studentId: targetStudentId,
        });
    }
    async pay(id, dto, user) {
        return this.membershipFeesService.pay(id, dto, user.tenantId);
    }
    async remove(id, user) {
        return this.membershipFeesService.remove(id, user.tenantId);
    }
};
exports.MembershipFeesController = MembershipFeesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.RECEPTIONIST),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(membership_fee_schema_1.createMembershipFeeSchema)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, active_user_decorator_1.ActiveUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [membership_fee_schema_1.CreateMembershipFeeDto, Object]),
    __metadata("design:returntype", Promise)
], MembershipFeesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.RECEPTIONIST),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(membership_fee_schema_1.bulkGenerateMembershipFeesSchema)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, active_user_decorator_1.ActiveUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [membership_fee_schema_1.BulkGenerateMembershipFeesDto, Object]),
    __metadata("design:returntype", Promise)
], MembershipFeesController.prototype, "bulkGenerate", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.RECEPTIONIST, client_1.Role.STUDENT),
    __param(0, (0, active_user_decorator_1.ActiveUser)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], MembershipFeesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(':id/pay'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.RECEPTIONIST),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(membership_fee_schema_1.payMembershipFeeSchema)),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, active_user_decorator_1.ActiveUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, membership_fee_schema_1.PayMembershipFeeDto, Object]),
    __metadata("design:returntype", Promise)
], MembershipFeesController.prototype, "pay", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, active_user_decorator_1.ActiveUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MembershipFeesController.prototype, "remove", null);
exports.MembershipFeesController = MembershipFeesController = __decorate([
    (0, common_1.Controller)('membership-fees'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [membership_fees_service_1.MembershipFeesService,
        prisma_service_1.PrismaService])
], MembershipFeesController);
//# sourceMappingURL=membership-fees.controller.js.map
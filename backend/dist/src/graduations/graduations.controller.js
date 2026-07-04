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
exports.GraduationsController = void 0;
const common_1 = require("@nestjs/common");
const graduations_service_1 = require("./graduations.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const active_user_decorator_1 = require("../auth/decorators/active-user.decorator");
const zod_validation_pipe_1 = require("../common/pipes/zod-validation.pipe");
const graduation_schema_1 = require("./schemas/graduation.schema");
let GraduationsController = class GraduationsController {
    graduationsService;
    constructor(graduationsService) {
        this.graduationsService = graduationsService;
    }
    async create(dto, user) {
        return this.graduationsService.create(dto, user.tenantId);
    }
    async findAllByMartialArt(martialArtId, user) {
        return this.graduationsService.findAllByMartialArt(martialArtId, user.tenantId);
    }
    async findOne(id, user) {
        return this.graduationsService.findOne(id, user.tenantId);
    }
    async update(id, dto, user) {
        return this.graduationsService.update(id, dto, user.tenantId);
    }
    async remove(id, user) {
        return this.graduationsService.remove(id, user.tenantId);
    }
};
exports.GraduationsController = GraduationsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(graduation_schema_1.createGraduationSchema)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, active_user_decorator_1.ActiveUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [graduation_schema_1.CreateGraduationDto, Object]),
    __metadata("design:returntype", Promise)
], GraduationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('by-martial-art/:martialArtId'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.RECEPTIONIST, client_1.Role.TEACHER),
    __param(0, (0, common_1.Param)('martialArtId')),
    __param(1, (0, active_user_decorator_1.ActiveUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GraduationsController.prototype, "findAllByMartialArt", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.RECEPTIONIST, client_1.Role.TEACHER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, active_user_decorator_1.ActiveUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GraduationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(graduation_schema_1.updateGraduationSchema)),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, active_user_decorator_1.ActiveUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, graduation_schema_1.UpdateGraduationDto, Object]),
    __metadata("design:returntype", Promise)
], GraduationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, active_user_decorator_1.ActiveUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GraduationsController.prototype, "remove", null);
exports.GraduationsController = GraduationsController = __decorate([
    (0, common_1.Controller)('graduations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [graduations_service_1.GraduationsService])
], GraduationsController);
//# sourceMappingURL=graduations.controller.js.map
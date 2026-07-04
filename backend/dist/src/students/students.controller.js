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
exports.StudentsController = void 0;
const common_1 = require("@nestjs/common");
const students_service_1 = require("./students.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const active_user_decorator_1 = require("../auth/decorators/active-user.decorator");
const zod_validation_pipe_1 = require("../common/pipes/zod-validation.pipe");
const create_student_schema_1 = require("./schemas/create-student.schema");
const update_student_schema_1 = require("./schemas/update-student.schema");
let StudentsController = class StudentsController {
    studentsService;
    constructor(studentsService) {
        this.studentsService = studentsService;
    }
    async create(createStudentDto, user) {
        return this.studentsService.create(createStudentDto, user.tenantId);
    }
    async findAll(user, search) {
        return this.studentsService.findAll(user.tenantId, search);
    }
    async findOne(id, user) {
        return this.studentsService.findOne(id, user.tenantId);
    }
    async update(id, updateStudentDto, user) {
        return this.studentsService.update(id, updateStudentDto, user.tenantId);
    }
    async remove(id, user) {
        return this.studentsService.remove(id, user.tenantId);
    }
};
exports.StudentsController = StudentsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.RECEPTIONIST),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(create_student_schema_1.createStudentSchema)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, active_user_decorator_1.ActiveUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_student_schema_1.CreateStudentDto, Object]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.RECEPTIONIST, client_1.Role.TEACHER),
    __param(0, (0, active_user_decorator_1.ActiveUser)()),
    __param(1, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.RECEPTIONIST, client_1.Role.TEACHER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, active_user_decorator_1.ActiveUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.RECEPTIONIST),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(update_student_schema_1.updateStudentSchema)),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, active_user_decorator_1.ActiveUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_student_schema_1.UpdateStudentDto, Object]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, active_user_decorator_1.ActiveUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "remove", null);
exports.StudentsController = StudentsController = __decorate([
    (0, common_1.Controller)('students'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [students_service_1.StudentsService])
], StudentsController);
//# sourceMappingURL=students.controller.js.map
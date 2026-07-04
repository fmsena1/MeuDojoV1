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
exports.AttendancesController = void 0;
const common_1 = require("@nestjs/common");
const attendances_service_1 = require("./attendances.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const active_user_decorator_1 = require("../auth/decorators/active-user.decorator");
const zod_validation_pipe_1 = require("../common/pipes/zod-validation.pipe");
const attendance_schema_1 = require("./schemas/attendance.schema");
let AttendancesController = class AttendancesController {
    attendancesService;
    constructor(attendancesService) {
        this.attendancesService = attendancesService;
    }
    async saveBulk(dto, user) {
        return this.attendancesService.saveBulk(dto, user.tenantId);
    }
    async findByClassAndDate(classId, date, user) {
        if (!date) {
            throw new common_1.BadRequestException('O parâmetro de data (date) é obrigatório.');
        }
        return this.attendancesService.findByClassAndDate(classId, date, user.tenantId);
    }
    async findHistoryByStudent(studentId, user) {
        if (user.role === client_1.Role.STUDENT) {
        }
        return this.attendancesService.findHistoryByStudent(studentId, user.tenantId);
    }
};
exports.AttendancesController = AttendancesController;
__decorate([
    (0, common_1.Post)('bulk'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.TEACHER, client_1.Role.RECEPTIONIST),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(attendance_schema_1.bulkCreateAttendanceSchema)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, active_user_decorator_1.ActiveUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_schema_1.BulkCreateAttendanceDto, Object]),
    __metadata("design:returntype", Promise)
], AttendancesController.prototype, "saveBulk", null);
__decorate([
    (0, common_1.Get)('class/:classId'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.TEACHER, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Param)('classId')),
    __param(1, (0, common_1.Query)('date')),
    __param(2, (0, active_user_decorator_1.ActiveUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AttendancesController.prototype, "findByClassAndDate", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.TEACHER, client_1.Role.RECEPTIONIST, client_1.Role.STUDENT),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, active_user_decorator_1.ActiveUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AttendancesController.prototype, "findHistoryByStudent", null);
exports.AttendancesController = AttendancesController = __decorate([
    (0, common_1.Controller)('attendances'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [attendances_service_1.AttendancesService])
], AttendancesController);
//# sourceMappingURL=attendances.controller.js.map
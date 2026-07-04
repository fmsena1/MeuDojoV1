"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTeacherDto = exports.updateTeacherSchema = void 0;
const create_teacher_schema_1 = require("./create-teacher.schema");
exports.updateTeacherSchema = create_teacher_schema_1.createTeacherSchema.partial();
class UpdateTeacherDto {
    name;
    email;
    phone;
    birthDate;
    gender;
    rg;
    cpf;
    street;
    number;
    complement;
    neighborhood;
    city;
    state;
    zipCode;
    bio;
    specialties;
    graduation;
    status;
    createUserAccess;
    password;
}
exports.UpdateTeacherDto = UpdateTeacherDto;
//# sourceMappingURL=update-teacher.schema.js.map
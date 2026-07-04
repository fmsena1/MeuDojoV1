"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStudentDto = exports.updateStudentSchema = void 0;
const create_student_schema_1 = require("./create-student.schema");
exports.updateStudentSchema = create_student_schema_1.createStudentSchema.partial();
class UpdateStudentDto {
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
    status;
    createUserAccess;
    password;
}
exports.UpdateStudentDto = UpdateStudentDto;
//# sourceMappingURL=update-student.schema.js.map
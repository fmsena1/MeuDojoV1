import { StudentsService } from './students.service';
import type { ActiveUserData } from '../auth/decorators/active-user.decorator';
import { CreateStudentDto } from './schemas/create-student.schema';
import { UpdateStudentDto } from './schemas/update-student.schema';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    create(createStudentDto: CreateStudentDto, user: ActiveUserData): Promise<{
        user: {
            email: string;
            role: import("@prisma/client").$Enums.Role;
            id: string;
        } | null;
    } & {
        number: string | null;
        name: string;
        email: string | null;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        phone: string | null;
        birthDate: Date | null;
        gender: string | null;
        rg: string | null;
        cpf: string | null;
        street: string | null;
        complement: string | null;
        neighborhood: string | null;
        city: string | null;
        state: string | null;
        zipCode: string | null;
        status: string;
        userId: string | null;
    }>;
    findAll(user: ActiveUserData, search?: string): Promise<({
        user: {
            email: string;
            role: import("@prisma/client").$Enums.Role;
            id: string;
        } | null;
    } & {
        number: string | null;
        name: string;
        email: string | null;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        phone: string | null;
        birthDate: Date | null;
        gender: string | null;
        rg: string | null;
        cpf: string | null;
        street: string | null;
        complement: string | null;
        neighborhood: string | null;
        city: string | null;
        state: string | null;
        zipCode: string | null;
        status: string;
        userId: string | null;
    })[]>;
    findOne(id: string, user: ActiveUserData): Promise<{
        user: {
            email: string;
            role: import("@prisma/client").$Enums.Role;
            id: string;
        } | null;
    } & {
        number: string | null;
        name: string;
        email: string | null;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        phone: string | null;
        birthDate: Date | null;
        gender: string | null;
        rg: string | null;
        cpf: string | null;
        street: string | null;
        complement: string | null;
        neighborhood: string | null;
        city: string | null;
        state: string | null;
        zipCode: string | null;
        status: string;
        userId: string | null;
    }>;
    update(id: string, updateStudentDto: UpdateStudentDto, user: ActiveUserData): Promise<{
        user: {
            email: string;
            role: import("@prisma/client").$Enums.Role;
            id: string;
        } | null;
    } & {
        number: string | null;
        name: string;
        email: string | null;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        phone: string | null;
        birthDate: Date | null;
        gender: string | null;
        rg: string | null;
        cpf: string | null;
        street: string | null;
        complement: string | null;
        neighborhood: string | null;
        city: string | null;
        state: string | null;
        zipCode: string | null;
        status: string;
        userId: string | null;
    }>;
    remove(id: string, user: ActiveUserData): Promise<{
        number: string | null;
        name: string;
        email: string | null;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        phone: string | null;
        birthDate: Date | null;
        gender: string | null;
        rg: string | null;
        cpf: string | null;
        street: string | null;
        complement: string | null;
        neighborhood: string | null;
        city: string | null;
        state: string | null;
        zipCode: string | null;
        status: string;
        userId: string | null;
    }>;
}

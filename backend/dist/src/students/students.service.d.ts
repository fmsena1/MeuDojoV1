import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './schemas/create-student.schema';
import { UpdateStudentDto } from './schemas/update-student.schema';
export declare class StudentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateStudentDto, tenantId: string): Promise<{
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
    findAll(tenantId: string, search?: string): Promise<({
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
    findOne(id: string, tenantId: string): Promise<{
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
    update(id: string, data: UpdateStudentDto, tenantId: string): Promise<{
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
    remove(id: string, tenantId: string): Promise<{
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

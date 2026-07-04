import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { MartialArtsModule } from './martial-arts/martial-arts.module';
import { GraduationsModule } from './graduations/graduations.module';
import { ClassesModule } from './classes/classes.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { AttendancesModule } from './attendances/attendances.module';
import { MembershipFeesModule } from './membership-fees/membership-fees.module';
import { TransactionsModule } from './transactions/transactions.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    StudentsModule,
    TeachersModule,
    MartialArtsModule,
    GraduationsModule,
    ClassesModule,
    EnrollmentsModule,
    AttendancesModule,
    MembershipFeesModule,
    TransactionsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

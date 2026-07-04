-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('REVENUE', 'EXPENSE');

-- CreateTable
CREATE TABLE "membership_fees" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "due_date" DATE NOT NULL,
    "paid_at" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "transaction_id" UUID,

    CONSTRAINT "membership_fees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "type" "TransactionType" NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" DATE NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "membership_fees_transaction_id_key" ON "membership_fees"("transaction_id");

-- AddForeignKey
ALTER TABLE "membership_fees" ADD CONSTRAINT "membership_fees_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membership_fees" ADD CONSTRAINT "membership_fees_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membership_fees" ADD CONSTRAINT "membership_fees_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

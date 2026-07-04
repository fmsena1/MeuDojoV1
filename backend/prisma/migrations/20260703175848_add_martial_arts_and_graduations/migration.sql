-- CreateTable
CREATE TABLE "martial_arts" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "martial_arts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "graduations" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "martial_art_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "graduations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "martial_arts" ADD CONSTRAINT "martial_arts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "graduations" ADD CONSTRAINT "graduations_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "graduations" ADD CONSTRAINT "graduations_martial_art_id_fkey" FOREIGN KEY ("martial_art_id") REFERENCES "martial_arts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

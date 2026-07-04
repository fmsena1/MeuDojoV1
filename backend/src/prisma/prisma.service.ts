import 'dotenv/config';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private static pool: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL;

    // Falha explícita se a variável de ambiente não estiver configurada
    if (!connectionString) {
      throw new Error(
        '[PrismaService] FATAL: DATABASE_URL não está definida. ' +
          'Configure-a nas Environment Variables do Render.',
      );
    }

    // Log temporário de diagnóstico — REMOVER APÓS RESOLVER O PROBLEMA
    console.log(`[PrismaService] DATABASE_URL = ${connectionString}`);

    const isLocalhost =
      connectionString.includes('localhost') ||
      connectionString.includes('127.0.0.1');

    const ssl = isLocalhost ? false : { rejectUnauthorized: false };

    const pool = new Pool({
      connectionString,
      ssl,
      // Timeout maior para suportar cold-start do Neon (banco serverless)
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
    });

    const adapter = new PrismaPg(pool);

    super({
      adapter,
      log:
        process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });

    PrismaService.pool = pool;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    if (PrismaService.pool) {
      await PrismaService.pool.end();
    }
  }
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para permitir comunicação com o frontend
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('MeuDojo API - MVP V1')
    .setDescription(
      'Especificação das APIs de gerenciamento do MeuDojo (Multi-tenant)',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`\n[MeuDojo API] Servidor iniciado com sucesso!`);
  console.log(`[MeuDojo API] Backend rodando em: http://localhost:${port}`);
  console.log(
    `[MeuDojo API] Documentação Swagger em: http://localhost:${port}/docs\n`,
  );
}
bootstrap();

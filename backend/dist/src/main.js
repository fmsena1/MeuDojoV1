"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('MeuDojo API - MVP V1')
        .setDescription('Especificação das APIs de gerenciamento do MeuDojo (Multi-tenant)')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    console.log(`\n[MeuDojo API] Servidor iniciado com sucesso!`);
    console.log(`[MeuDojo API] Backend rodando em: http://localhost:${port}`);
    console.log(`[MeuDojo API] Documentação Swagger em: http://localhost:${port}/docs\n`);
}
bootstrap();
//# sourceMappingURL=main.js.map
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TadorModule } from './tador/tador.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from './pipes/validation.pipe';
import { readFileSync } from 'fs';

//import { AuthorizeInterceptor } from 'middlewares/authorize.middleware';
//import { AuthModule } from 'auth/auth.module';
//import { UserService } from 'services/user.service';
import { join } from 'path';
const clientPath = join(__dirname, '../../client/dist');
async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        //new FastifyAdapter());
        new FastifyAdapter({
            http2: true,
            https: {
                allowHTTP1: true, // fallback support for HTTP1
                cert: readFileSync(join(__dirname, '../../../localhost.pem')),
                key: readFileSync(join(__dirname, '../../../localhost-key.pem')),
            },
        }),
    );

    // enable cors for static angular site.
    const corsOptions = {
        origin: [
            'https://localhost:3000',
            'https://localhost:4200',
            'https://praedicta-2b6a3.firebaseapp.com',
            'https://arkadiy-8',
        ],
        optionsSuccessStatus: 200,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    };

    // const corsOptions = {
    //     origin: '*',
    //     optionsSuccessStatus: 200,
    //     credentials: true,
    //     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    // };
    app.register(require('fastify-cors'), corsOptions);

    // enable cookie for auth.
    app.register(require('fastify-cookie'));

    // validate types and extra
    app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: true }));

    // app.useGlobalInterceptors(new AuthorizeInterceptor(app.select(AuthModule).get(UserService)));

    app.useStaticAssets({ root: clientPath });
    await app.listen(3000, '0.0.0.0');
}
bootstrap();

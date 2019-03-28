import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MacroController } from './macro.controller';
import { GuardMiddleware } from '../middlewares/guard.middleware';
import { Role } from 'shared';
import { CompressionMiddleware } from '@nest-middlewares/compression';
@Module({
  controllers: [MacroController],
  providers: [],
})
export class MacroModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(new GuardMiddleware([Role.Admin, Role.Macro]).resolve).forRoutes(
      {
        path: '/rest/macro',
        method: RequestMethod.ALL,
      },
    );
    consumer.apply(CompressionMiddleware).forRoutes( '*' );
  }
}
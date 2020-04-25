import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '@/config';

export const DatabaseModule = TypeOrmModule.forRoot(config.orm);

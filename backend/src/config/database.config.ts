import { Configuration, Value } from '@itgorillaz/configify';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { IsBoolean, IsString } from 'class-validator';

@Configuration()
export class DatabaseConfig {
  @IsString()
  @Value('DATABASE_URL')
  databaseUrl: string;

  @IsBoolean()
  @Value('DB_SSL', {
    parse: (v) => (v === undefined ? true : ['1', 'true', 'yes'].includes(String(v).toLowerCase())),
  })
  ssl: boolean;

  getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      url: this.databaseUrl,
      ssl: this.ssl ? { rejectUnauthorized: false } : false,
      synchronize: true,
      autoLoadEntities: true,
    };
  }
}

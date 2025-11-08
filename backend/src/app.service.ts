import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test } from './entities/test.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Test)
    private readonly testRepository: Repository<Test>,
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  async testDatabase(): Promise<{ success: boolean; message: string; data?: Test }> {
    try {
      // Try to create a test record
      const testRecord = this.testRepository.create({
        message: 'Database connection test',
      });
      const saved = await this.testRepository.save(testRecord);

      // Try to read it back
      const found = await this.testRepository.findOne({ where: { id: saved.id } }) || undefined;

      return {
        success: true,
        message: 'Database connection successful!',
        data: found,
      };
    } catch (error) {
      return {
        success: false,
        message: `Database connection failed: ${error.message}`,
      };
    }
  }
}

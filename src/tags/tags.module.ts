import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagRepository } from 'src/tags/repositories/tag.repository';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { Tag } from './entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  exports: [TypeOrmModule, TagsService],
  providers: [TagsService, TagRepository],
  controllers: [TagsController],
})
export class TagsModule {}

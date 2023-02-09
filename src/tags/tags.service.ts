import { Injectable } from '@nestjs/common';
import { TagRepository } from './repositories/tag.repository';
import { Tag } from './entities/tag.entity';
import { CreateMultipleTagsDto } from './dto/create-multiple-tags.dto';

@Injectable()
export class TagsService {
  constructor(private readonly tagRepository: TagRepository) {}

  getTags(): Promise<Array<Tag>> {
    return this.tagRepository.getTags();
  }

  createTags(
    createMultipleTagsDto: CreateMultipleTagsDto,
  ): Promise<Array<Tag>> {
    return this.tagRepository.createMultipleTags(createMultipleTagsDto.tags);
  }
}

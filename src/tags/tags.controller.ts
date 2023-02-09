import { Controller, Get, Post, Body } from '@nestjs/common';
import { TagsService } from './tags.service';
import { Tag } from './entities/tag.entity';
import { CreateMultipleTagsDto } from './dto/create-multiple-tags.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  getTags(): Promise<Array<Tag>> {
    return this.tagsService.getTags();
  }

  @Post()
  createTags(
    @Body() createMultipleTagsDto: CreateMultipleTagsDto,
  ): Promise<Array<Tag>> {
    return this.tagsService.createTags(createMultipleTagsDto);
  }
}

import { DataSource, In, Repository } from 'typeorm';
import { Tag } from '../entities/tag.entity';
import { CreateTagDto } from '../dto/create-tag.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TagRepository extends Repository<Tag> {
  constructor(dataSource: DataSource) {
    super(Tag, dataSource.createEntityManager());
  }

  getTags(): Promise<Array<Tag>> {
    return this.find();
  }

  findTagById(tagId: string): Promise<Tag> {
    return this.findOne({ where: { tagId: tagId } });
  }

  findTagByName(tagName: string): Promise<Tag> {
    return this.findOne({ where: { name: tagName } });
  }

  async createTag(createTagDto: CreateTagDto): Promise<Tag> {
    const { name } = createTagDto;
    createTagDto.name = name.toLowerCase();

    const tag = await this.findTagByName(createTagDto.name);
    if (tag) return tag;

    return this.save(createTagDto);
  }

  async createMultipleTags(tags: Array<string>): Promise<Array<Tag>> {
    const filteredTags = new Set(tags.map((tag) => tag.toLowerCase()));

    const existingTags = await this.find({
      where: { name: In([...filteredTags]) },
    });

    const existingNames = existingTags.map((tag) => tag.name);

    const notSaved = [...filteredTags]
      .filter((tag) => !existingNames.includes(tag))
      .map((tag) => ({ name: tag }));

    const newTags = await this.save(notSaved);

    return [...existingTags, ...newTags];
  }
}

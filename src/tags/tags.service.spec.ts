import { Test } from '@nestjs/testing';
import { TagsService } from './tags.service';
import { TagRepository } from './repositories/tag.repository';

describe('TagsService', () => {
  let service: TagsService;
  let tagRepo: TagRepository;

  const mockTagRepository = () => ({
    getTags: jest.fn(),
    findTagById: jest.fn(),
    findTagByName: jest.fn(),
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TagsService,
        { provide: TagRepository, useFactory: mockTagRepository },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
    tagRepo = module.get<TagRepository>(TagRepository);
  });

  describe('getTags', () => {
    it('should gets all tags from repo', async () => {
      (tagRepo.getTags as jest.Mock).mockResolvedValue('tags');

      const tags = await service.getTags();

      expect(tags).toBe('tags');
    });
  });
});

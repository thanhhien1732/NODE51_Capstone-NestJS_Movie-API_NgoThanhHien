import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { CreateMovieGenreDto } from './dto/create-movie-genre.dto';
import { UpdateMovieGenreDto } from './dto/update-movie-genre.dto';
import { FindAllMovieGenreDto } from './dto/find-all-movie-genre.dto';

@Injectable()
export class MovieGenreService {
  constructor(private readonly prisma: PrismaService) { }

  // ------------------ CREATE ------------------
  async create(dto: CreateMovieGenreDto) {
    const genreExist = await this.prisma.movieGenres.findFirst({
      where: { movieGenreName: dto.movieGenreName, isDeleted: false },
    });

    if (genreExist) throw new BadRequestException('Movie genre name already exists!');

    const newGenre = await this.prisma.movieGenres.create({ data: dto });
    return {
      id: newGenre.movieGenreId,
      name: newGenre.movieGenreName,
      createdAt: newGenre.createdAt,
    };
  }

  // ------------------ FIND ALL ------------------
  async findAll(query: FindAllMovieGenreDto) {
    const { page, pageSize, keyword } = query;

    const where = {
      isDeleted: false,
      ...(keyword ? { movieGenreName: { contains: keyword } } : {}),
    };

    const hasPagination = page && pageSize;
    const skip = hasPagination ? (Number(page) - 1) * Number(pageSize) : undefined;
    const take = hasPagination ? Number(pageSize) : undefined;

    const [items, totalItem] = await Promise.all([
      this.prisma.movieGenres.findMany({
        where,
        skip,
        take,
        orderBy: { movieGenreId: 'desc' },
      }),
      this.prisma.movieGenres.count({ where }),
    ]);

    return {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || totalItem,
      totalItem,
      totalPage: hasPagination ? Math.ceil(totalItem / Number(pageSize)) : 1,
      keyword: keyword || null,
      items: items.map((g) => ({
        id: g.movieGenreId,
        name: g.movieGenreName,
        createdAt: g.createdAt,
        updatedAt: g.updatedAt,
      })),
    };
  }

  // ------------------ FIND ONE ------------------
  async findOne(id: number) {
    const genreExist = await this.prisma.movieGenres.findUnique({
      where: { movieGenreId: id },
    });

    if (!genreExist || genreExist.isDeleted)
      throw new NotFoundException('Movie genre not found!');

    return {
      id: genreExist.movieGenreId,
      name: genreExist.movieGenreName,
      createdAt: genreExist.createdAt,
      updatedAt: genreExist.updatedAt,
    };
  }

  // ------------------ UPDATE ------------------
  async update(id: number, dto: UpdateMovieGenreDto) {
    const genreExist = await this.prisma.movieGenres.findUnique({
      where: { movieGenreId: id },
    });
    if (!genreExist || genreExist.isDeleted)
      throw new NotFoundException('Movie genre not found!');

    if (dto.movieGenreName) {
      const dup = await this.prisma.movieGenres.findFirst({
        where: {
          movieGenreName: dto.movieGenreName,
          isDeleted: false,
          NOT: { movieGenreId: id },
        },
      });
      if (dup)
        throw new BadRequestException('A movie genre with this name already exists!');
    }

    const updated = await this.prisma.movieGenres.update({
      where: { movieGenreId: id },
      data: dto,
    });

    return {
      id: updated.movieGenreId,
      name: updated.movieGenreName,
      updatedAt: updated.updatedAt,
    };
  }

  // ------------------ DELETE ------------------
  async delete(id: number) {
    const genreExist = await this.prisma.movieGenres.findUnique({
      where: { movieGenreId: id },
    });

    if (!genreExist) throw new NotFoundException('Movie genre not found!');

    if (genreExist.isDeleted) throw new BadRequestException('Movie genre already deleted!');

    const deleted = await this.prisma.movieGenres.update({
      where: { movieGenreId: id },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    return {
      id: deleted.movieGenreId,
      name: deleted.movieGenreName,
      isDeleted: deleted.isDeleted,
      deletedAt: deleted.deletedAt,
    };
  }

  // ------------------ RESTORE ------------------
  async restore(id: number) {
    const genreExist = await this.prisma.movieGenres.findUnique({
      where: { movieGenreId: id },
    });

    if (!genreExist) throw new NotFoundException('Movie genre not found!');

    if (!genreExist.isDeleted) throw new BadRequestException('Movie genre is not deleted!');

    const restored = await this.prisma.movieGenres.update({
      where: { movieGenreId: id },
      data: { isDeleted: false, deletedAt: null },
    });

    return {
      id: restored.movieGenreId,
      name: restored.movieGenreName,
      isDeleted: restored.isDeleted,
      restoredAt: restored.updatedAt,
    };
  }
}

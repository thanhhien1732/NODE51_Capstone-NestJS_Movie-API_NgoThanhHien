import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { FindAllMovieDto } from './dto/find-all-movie.dto';
import cloudinary from 'src/common/cloudinary/init.cloudinary';

@Injectable()
export class MovieService {
  constructor(private readonly prisma: PrismaService) { }

  // ------------------ CREATE ------------------
  async create(dto: CreateMovieDto, file?: Express.Multer.File) {
    const movieExist = await this.prisma.movies.findFirst({
      where: { movieName: dto.movieName, isDeleted: false },
    });

    if (movieExist) throw new BadRequestException('Movie name already exists!');

    let posterPublicId: string | null = null;
    let posterUrl: string | null = null;

    if (file) {
      const buffer = file.buffer;
      const uploaded = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: 'movie/movie-posters' }, (err, result) => {
            if (err) return reject(err);
            resolve(result);
          })
          .end(buffer);
      });
      posterPublicId = uploaded.public_id;
      posterUrl = uploaded.secure_url;
    }

    function toBool(v: any): boolean {
      if (v === true || v === 'true' || v === 1 || v === '1') return true;
      return false;
    }

    const newMovie = await this.prisma.movies.create({
      data: {
        movieName: dto.movieName,
        description: dto.description,
        trailer: dto.trailer,
        poster: posterPublicId,
        basePrice: dto.basePrice ?? 0,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        isComing: toBool(dto.isComing),
        isShowing: toBool(dto.isShowing),
        isHot: toBool(dto.isHot),
        movieGenreId: dto.movieGenreId ?? null,
        ageLimitId: dto.ageLimitId ?? null,
      },
      include: {
        MovieGenres: { select: { movieGenreName: true } },
        AgeLimits: { select: { ageLabel: true } },
      },
    });

    return {
      id: newMovie.movieId,
      name: newMovie.movieName,
      description: newMovie.description,
      posterId: newMovie.poster,
      posterUrl,
      trailer: newMovie.trailer,
      startDate: newMovie.startDate,
      endDate: newMovie.endDate,
      basePrice: newMovie.basePrice,
      isComing: newMovie.isComing,
      isShowing: newMovie.isShowing,
      isHot: newMovie.isHot,
      genre: newMovie.MovieGenres?.movieGenreName ?? null,
      ageLimit: newMovie.AgeLimits?.ageLabel ?? null,
      createdAt: newMovie.createdAt,
    };
  }

  // ------------------ FIND ALL ------------------
  async findAll(query: FindAllMovieDto) {
    const { page, pageSize, keyword, genreId, ageLimitId, isComing, isShowing, isHot } = query;

    const where = {
      isDeleted: false,
      ...(keyword ? { movieName: { contains: keyword } } : {}),
      ...(genreId ? { movieGenreId: Number(genreId) } : {}),
      ...(ageLimitId ? { ageLimitId: Number(ageLimitId) } : {}),
      ...(isComing !== undefined ? { isComing: Boolean(isComing) } : {}),
      ...(isShowing !== undefined ? { isShowing: Boolean(isShowing) } : {}),
      ...(isHot !== undefined ? { isHot: Boolean(isHot) } : {}),
    };

    const hasPagination = page && pageSize;
    const skip = hasPagination ? (Number(page) - 1) * Number(pageSize) : undefined;
    const take = hasPagination ? Number(pageSize) : undefined;

    const [items, totalItem] = await Promise.all([
      this.prisma.movies.findMany({
        where,
        skip,
        take,
        include: {
          MovieGenres: true,
          AgeLimits: true,
        },
        orderBy: { movieId: 'desc' },
      }),
      this.prisma.movies.count({ where }),
    ]);

    return {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || totalItem,
      totalItem,
      totalPage: hasPagination ? Math.ceil(totalItem / Number(pageSize)) : 1,
      keyword: keyword || null,
      items: items.map(movie => ({
        id: movie.movieId,
        name: movie.movieName,
        description: movie.description,
        poster: movie.poster,
        trailer: movie.trailer,
        startDate: movie.startDate,
        endDate: movie.endDate,
        basePrice: movie.basePrice,
        isComing: movie.isComing,
        isShowing: movie.isShowing,
        isHot: movie.isHot,
        genre: movie.MovieGenres?.movieGenreName ?? null,
        ageLimit: movie.AgeLimits?.ageLabel ?? null,
        createdAt: movie.createdAt,
        updatedAt: movie.updatedAt,
      })),
    };
  }

  // ------------------ FIND ONE ------------------
  async findOne(id: number) {
    const movieExist = await this.prisma.movies.findUnique({
      where: { movieId: id },
      include: {
        MovieGenres: true,
        AgeLimits: true,
      },
    });

    if (!movieExist || movieExist.isDeleted) throw new NotFoundException('Movie not found');

    return {
      id: movieExist.movieId,
      name: movieExist.movieName,
      description: movieExist.description,
      poster: movieExist.poster,
      trailer: movieExist.trailer,
      startDate: movieExist.startDate,
      endDate: movieExist.endDate,
      basePrice: movieExist.basePrice,
      isComing: movieExist.isComing,
      isShowing: movieExist.isShowing,
      isHot: movieExist.isHot,
      genre: movieExist.MovieGenres?.movieGenreName ?? null,
      ageLimit: movieExist.AgeLimits?.ageLabel ?? null,
      createdAt: movieExist.createdAt,
      updatedAt: movieExist.updatedAt,
    };
  }

  // ------------------ UPDATE ------------------
  async update(id: number, dto: UpdateMovieDto, file?: Express.Multer.File) {
    const movieExist = await this.prisma.movies.findUnique({ where: { movieId: id } });

    if (!movieExist || movieExist.isDeleted) throw new NotFoundException('Movie not found');

    if (dto.movieName) {
      const duplicate = await this.prisma.movies.findFirst({
        where: { movieName: dto.movieName, isDeleted: false, NOT: { movieId: id } },
      });
      if (duplicate) throw new BadRequestException('Movie name already exists!');
    }

    let newPosterId = movieExist.poster;
    let newPosterUrl: string | null = null;

    if (file) {
      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: 'movie/movie-posters' }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          })
          .end(file.buffer);
      });

      newPosterId = uploadResult.public_id;
      newPosterUrl = uploadResult.secure_url;

      if (movieExist.poster) {
        try {
          await cloudinary.uploader.destroy(movieExist.poster);
        } catch (e) {
          console.warn('Error deleting old poster:', e.message);
        }
      }
    }

    function toBool(v: any): boolean | undefined {
      if (v === undefined || v === null || v === '') return undefined;
      if (v === true || v === 'true' || v === 1 || v === '1') return true;
      if (v === false || v === 'false' || v === 0 || v === '0') return false;
      return undefined;
    }

    const isComing = toBool(dto.isComing);
    const isShowing = toBool(dto.isShowing);
    const isHot = toBool(dto.isHot);

    const updated = await this.prisma.movies.update({
      where: { movieId: id },
      data: {
        ...(dto.movieName ? { movieName: dto.movieName } : {}),
        ...(dto.description ? { description: dto.description } : {}),
        ...(file ? { poster: newPosterId } : {}),
        ...(dto.trailer ? { trailer: dto.trailer } : {}),
        ...(dto.startDate ? { startDate: dto.startDate } : {}),
        ...(dto.endDate ? { endDate: dto.endDate } : {}),
        ...(dto.basePrice ? { basePrice: dto.basePrice } : {}),
        ...(isComing !== undefined ? { isComing } : {}),
        ...(isShowing !== undefined ? { isShowing } : {}),
        ...(isHot !== undefined ? { isHot } : {}),
        ...(dto.movieGenreId ? { movieGenreId: dto.movieGenreId } : {}),
        ...(dto.ageLimitId ? { ageLimitId: dto.ageLimitId } : {}),
        updatedAt: new Date(),
      },
      include: {
        MovieGenres: { select: { movieGenreName: true } },
        AgeLimits: { select: { ageLabel: true } },
      },
    });

    console.log('RAW DTO booleans:', dto.isComing, dto.isShowing, dto.isHot,
      typeof dto.isComing, typeof dto.isShowing, typeof dto.isHot);

    return {
      id: updated.movieId,
      name: updated.movieName,
      poster: newPosterUrl ||
        (movieExist.poster
          ? `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/image/upload/${newPosterId}.png`
          : null),
      trailer: updated.trailer,
      startDate: updated.startDate,
      endDate: updated.endDate,
      basePrice: updated.basePrice,
      isComing: updated.isComing,
      isShowing: updated.isShowing,
      isHot: updated.isHot,
      genre: updated.MovieGenres?.movieGenreName ?? null,
      ageLimit: updated.AgeLimits?.ageLabel ?? null,
      updatedAt: updated.updatedAt,
    };
  }

  // ------------------ DELETE ------------------
  async delete(id: number) {
    const movieExist = await this.prisma.movies.findUnique({ where: { movieId: id } });

    if (!movieExist) throw new NotFoundException('Movie not found');

    if (movieExist.isDeleted) throw new BadRequestException('Movie already deleted');

    const deleted = await this.prisma.movies.update({
      where: { movieId: id },
      data: { isDeleted: true, deletedAt: new Date() },
      include: {
        MovieGenres: { select: { movieGenreName: true } },
        AgeLimits: { select: { ageLabel: true } },
      },
    });

    return {
      id: deleted.movieId,
      name: deleted.movieName,
      description: deleted.description,
      poster: deleted.poster,
      trailer: deleted.trailer,
      genre: deleted.MovieGenres?.movieGenreName ?? null,
      ageLimit: deleted.AgeLimits?.ageLabel ?? null,
      isDeleted: deleted.isDeleted,
      deletedAt: deleted.deletedAt,
    };
  }

  // ------------------ RESTORE ------------------
  async restore(id: number) {
    const movieExist = await this.prisma.movies.findUnique({ where: { movieId: id } });

    if (!movieExist) throw new NotFoundException('Movie not found');

    if (!movieExist.isDeleted) throw new BadRequestException('Movie is not deleted');

    const restored = await this.prisma.movies.update({
      where: { movieId: id },
      data: { isDeleted: false, deletedAt: null },
      include: {
        MovieGenres: { select: { movieGenreName: true } },
        AgeLimits: { select: { ageLabel: true } },
      },
    });

    return {
      id: restored.movieId,
      name: restored.movieName,
      description: restored.description,
      poster: restored.poster,
      trailer: restored.trailer,
      genre: restored.MovieGenres?.movieGenreName ?? null,
      ageLimit: restored.AgeLimits?.ageLabel ?? null,
      isDeleted: restored.isDeleted,
      deletedAt: restored.deletedAt,
    };
  }
}

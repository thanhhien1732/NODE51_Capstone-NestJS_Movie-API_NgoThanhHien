import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { CreateUserRatingDto } from './dto/create-user-rating.dto';
import { UpdateUserRatingDto } from './dto/update-user-rating.dto';
import { updateMovieAverageRating } from 'src/common/helpers/update-movie-average-rating';
import { $Enums } from 'generated/prisma';

@Injectable()
export class UserRatingService {
  constructor(private readonly prisma: PrismaService) { }

  // ---------------- CREATE ----------------
  async create(userId: number, dto: CreateUserRatingDto) {
    const movieId = Number(dto.movieId);

    const movieExist = await this.prisma.movies.findFirst({
      where: { movieId, isDeleted: false },
    });

    if (!movieExist) throw new NotFoundException('Movie not found!');

    const hasBooking = await this.prisma.bookings.findFirst({
      where: {
        userId,
        paymentStatus: $Enums.Bookings_paymentStatus.PAID,
        Showtimes: {
          movieId,
          OR: [
            { showDate: { lte: new Date() } },
            { Movies: { isShowing: true } },
          ],
        },
      },
      include: {
        Showtimes: {
          include: { Movies: true },
        },
      },
    });

    if (!hasBooking)
      throw new ForbiddenException(
        'You can only rate movies you have booked, paid for, and watched.',
      );

    const ratingExist = await this.prisma.userRatings.findFirst({
      where: { userId, movieId },
    });

    if (ratingExist)
      throw new BadRequestException('You have already rated this movie!');

    const newRating = await this.prisma.userRatings.create({
      data: {
        userId,
        movieId,
        rating: dto.rating,
        comment: dto.comment,
      },
      include: {
        Users: { select: { fullName: true } },
        Movies: { select: { movieName: true } },
      },
    });

    await updateMovieAverageRating(this.prisma, movieId);

    return {
      id: newRating.ratingId,
      userName: newRating.Users?.fullName,
      movieName: newRating.Movies?.movieName,
      rating: newRating.rating,
      comment: newRating.comment,
      createdAt: newRating.createdAt,
    };
  }

  // ---------------- FIND RATINGS BY MOVIE ----------------
  async findRatingsByMovie(movieId: number) {
    const movieExist = await this.prisma.movies.findUnique({
      where: { movieId, isDeleted: false },
    });
    if (!movieExist) throw new NotFoundException('Movie not found!');

    const ratingExist = await this.prisma.userRatings.findMany({
      where: { movieId },
      include: {
        Users: { select: { fullName: true } },
        Movies: { select: { movieName: true } },
      },
      orderBy: { ratingId: 'desc' },
    });

    return ratingExist.map((r) => ({
      id: r.ratingId,
      userName: r.Users?.fullName,
      movieName: r.Movies?.movieName,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
    }));
  }

  // ---------------- FIND MOVIES RATED BY USER ----------------
  async findMoviesRatedByUser(userId: number) {
    const ratingExist = await this.prisma.userRatings.findMany({
      where: { userId },
      include: {
        Users: { select: { fullName: true } },
        Movies: { select: { movieName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return ratingExist.map((r) => ({
      id: r.ratingId,
      userName: r.Users?.fullName,
      movieName: r.Movies?.movieName,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
    }));
  }

  // ---------------- UPDATE ----------------
  async update(ratingId: number, dto: UpdateUserRatingDto) {
    const ratingExist = await this.prisma.userRatings.findUnique({
      where: { ratingId },
    });
    if (!ratingExist) throw new NotFoundException('Rating not found!');

    const updated = await this.prisma.userRatings.update({
      where: { ratingId },
      data: {
        ...(dto.rating !== undefined ? { rating: dto.rating } : {}),
        ...(dto.comment !== undefined ? { comment: dto.comment } : {}),
        updatedAt: new Date(),
      },
      include: {
        Users: { select: { fullName: true } },
        Movies: { select: { movieName: true } },
      },
    });

    await updateMovieAverageRating(this.prisma, ratingExist.movieId);

    return {
      id: updated.ratingId,
      userName: updated.Users?.fullName,
      movieName: updated.Movies?.movieName,
      rating: updated.rating,
      comment: updated.comment,
      updatedAt: updated.updatedAt,
    };
  }

  // ---------------- DELETE ----------------
  async delete(ratingId: number) {
    const ratingExist = await this.prisma.userRatings.findUnique({
      where: { ratingId },
    });
    if (!ratingExist) throw new NotFoundException('Rating not found!');

    const movieId = ratingExist.movieId;

    const deleted = await this.prisma.userRatings.delete({
      where: { ratingId },
      include: {
        Users: { select: { fullName: true } },
        Movies: { select: { movieName: true } },
      },
    });

    await updateMovieAverageRating(this.prisma, movieId);

    return {
      id: deleted.ratingId,
      userName: deleted.Users?.fullName,
      movieName: deleted.Movies?.movieName,
      rating: deleted.rating,
      comment: deleted.comment,
    };
  }
}

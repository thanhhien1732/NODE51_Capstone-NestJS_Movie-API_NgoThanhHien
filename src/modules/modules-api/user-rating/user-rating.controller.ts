import { Controller, Post, Put, Delete, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRatingService } from './user-rating.service';
import { CreateUserRatingDto } from './dto/create-user-rating.dto';
import { UpdateUserRatingDto } from './dto/update-user-rating.dto';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';
import type { Users } from 'generated/prisma';
import { User } from 'src/common/decorators/user.decorator';

@ApiTags('User Rating')
@Controller('user-rating')
@ApiBearerAuth()
export class UserRatingController {
  constructor(private readonly service: UserRatingService) { }

  // ---------------- CREATE ----------------
  @Post()
  @ApiOperation({ summary: 'User rates a movie (1-10)' })
  @MessageResponse('Rating created successfully!')
  create(@User() user: Users, @Query() dto: CreateUserRatingDto) {
    return this.service.create(user.userId, dto);
  }

  // ---------------- FIND RATINGS BY MOVIE ----------------
  @Get('/movie/:movieId')
  @ApiOperation({ summary: 'Get all ratings of a movie' })
  @MessageResponse('Movie rating list retrieved successfully!')
  findRatingsByMovie(@Param('movieId', ParseIntPipe) movieId: number) {
    return this.service.findRatingsByMovie(movieId);
  }

  // ---------------- FIND MOVIES RATED BY USER ----------------
  @Get('/user/:userId')
  @ApiOperation({ summary: 'Get all movies a user has rated' })
  @MessageResponse('User rated movies retrieved successfully!')
  findMoviesRatedByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.service.findMoviesRatedByUser(userId);
  }

  // ---------------- UPDATE ----------------
  @Put(':id')
  @ApiOperation({ summary: 'Update a user rating' })
  @MessageResponse('Rating updated successfully!')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Query() dto: UpdateUserRatingDto,
  ) {
    return this.service.update(id, dto);
  }

  // ---------------- DELETE ----------------
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a rating' })
  @MessageResponse('Rating deleted successfully!')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}

import { Controller, Get, Post, Delete, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';
import { FindAllBookingDto } from './dto/find-all-booking.dto';
import { User } from 'src/common/decorators/user.decorator';
import type { Users } from 'generated/prisma';

@ApiTags('Booking')
@Controller('booking')
@ApiBearerAuth()
export class BookingController {
  constructor(private readonly service: BookingService) { }

  // ------------------ CREATE ------------------
  @Post()
  @ApiOperation({ summary: 'Create a new booking (seat reservation)' })
  @MessageResponse('Booking created successfully!')
  create(@User() user: Users, @Query() dto: CreateBookingDto) {
    return this.service.create(user.userId, dto);
  }

  // ------------------ FIND ALL ------------------
  @Get()
  @ApiOperation({ summary: 'Get all bookings (with filters and pagination)' })
  @MessageResponse('Booking list retrieved successfully!')
  findAll(@Query() query: FindAllBookingDto) {
    return this.service.findAll(query);
  }

  // ------------------ FIND ONE ------------------
  @Get(':id')
  @ApiOperation({ summary: 'Get booking detail by ID' })
  @MessageResponse('Booking retrieved successfully!')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // ------------------ CANCEL ------------------
  @Delete(':id')
  @ApiOperation({ summary: 'Cancel booking' })
  @MessageResponse('Booking canceled successfully!')
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.service.cancel(id);
  }
}

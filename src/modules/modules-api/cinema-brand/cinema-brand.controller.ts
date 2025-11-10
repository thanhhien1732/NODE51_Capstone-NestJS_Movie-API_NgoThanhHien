import { Body, Controller, Get, Param, Post, Put, Delete, Query, UseInterceptors, BadRequestException, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CinemaBrandService } from './cinema-brand.service';
import { CreateCinemaBrandDto } from './dto/create-cinema-brand.dto';
import { UpdateCinemaBrandDto } from './dto/update-cinema-brand.dto';
import { FindAllCinemaBrandDto } from './dto/find-all-cinema-brand.dto';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Cinema Brands')
@Controller('cinema-brands')
@ApiBearerAuth()
export class CinemaBrandController {
  constructor(private readonly service: CinemaBrandService) { }

  // ------------------ CREATE ------------------
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new cinema brand (with optional logo upload)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateCinemaBrandDto })
  @MessageResponse('New cinema brand created successfully!')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { files: 1 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          cb(new BadRequestException('Only image files are allowed!'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  create(@UploadedFile() file: Express.Multer.File, @Body() dto: CreateCinemaBrandDto) {
    return this.service.create(dto, file);
  }

  // ------------------ FIND ALL ------------------
  @Get()
  @ApiOperation({ summary: 'Find all cinema brands (with pagination)' })
  @MessageResponse('Cinema brand list retrieved successfully!')
  findAll(@Query() query: FindAllCinemaBrandDto) {
    return this.service.findAll(query);
  }

  // ------------------ FIND ONE ------------------
  @Get(':id')
  @ApiOperation({ summary: 'Find a cinema brand by ID' })
  @MessageResponse('Cinema brand retrieved successfully!')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  // ------------------ UPDATE ------------------
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update cinema brand (name or logo)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateCinemaBrandDto })
  @MessageResponse('Cinema brand updated successfully!')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { files: 1 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          cb(new BadRequestException('Only image files are allowed!'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  update(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @Body() dto: UpdateCinemaBrandDto) {
    return this.service.update(Number(id), dto, file);
  }

  // ------------------ DELETE ------------------
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a cinema brand' })
  @MessageResponse('Cinema brand deleted successfully!')
  delete(@Param('id') id: string) {
    return this.service.delete(Number(id));
  }

  // ------------------ RESTORE ------------------
  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore a deleted cinema brand' })
  @MessageResponse('Cinema brand restored successfully!')
  restore(@Param('id') id: string) {
    return this.service.restore(Number(id));
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { CreateCinemaBrandDto } from './dto/create-cinema-brand.dto';
import { UpdateCinemaBrandDto } from './dto/update-cinema-brand.dto';
import { FindAllCinemaBrandDto } from './dto/find-all-cinema-brand.dto';
import cloudinary from 'src/common/cloudinary/init.cloudinary';

@Injectable()
export class CinemaBrandService {
  constructor(private readonly prisma: PrismaService) { }

  // ------------------ CREATE ------------------
  async create(dto: CreateCinemaBrandDto, file?: Express.Multer.File) {
    const brandExist = await this.prisma.cinemaBrands.findFirst({
      where: { brandName: dto.brandName, isDeleted: false },
    });

    if (brandExist) throw new BadRequestException('Brand name already exists!');

    let logoId: string | null = null;
    let logoUrl: string | null = null;

    if (file) {
      const buffer = file.buffer;

      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: 'movie/cinema-logos' }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          })
          .end(buffer);
      });

      logoId = uploadResult.public_id;
      logoUrl = uploadResult.secure_url;
    }

    const newBrand = await this.prisma.cinemaBrands.create({
      data: {
        brandName: dto.brandName,
        multiplier: dto.multiplier,
        logo: logoId,
      },
    });

    return {
      id: newBrand.brandId,
      name: newBrand.brandName,
      logo: logoUrl,
      multiplier: newBrand.multiplier,
      createdAt: newBrand.createdAt,
    };
  }

  // ------------------ FIND ALL ------------------
  async findAll(query: FindAllCinemaBrandDto) {
    const { page, pageSize, keyword } = query;

    const where = {
      isDeleted: false,
      ...(keyword ? { brandName: { contains: keyword } } : {}),
    };

    const hasPagination = page && pageSize;
    const skip = hasPagination ? (Number(page) - 1) * Number(pageSize) : undefined;
    const take = hasPagination ? Number(pageSize) : undefined;

    const [items, totalItem] = await Promise.all([
      this.prisma.cinemaBrands.findMany({
        where,
        skip,
        take,
        orderBy: { brandId: 'desc' },
      }),
      this.prisma.cinemaBrands.count({ where }),
    ]);

    return {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || totalItem,
      totalItem,
      totalPage: hasPagination ? Math.ceil(totalItem / Number(pageSize)) : 1,
      keyword: keyword || null,
      items: items.map(i => ({
        id: i.brandId,
        name: i.brandName,
        logo: i.logo,
        multiplier: i.multiplier,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
      })),
    };
  }

  // ------------------ FIND ONE ------------------
  async findOne(id: number) {
    const brandExist = await this.prisma.cinemaBrands.findUnique({
      where: { brandId: id },
    });

    if (!brandExist || brandExist.isDeleted)
      throw new NotFoundException('Cinema Brand not found');

    return {
      id: brandExist.brandId,
      name: brandExist.brandName,
      logo: brandExist.logo,
      multiplier: brandExist.multiplier,
      createdAt: brandExist.createdAt,
      updatedAt: brandExist.updatedAt,
    }
  }

  // ------------------ UPDATE ------------------
  async update(id: number, dto: UpdateCinemaBrandDto, file?: Express.Multer.File) {
    const brandExist = await this.prisma.cinemaBrands.findUnique({ where: { brandId: id } });

    if (!brandExist || brandExist.isDeleted) throw new NotFoundException('Cinema brand not found');

    if (dto.brandName) {
      const duplicate = await this.prisma.cinemaBrands.findFirst({
        where: {
          brandName: dto.brandName,
          isDeleted: false,
          NOT: { brandId: id },
        },
      });

      if (duplicate)
        throw new BadRequestException('A cinema brand with this name already exists!');
    }

    let newLogoId = brandExist.logo;
    let newLogoUrl = null;

    if (file) {
      const buffer = file.buffer;

      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: 'movie/cinema-logos' }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          })
          .end(buffer);
      });

      newLogoId = uploadResult.public_id;
      newLogoUrl = uploadResult.secure_url;

      if (brandExist.logo) {
        try {
          await cloudinary.uploader.destroy(brandExist.logo);
        } catch (e) {
          console.warn('Error deleting old logo:', e.message);
        }
      }
    }

    const updatedBrand = await this.prisma.cinemaBrands.update({
      where: { brandId: id },
      data: {
        ...(dto.brandName ? { brandName: dto.brandName } : {}),
        ...(file ? { logo: newLogoId } : {}),
        updatedAt: new Date(),
      },
    });

    return {
      id: updatedBrand.brandId,
      name: updatedBrand.brandName,
      logo: newLogoUrl || (brandExist.logo ? `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/image/upload/${newLogoId}.png` : null),
      multiplier: updatedBrand.multiplier,
      updatedAt: updatedBrand.updatedAt,
    };
  }

  // ------------------ DELETE ------------------
  async delete(id: number) {
    const brandExist = await this.prisma.cinemaBrands.findUnique({ where: { brandId: id } });

    if (!brandExist) throw new NotFoundException('Cinema brand not found');

    if (brandExist.isDeleted) throw new BadRequestException('This brand has already been deleted');

    const deleted = await this.prisma.cinemaBrands.update({
      where: { brandId: id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      }
    });

    return {
      id: deleted.brandId,
      name: deleted.brandName,
      logo: deleted.logo,
      multiplier: deleted.multiplier,
      isDeleted: deleted.isDeleted,
      deletedAt: deleted.deletedAt,
    }
  }

  // ------------------ RESTORE ------------------
  async restore(id: number) {
    const brand = await this.prisma.cinemaBrands.findUnique({
      where: { brandId: id },
    });

    if (!brand) throw new NotFoundException('Cinema Brand not found');

    if (!brand.isDeleted) throw new NotFoundException('Brand is not deleted');

    const restored = await this.prisma.cinemaBrands.update({
      where: { brandId: id },
      data: { isDeleted: false, deletedAt: null },
    });

    return {
      id: restored.brandId,
      name: restored.brandName,
      logo: restored.logo,
      multiplier: restored.multiplier,
      isDeleted: restored.isDeleted,
      deletedAt: restored.deletedAt,
    }
  }
}

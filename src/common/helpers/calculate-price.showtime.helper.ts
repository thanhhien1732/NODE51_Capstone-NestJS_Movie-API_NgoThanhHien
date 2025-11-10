import { BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/modules/modules-system/prisma/prisma.service";

// ------------------ Helper: Calculate Base Price ------------------
export async function calculateBasePrice(
    prisma: PrismaService,
    movieId: number,
    cinemaId: number,
    roomId: number,
    formatId: number,
): Promise<number> {
    const movie = await prisma.movies.findUnique({ where: { movieId } });
    const cinema = await prisma.cinemas.findUnique({
        where: { cinemaId },
        include: {
            CinemaBrands: true,
            CinemaAreas: true,
        },
    });

    const room = await prisma.rooms.findUnique({
        where: { roomId },
        include: {
            ScreenTechs: true,
            SoundSystems: true,
        },
    });

    if (!movie || !cinema || !room) {
        throw new BadRequestException('Invalid movie, cinema, or room ID');
    }

    const brandMultiplier = Number(cinema.CinemaBrands?.multiplier ?? 1);
    const areaAddition = Number(cinema.CinemaAreas?.priceAddition ?? 0);
    const screenMultiplier = Number(room.ScreenTechs?.multiplier ?? 1);
    const soundMultiplier = Number(room.SoundSystems?.multiplier ?? 1);
    const movieBase = Number(movie.basePrice ?? 0);

    return Math.round(
        movieBase * brandMultiplier * screenMultiplier * soundMultiplier + areaAddition,
    );
}
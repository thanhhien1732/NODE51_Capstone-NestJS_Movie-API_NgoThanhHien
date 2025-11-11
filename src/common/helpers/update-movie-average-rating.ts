import { PrismaService } from "src/modules/modules-system/prisma/prisma.service";

export async function updateMovieAverageRating(prisma: PrismaService, movieId: number) {
    const result = await prisma.userRatings.aggregate({
        where: { movieId },
        _avg: { rating: true },
    });

    const avg = result._avg.rating ?? 0;
    const rounded = Math.round(avg * 10) / 10;

    await prisma.movies.update({
        where: { movieId },
        data: { rating: rounded },
    });
}

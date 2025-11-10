import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/modules-system/prisma/prisma.module';
import { TokenModule } from './modules/modules-system/token/token.module';
import { ProtectStrategy } from './common/guard/protect/protect.strategy';
import { PermissionStrategy } from './common/guard/permission/permission.strategy';
import { AuthModule } from './modules/modules-api/auth/auth.module';
import { UserModule } from './modules/modules-api/user/user.module';
import { RoleModule } from './modules/modules-api/role/role.module';
import { PermissionModule } from './modules/modules-api/permission/permission.module';
import { CinemaModule } from './modules/modules-api/cinema/cinema.module';
import { CinemaBrandModule } from './modules/modules-api/cinema-brand/cinema-brand.module';
import { CinemaAreaModule } from './modules/modules-api/cinema-area/cinema-area.module';
import { RoomsModule } from './modules/modules-api/room/room.module';
import { ScreenTechModule } from './modules/modules-api/room-screen/room-screen.module';
import { SoundSystemModule } from './modules/modules-api/room-sound/room-sound.module';
import { SeatModule } from './modules/modules-api/seat/seat.module';
import { SeatTypeModule } from './modules/modules-api/seat-type/seat-type.module';
import { MovieModule } from './modules/modules-api/movie/movie.module';
import { MoveFormatModule } from './modules/modules-api/moive-format/movie-format.module';
import { MovieGenreModule } from './modules/modules-api/movie-genre/movie-genre.module';
import { AgeLimitModule } from './modules/modules-api/movie-age-limit/movie-age-limit.module';
import { ShowtimeModule } from './modules/modules-api/showtime/showtime.module';
import { BookingModule } from './modules/modules-api/booking/booking.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PaymentModule } from './modules/modules-api/booking-payment/booking-payment.module';
import { BookingExpirationJob } from './common/jobs/booking-expiration.job';

@Module({
  imports: [PrismaModule, TokenModule, AuthModule, UserModule, RoleModule, PermissionModule, CinemaModule, CinemaBrandModule, CinemaAreaModule, RoomsModule, ScreenTechModule, SoundSystemModule, SeatTypeModule, SeatModule, MovieModule, MoveFormatModule, MovieGenreModule, AgeLimitModule, ShowtimeModule, BookingModule, ScheduleModule.forRoot(), PaymentModule],
  controllers: [AppController],
  providers: [AppService, ProtectStrategy, PermissionStrategy, BookingExpirationJob],
})
export class AppModule { }

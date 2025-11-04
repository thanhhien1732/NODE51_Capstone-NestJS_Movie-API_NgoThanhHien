import { ApiProperty } from '@nestjs/swagger';

export class UploadAvatarDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Avatar file to upload',
    })
    file: any;
}

import { Response } from 'express';
import { diskStorage } from 'multer';
import { ApiTags } from '@nestjs/swagger';

import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Get, Param, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';

import { FilesService } from './files.service';
import { fileNamer, fileFilter } from './helpers';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,  
  ) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ){
    
    const path = this.filesService.getStaticProductImage( imageName );

    return res.sendFile( path );

  }

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits: { fileSize: 1000000 }, // 1MB
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer,
    }),
  }))
  uploadProductImage(
    @UploadedFile() file: Express.Multer.File,
  ) {

    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }

    const secureUrl = `${ this.configService.get('HOST_API') }/files/product/${ file.filename }`;

    return {
      secureUrl
    };
  }
  
}

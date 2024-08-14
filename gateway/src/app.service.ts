import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { extname, join, resolve } from 'path';
@Injectable()
export class AppService {
  uploadSingleFile(file: Express.Multer.File) {
    try {
      const fileName =
        randomUUID() + `${extname(file.originalname).toLowerCase()}`;
      const filePath = resolve(process.cwd(), 'public');
      if (!existsSync(filePath)) {
        mkdirSync(filePath, { recursive: true });
      }
      writeFileSync(join(filePath, fileName), file.buffer);
      return {
        url: fileName,
        size: file.size,
        type: file.mimetype,
      };
    } catch (err) {}
  }
}

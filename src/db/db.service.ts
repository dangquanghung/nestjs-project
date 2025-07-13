import { Inject, Injectable } from '@nestjs/common';
import { writeFile, access, readFile } from 'fs/promises';
import { DbModuleOptions } from './db.module';

@Injectable()
export class DbService {
    @Inject('OPTIONS')
    private options: DbModuleOptions;


    async read() {


        try {
            const filePath = this.options.path;
            console.log("filePath", filePath);
            await access(filePath)

            const data = await readFile(filePath, {
                encoding: 'utf-8'
            })
            const parsed = JSON.parse(data);
            return Array.isArray(parsed) ? parsed : [];


        } catch (error) {
            return [];
        }   
    }

    async write(obj: Record<string, any>) {
        await writeFile(this.options.path, JSON.stringify(obj || []), {
            encoding: 'utf-8',
        })
    }
}
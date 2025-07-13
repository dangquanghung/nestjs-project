import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, UploadedFiles, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { storage } from './oss';
import * as path from 'path';
import * as fs from 'fs'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }


  // merge file
  @Get('merge/file')
  mergeFile(@Query("file") fileName: string) {
    const nameDir = 'uploads/' + fileName

    //read
    const files = fs.readdirSync(nameDir)

    let startPos = 0, countFile = 0
    files.map(file => {
      //get path full
      const filePath = nameDir + '/' + file
      console.log("filePath | ", filePath)

      const streamFile = fs.createReadStream(filePath)
      streamFile.pipe(fs.createWriteStream('uploads/merge/' + fileName, {
        start: startPos
      })).on('finish', () => {
        countFile++
        console.log('countFile |', countFile)
        if (files.length === countFile) {

          fs.rm(nameDir, {
            recursive: true
          }, () => { })
        }
      })

      startPos += fs.statSync(filePath).size
    })
  }


  @Post('upload/large-file')
  @UseInterceptors(FilesInterceptor('files', 20, {
    dest: 'uploads',
  }))
  uploadLargeFile(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body: { name: string }) {
    console.log('upload file body |', body)
    console.log('upload files |', files)
    // get file

    const fileName = body.name.match(/(.+)-\d+$/)?.[1] ?? body.name
    const nameDir = 'uploads/chunks-' + fileName

    // mkdir
    if (!fs.existsSync(nameDir)) {
      fs.mkdirSync(nameDir)
    }

    // parse file
    fs.cpSync(files[0].path, nameDir + '/' + body.name)

    // remove redundant
    fs.rmSync(files[0].path)

  }


  // upload ava (file size, extense name...)
  @Post('upload/avt')
  @UseInterceptors(FileInterceptor('file', {
    dest: 'uploads/avatar',
    storage: storage,
    limits: {
      fieldNameSize: 1024 * 1024 * 3
    },
    fileFilter(req, file, cb) {
      // extName
      const extName = path.extname(file.originalname)
      if (['.jpg', '.png', '.gif'].includes(extName)) {
        cb(null, true)
      } else {
        cb(new BadRequestException('Upload file error'), false)
      }
    }
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('upload file =>>>>>', file.path)
    return file.path
  }


  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    console.log("login user", loginUserDto);
    return this.userService.login(loginUserDto);
  }

  @Post('new')
  register(@Body() registerUserDto: RegisterUserDto) {
    console.log("register user", registerUserDto);
    return this.userService.register(registerUserDto);
  }
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}

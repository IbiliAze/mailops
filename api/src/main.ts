////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import cookieParser from 'cookie-parser'
//////////////////////////////////////////////////////////////////////////////////?MODULES
import { AppModule } from './app.module'
////////////////////////////////////////////////////////////////////////////////////////??

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')
  app.use(cookieParser())

  app.enableCors({
    origin: [process.env.WEB_URL, 'http://localhost:3000'].filter((o): o is string => !!o),
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )

  await app.listen(process.env.PORT ?? 5020)
}
bootstrap()

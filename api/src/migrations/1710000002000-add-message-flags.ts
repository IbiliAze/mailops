import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddMessageFlags1710000002000 implements MigrationInterface {
  name = 'AddMessageFlags1710000002000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "messages" ADD "seen" boolean NOT NULL DEFAULT false`)
    await queryRunner.query(`ALTER TABLE "messages" ADD "answered" boolean NOT NULL DEFAULT false`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "answered"`)
    await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "seen"`)
  }
}

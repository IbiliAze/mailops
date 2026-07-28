import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddMessageClassification1710000001000 implements MigrationInterface {
  name = 'AddMessageClassification1710000001000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "messages" ADD "priority" varchar(16) NULL`)
    await queryRunner.query(`ALTER TABLE "messages" ADD "topic" varchar(32) NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "topic"`)
    await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "priority"`)
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm'

export class SingleSummary1710000003000 implements MigrationInterface {
  name = 'SingleSummary1710000003000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "summaries"`)

    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_summaries_dateKey"`)
    await queryRunner.query(`ALTER TABLE "summaries" DROP COLUMN "dateKey"`)
    await queryRunner.query(`ALTER TABLE "summaries" DROP COLUMN "content"`)

    await queryRunner.query(`ALTER TABLE "summaries" ADD "overview" text NOT NULL DEFAULT ''`)
    await queryRunner.query(`ALTER TABLE "summaries" ADD "keyFindings" json NOT NULL DEFAULT '[]'`)
    await queryRunner.query(`ALTER TABLE "summaries" ADD "recommendedActions" json NOT NULL DEFAULT '[]'`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "summaries"`)

    await queryRunner.query(`ALTER TABLE "summaries" DROP COLUMN "recommendedActions"`)
    await queryRunner.query(`ALTER TABLE "summaries" DROP COLUMN "keyFindings"`)
    await queryRunner.query(`ALTER TABLE "summaries" DROP COLUMN "overview"`)

    await queryRunner.query(`ALTER TABLE "summaries" ADD "dateKey" varchar(10) NOT NULL DEFAULT ''`)
    await queryRunner.query(`ALTER TABLE "summaries" ADD "content" text NOT NULL DEFAULT ''`)
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_summaries_dateKey" ON "summaries" ("dateKey")`)
  }
}

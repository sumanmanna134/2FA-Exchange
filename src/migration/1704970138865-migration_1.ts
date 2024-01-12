import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration11704970138865 implements MigrationInterface {
    name = 'Migration11704970138865'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_info" RENAME COLUMN "modified_photo_url" TO "modified_photo"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_info" RENAME COLUMN "modified_photo" TO "modified_photo_url"`);
    }

}

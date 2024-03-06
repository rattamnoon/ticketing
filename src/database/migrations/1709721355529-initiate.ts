import { MigrationInterface, QueryRunner } from "typeorm";

export class Initiate1709721355529 implements MigrationInterface {
    name = 'Initiate1709721355529'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`event\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`date\` datetime NULL, \`totalSeats\` int NOT NULL, \`status\` enum ('open', 'close') NOT NULL DEFAULT 'open', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`seat\` (\`id\` varchar(36) NOT NULL, \`eventId\` varchar(255) NOT NULL, \`zone\` varchar(255) NULL, \`row\` varchar(255) NOT NULL, \`seatNumber\` int NOT NULL, \`status\` enum ('available', 'reserved') NOT NULL DEFAULT 'available', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`firstname\` varchar(255) NULL, \`lastname\` varchar(255) NULL, \`password\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`reservation\` (\`id\` varchar(36) NOT NULL, \`status\` enum ('booking', 'confirmed', 'canceled') NOT NULL DEFAULT 'booking', \`userId\` varchar(255) NOT NULL, \`seatId\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`seat\` ADD CONSTRAINT \`FK_6f9180da82fbdeb46141993f679\` FOREIGN KEY (\`eventId\`) REFERENCES \`event\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reservation\` ADD CONSTRAINT \`FK_529dceb01ef681127fef04d755d\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reservation\` ADD CONSTRAINT \`FK_70ef2f828ce6c1caa4646cf4801\` FOREIGN KEY (\`seatId\`) REFERENCES \`seat\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reservation\` DROP FOREIGN KEY \`FK_70ef2f828ce6c1caa4646cf4801\``);
        await queryRunner.query(`ALTER TABLE \`reservation\` DROP FOREIGN KEY \`FK_529dceb01ef681127fef04d755d\``);
        await queryRunner.query(`ALTER TABLE \`seat\` DROP FOREIGN KEY \`FK_6f9180da82fbdeb46141993f679\``);
        await queryRunner.query(`DROP TABLE \`reservation\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`seat\``);
        await queryRunner.query(`DROP TABLE \`event\``);
    }

}

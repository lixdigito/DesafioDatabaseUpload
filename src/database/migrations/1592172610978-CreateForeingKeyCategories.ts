import {MigrationInterface, QueryRunner, TableForeignKey} from "typeorm";

export class CreateForeingKeyCategories1592172610978 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        queryRunner.createForeignKey('transactions', new TableForeignKey({
            name: 'transactionCategory',
            columnNames: ['category_id'],
            referencedTableName: 'categories',
            referencedColumnNames: ['id'],
            onDelete: 'set NULL',
            onUpdate: 'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        queryRunner.dropForeignKey('transactions','transactionCategory');
    }

}
import { Entity, Column, Unique } from 'typeorm';
import { Model } from './Model';
import { IsUUID } from 'class-validator';

@Entity()
@Unique(['id'])
export class User extends Model {
    constructor(id: string, cash: number) {
        super();
        this.id = id;
        this.cash = cash;
    }

    @Column({ type: 'mediumint' })
    cash!: number;

    @IsUUID()
    @Column({ type: 'varchar', length: '50' })
    id!: string;
}

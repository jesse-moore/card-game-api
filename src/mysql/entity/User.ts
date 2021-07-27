import { Entity, Column, Unique, OneToMany } from 'typeorm';
import { Model } from './Model';
import { IsEmail, IsUUID } from 'class-validator';

@Entity()
@Unique(['id', 'email'])
export class User extends Model {
    constructor(email: string, id: string) {
        super();
        this.email = email;
        this.id = id;
    }

    @IsEmail()
    @Column({ type: 'varchar', length: '50' })
    email!: string;

    @IsUUID()
    @Column({ type: 'varchar', length: '50' })
    id!: string;
}

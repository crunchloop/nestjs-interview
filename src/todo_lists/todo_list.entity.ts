import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TodoList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}

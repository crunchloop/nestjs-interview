import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TodoList } from './todo_list.entity';

@Entity()
export class TodoItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  complete: boolean;

  @Column()
  todoListId: number;

  @ManyToOne(() => TodoList, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'todoListId' })
  todoList?: TodoList;
}

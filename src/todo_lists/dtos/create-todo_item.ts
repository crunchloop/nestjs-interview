import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoItemDto {
  @ApiProperty({
    description: 'The name of the todo item',
    example: 'Buy groceries',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Optional description of the todo item',
    example: 'Milk, bread, and eggs',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}

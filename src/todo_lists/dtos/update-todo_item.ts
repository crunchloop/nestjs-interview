import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTodoItemDto {
  @ApiProperty({ 
    description: 'The name of the todo item',
    example: 'Buy groceries',
    required: false
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ 
    description: 'Description of the todo item',
    example: 'Milk, bread, and eggs',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    description: 'Whether the todo item is completed',
    example: true,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  complete?: boolean;
}

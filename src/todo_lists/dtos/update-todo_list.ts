import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTodoListDto {
  @ApiProperty({ 
    description: 'The name of the todo list',
    example: 'Updated Shopping List',
    required: false
  })
  @IsString()
  @IsOptional()
  name?: string;
}

import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoListDto {
  @ApiProperty({
    description: 'The name of the todo list',
    example: 'Shopping List',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

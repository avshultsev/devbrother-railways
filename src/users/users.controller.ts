import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ChangeRoleDto } from './dto/change-role.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/:id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getById(id);
  }

  @Patch('/:id')
  updateUserRole(@Param('id') id: string, @Body() payload: ChangeRoleDto) {
    return this.usersService.changeRole(id, payload);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}

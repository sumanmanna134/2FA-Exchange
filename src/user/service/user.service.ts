import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfoRepository } from '../repository/user-info.repository';
import { User } from '../../auth/entity/user.entity';
import { UserInfo } from '../entity/user-info.entity';
import { UserInfoDto } from '../dto/user-info.dto';
import { UserInfoData } from '../interface/user-info.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserInfoRepository)
    private userInfoRepository: UserInfoRepository,
  ) {}

  async getUser(user: User): Promise<UserInfo> {
    const userInfo = await this.userInfoRepository.findOne({
      where: { id: user.user_info.id },
    });
    if (!userInfo) {
      throw new NotFoundException('User not found.');
    }
    return userInfo;
  }

  async updateUserProfile(
    user: User,
    userInfoDto: UserInfoDto,
  ): Promise<UserInfoData> {
    const userInfo = await this.getUser(user);
    const { address, petName, photo, modified_photo } = userInfoDto;
    if (address) userInfo.address = address;
    if (petName) userInfo.petName = petName;
    if (photo) userInfoDto.photo = photo;
    if (modified_photo) userInfo.modified_photo = modified_photo;
    await userInfo.save();
    return userInfo;
  }
}

import { Request, Response } from 'express';

import AppError from '../../../errors/AppError';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import BCryptHashProvider from '../providers/hashProvider/implementations/BCryptHashProvider';
import UserRepository from '../repositories/UserRepository';

export default class UserController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password }: ICreateUserDTO = request.body;

    const bcryptHashProvider = new BCryptHashProvider();
    const userRepository = new UserRepository();

    const passwordHashed = await bcryptHashProvider.generateHash(password);

    const userExist = await userRepository.findUserByEmail(email);

    if (userExist) {
      throw new AppError('User already registered.');
    }

    const user = await userRepository.create({
      name,
      email,
      password: passwordHashed,
    });

    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return response.json(userWithoutPassword);
  }
}

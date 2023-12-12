import { NextFunction, Request, Response } from "express"
import bcrypt from "bcryptjs"

import UsersRepo from "../models/User"
import UsersService from "../services/usersService"
import { ApiError } from "../errors/ApiError"
import { AuthRequest, LoginRequest } from "../types/auth"
import { TokenPayload } from "../types/auth"

async function getAllUsers(_: Request, res: Response, next: NextFunction) {
  const users = await UsersService.getAllUsers();
  if (!users) {
    next(ApiError.resourceNotFound("No collection"));
    return;
  }
  res.json({ users });
}

async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.params.userId;
  const data = await UsersService.getUserById(userId);
  if (!data) {
    next(ApiError.resourceNotFound("User not found"));
    return;
  }
  res.json(data);
}

async function getUserByToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
){
  const userId = req.decodedUser?.id;
  const user = userId && await UsersService.getUserById(userId);
  if (!user) {
    next(ApiError.resourceNotFound("Sign up or log in to use the system"));
    return;
  }
  const data = {_id: userId, ...user}
  res.json(data);
}

async function createUser(req: Request, res: Response, next: NextFunction) {
  const newUser = req.body;
  const isUser = await UsersRepo.findOne({ email: newUser.email});
  if (isUser) {
    next(ApiError.forbidden("This email address is already in the system"));
    return;
  }
  const user = await UsersService.createUser(newUser);
  if (!user) {
    next(ApiError.internal("User could not be created"));
    return;
  }
  const payload: TokenPayload = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: !user.role ? "CUSTOMER" : user.role,
    avatar: !user.avatar ? "https://api.lorem.space/image/face?w=640&h=480&r=867" : user.avatar
  }
  const token = await UsersService.getToken(payload);
  res.status(201).json(token)
}


async function login(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const loginRequest: LoginRequest = req.body;
  const user = await UsersRepo.findOne({ email: loginRequest.email });

  if (!user) {
    next(ApiError.resourceNotFound("Not in the system, please signup first"));
    return;
  }
  const isValid = await bcrypt.compare(loginRequest.password, user.password as string);
  
  if (!isValid) {
    next(ApiError.unauthorized("Invalid password"));
    return;
  }
  const payload: TokenPayload = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
  }
  const token = await UsersService.getToken(payload);
  
  if (!token) {
    next(ApiError.internal("Token service failed"));
    return;
  }
  res.status(200).json(token);
}

async function googleLogin(
  req: any,
  res: Response,
  next: NextFunction
) {
  const user = req.user

  if (user) {
    const payload: TokenPayload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    }

    const token = await UsersService.getToken(payload);
    
    if (!token) {
      next(ApiError.forbidden("Invalid credentials"));
      return;
    }

    res.status(200).json({
      token,
    })
  }
}

async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
  ) {
    const id = req.params.userId;
    const userData = req.body;
    const user = await UsersService.getUserById(id);
    if (!user) {
      next(ApiError.resourceNotFound("User not found"));
      return;
    }
    const data = await UsersService.updateUser(id, userData);
    res.status(200).json(data);
}

async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
  ) {
    const id = req.params.userId;
    const user = await UsersService.getUserById(id);
    if (user === null) {
      next(ApiError.resourceNotFound("User that you are trying to delete does not exist")); 
      return;
    }
    await UsersService.deleteUser(id);
    const deletedUser = await UsersService.getUserById(id);
    if (deletedUser !== null) {
      next(ApiError.internal("Deleting failed")); 
      return;
    }
    res.status(204).json({msg: "User was deleted successfuly"});
}

export default {
  getAllUsers,
  getUserById,
  getUserByToken,
  login,
  createUser,
  updateUser,
  deleteUser,
  googleLogin
}


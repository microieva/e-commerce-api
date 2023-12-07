import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import UsersRepo from "../models/User"
import { TokenPayload } from "../types/auth"
import { User } from "../types/user"

async function getAllUsers() {
  const users = await UsersRepo.find().exec();
  return users;
}

async function getUserById(userId: string) {
  const id = new mongoose.Types.ObjectId(userId);
  const user = await UsersRepo.findById(id);
  
  const data = user && {
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar
  }
  return data;
}

async function createUser(user: User) {
  const hashedPsw = await bcrypt.hash(user.password, 10);
  const newUser = new UsersRepo(user);
  newUser.password = hashedPsw;

  return await newUser.save();
}

async function getToken(payload: TokenPayload) {
  const token = jwt.sign(payload, process.env.TOKEN_SECRET as string)
  return token;
}

async function updateUser(userId: string, updatedUser: Partial<User>) {
  const id = new mongoose.Types.ObjectId(userId);
  const result = await UsersRepo.updateOne({ _id: id }, { $set: updatedUser });

  if (!result) {
    return null;
  }
  return await UsersRepo.findById(id);
}

async function deleteUser(userId: string){
  const id = new mongoose.Types.ObjectId(userId);
  return await UsersRepo.findByIdAndDelete(id);
}

export default {
  getAllUsers,
  getUserById,
  getToken,
  createUser,
  updateUser,
  deleteUser
}

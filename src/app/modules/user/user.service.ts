import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// create admin into DB
const createAdminIntoDB = async (data: any) => {
  // hash password
  const hashedPassword: string = await bcrypt.hash(data?.password, 12);

  const userData = {
    email: data?.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const createUser = prisma.user.create({
    data: userData,
  });
  const createAdmin = prisma.admin.create({
    data: data?.admin,
  });

  // batch transaction
  const [createdUserData, createdAdminData] = await prisma.$transaction([
    createUser,
    createAdmin,
  ]);
  // console.log(createdAdminData);

  return createdAdminData;
};


// get all admins from DB
const getAllAdmins = async () =>{
  const result = await prisma.admin.findMany();
  return result;
}

export const userServices = {
  createAdminIntoDB,
  getAllAdmins
};

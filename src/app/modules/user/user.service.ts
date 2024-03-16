import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

const createAdminIntoDB = async (data: any) => {
  const userData = {
    email: data?.admin.email,
    password: data?.password,
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

export const userServices = {
  createAdminIntoDB,
};

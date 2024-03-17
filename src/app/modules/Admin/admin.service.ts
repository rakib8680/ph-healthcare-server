import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// get all admins from DB
const getAllAdmins = async () => {
  const result = await prisma.admin.findMany();
  return result;
};

export const adminServices = {
  getAllAdmins,
};

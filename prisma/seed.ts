import { UserRole } from "@prisma/client";
import prisma from "../src/shared/prisma";

const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await prisma.user.findFirst({
      where: {
        role: UserRole.SUPER_ADMIN,
      },
    });

    if (isSuperAdminExist) {
      console.log("Super Admin already exists");
      return;
    }

    const createSuperAdmin = await prisma.user.create({
      data: {
        email: "super@admin.com",
        password: "1234",
        role: UserRole.SUPER_ADMIN,
        admin: {
          create: {
            name: "Super Admin",
            contactNumber: "1234567890",
          },
        },
      },
    });

    console.log("Super Admin created successfully", createSuperAdmin);
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
};

seedSuperAdmin();

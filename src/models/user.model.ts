import { prisma } from "@/config/database";
import { hashPassword } from "@/utils/crypto";
import { SignUpInput } from "@/utils/validations/user";

/** Model — database access for User table only. */
export const UserModel = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  create(data: SignUpInput) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashPassword(data.password),
      },
    });
  },
};

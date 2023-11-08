import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const db = {
  users: {
    async create(data: Prisma.UserCreateInput) {
      // encrypting password
      data.password = await db.encryption.encrypt(data.password);

      // adding & returning new user
      return prisma.user.create({ data });
    },

    // READ
    get(where: Prisma.UserWhereInput) {
      return prisma.user.findFirst({
        where,
      });
    },

    getMany(args: Prisma.UserFindManyArgs) {
      return prisma.user.findMany(args);
    },

    // UPDATE
    update(args: Prisma.UserUpdateArgs) {
      return prisma.user.update(args);
    },

    // DELETE
    delete(emailorUsername: string) {
      return prisma.user.delete({
        where: {
          email: emailorUsername,
          username: emailorUsername,
        },
      });
    },
  },

  encryption: {
    encrypt(value: string) {
      return bcrypt.hash(value, 10);
    },

    compare(value1: string, value2: string) {
      return bcrypt.compare(value1, value2);
    },
  },
};

export default db;

import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import isEmail from 'validator/lib/isEmail';
import isEmpty from 'validator/lib/isEmpty';

const prisma = new PrismaClient();

const db = {
  users: {
    async create(data: Prisma.UserCreateInput) {
      // Checking empty values
      if (
        [data.email, data.password, data.username].some(
          (value) => value === undefined || isEmpty(value)
        )
      ) {
        throw new Error(
          'email, password and/or username cannot be empty/undefined'
        );
      }

      // checking email
      if (!isEmail(data.email)) {
        throw new InvalidEmailError();
      }

      // checking password
      if (data.password.length < 12) {
        throw new Error('Password has to have atleast 12 characters');
      }

      if (!/[a-z]/.test(data.password) || !/[A-Z]/.test(data.password)) {
        throw new Error(
          'Password has to include atleast 1 smaller case character & 1 upper case character'
        );
      }

      if (!/[0-9]/.test(data.password)) {
        throw new Error('Password has to include atleast 1 number');
      }

      if (!/[!@#$%^&*(),.?":{}|<>]/.test(data.password)) {
        throw new Error('Password needs atleast 1 special character');
      }

      // checking if email/username already exists
      let user = await prisma.user.findFirst({
        where: { email: data.email },
      });
      console.log(user);
      if (user !== null) {
        throw new Error('Email already exists');
      }

      user = await prisma.user.findFirst({
        where: { username: data.username },
      });
      if (user !== null) {
        throw new Error('Username already exists');
      }

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

// errors
class InvalidEmailError extends Error {
  static Message = 'Email is invalid';

  constructor() {
    super(InvalidEmailError.Message);
  }
}

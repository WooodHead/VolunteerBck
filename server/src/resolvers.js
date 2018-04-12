import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validateEmail, validatePassword } from './helpers';

export const Resolvers = {
  Query: {
    currentUser: async (_, {args}, { mongo, user} ) => {
      const Users = mongo.collection('users');
      const currentUser = await Users.findOne({ _id: new ObjectId(user) });
      console.log('User ' + currentUser.email + ' requested user info');
      return currentUser;
    },
    ngosByName: async (_, { name }, { mongo }) => {
      const Ngos = mongo.collection('ngos');
      const ngosByName = await Ngos.findOne({ name });
      console.log('Ngo data Sent');
      return ngosByName;
    }
  },
  Mutation: {
    signup: async (_, { email, password, name }, { mongo }) => {

      //validate user and email with Regex helpers
      if (!validateEmail(email)){
        throw new Error ('Please enter a valid email');
      }

      const acceptPwd = validatePassword(password)
      if (acceptPwd !== 'Valid') {
        throw new Error(acceptPwd);
      }

      //If regex succeeds, check for existing user
      const Users = mongo.collection('users');
      const existingUser = await Users.findOne({ email });

      if (existingUser) {
        throw new Error('Email already used');
      }

      //If available email, hash password with bycrpt and register user in db
      const hash = await bcrypt.hash(password, 10);
      await Users.insert({
        email,
        name,
        password: hash,
      });

      //Find created user by ID and sing the JWT, then store to DB
      const user = await Users.findOne({ email });
      user.jwt = jwt.sign({ _id: user._id }, process.env.JWT_SECRET );
      console.log('User created');
      return user;
    },

    login: async (_, { email, password }, { mongo }) => {
      const Users = mongo.collection('users');

      const user = await Users.findOne({ email });
      if (!user) {
        throw new Error ('Email does not exist, register first');
      }
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        throw new Error ('Password is incorrect');
      }
      user.jwt = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      console.log('User ' + email + ' Logged In');
      return user;
    },

    createNGO: async ( _, { name, mission }, { mongo} ) => {
      const Ngos = mongo.collection('ngos');
      await Ngos.insert({
        name,
        mission,
      });
      const ngo = await Ngos.findOne({ name });
      console.log(name + ' NGO Added');
      return ngo;
    },
  }
};

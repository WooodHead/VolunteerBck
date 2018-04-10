import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const Resolvers = {
  Query: {
    currentUser: async (_, { args }, {user}) => {
      console.log(user.id);
      return user;
    },
    ngosByName: async (_, { name }, { mongo }) => {
      const Ngos = mongo.collection('ngos');
      const ngosByName = await Ngos.findOne({ name });
      return ngosByName;
    }
  },
  Mutation: {
    signup: async (_, { email, password }, { mongo }) => {
      const Users = mongo.collection('users');
      const existingUser = await Users.findOne({ email });

      if (existingUser) {
        throw new Error('Email already used');
      }
      const hash = await bcrypt.hash(password, 10);

      await Users.insert({
        email,
        password: hash,
      });

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

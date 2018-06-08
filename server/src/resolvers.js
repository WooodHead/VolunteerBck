import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validateEmail, validatePassword, prepare } from './helpers';

export const Resolvers = {
  Query: {
    currentUser: async (_, { args }, { mongo, user }) => {
      const Users = mongo.collection('users');
      const currentUser = await Users.findOne({ _id: new ObjectId(user) });
      console.log('User ' + currentUser.email + ' requested user info');
      return currentUser;
    },
    ngoFeedData: async (_, { args }, { mongo, user }) => {
      const Ngos = await mongo.collection('ngos');
      const ngoFeedData = (await Ngos.find({}).toArray()).map(prepare);

      //If error in getting data, throw error
      if(!ngoFeedData) {
        throw new Error ('NGOs Feed data could not be retrieved');
      }
      console.log('NGOs Feed Data Sent');
      return ngoFeedData
    },
    ngosNameLike: async (_, { name }, { mongo }) => {
      const Ngos = await mongo.collection('ngos');
      const ngosNameLike = (await Ngos.find({ 'name' : { $regex : new RegExp(name, "i")} }).toArray()).map(prepare);

      //If error, return query failed
      if (!ngosNameLike) {
        throw new Error ('NGO query by NAME failed');
      }
      console.log('NGOs By Name query performed');
      return ngosNameLike;
    },
    ngosByCause: async (_, { causes }, { mongo }) => {
      const Ngos = await mongo.collection('ngos');
      const query = { causes: { $in: [new RegExp(causes, "i")] }}
      const ngosByCause = (await Ngos.find(query).toArray()).map(prepare);
      //If error, return query failed
      if (!ngosByCause) {
        throw new Error ('NGOs query by CAUSE failed');
      }
      console.log('NGOs query by CAUSE performed');
      return ngosByCause;
    },
    ngosByContinent: async (_, { continents }, { mongo }) => {
      const Ngos = await mongo.collection('ngos');
      const query = { continents: { $in: [new RegExp(continents, "i")] }}
      const ngosByContinent = (await Ngos.find(query).toArray()).map(prepare);
      //If error, return query failed
      if (!ngosByContinent) {
        throw new Error ('NGOs query by Continent failed');
      }
      console.log('NGOs query by Continent performed');
      return ngosByContinent;
    },
    ngosByCountry: async (_, { countries }, { mongo }) => {
      const Ngos = await mongo.collection('ngos');
      const query = { countries: { $in: [new RegExp(countries, "i")] }}
      const ngosByCountry = (await Ngos.find(query).toArray()).map(prepare);
      //If error, return query failed
      if (!ngosByCountry) {
        throw new Error ('NGOs query by Country failed');
      }
      console.log('NGOs query by Country performed');
      return ngosByCountry;
    },
    ngosByCity: async (_, { cities }, { mongo }) => {
      const Ngos = await mongo.collection('ngos');
      const query = { cities: { $in: [new RegExp(cities, "i")] }}
      const ngosByCity = (await Ngos.find(query).toArray()).map(prepare);
      //If error, return query failed
      if (!ngosByCity) {
        throw new Error ('NGOs query by City failed');
      }
      console.log('NGOs query by City performed');
      return ngosByCity;
    },
    ngosByCauseAndContinent: async (_, { causes, continents }, { mongo }) => {
      const Ngos = await mongo.collection('ngos');
      const query = { causes: { $in: [new RegExp(causes, "i")] } }
      const query2 = { continents: { $in: [new RegExp(continents, "i")] } }
      const ngosByCauseAndContinent = (await Ngos.find( { $and: [ query, query2 ] }).toArray()).map(prepare);
      //If error, return query failed
      if (!ngosByCauseAndContinent) {
        throw new Error ('NGOs query by City failed');
      }
      console.log('NGOs query by City performed');
      return ngosByCauseAndContinent;
    },
    ngosByCauseAndCountry: async (_, { causes, countries }, { mongo }) => {
      const Ngos = await mongo.collection('ngos');
      const query = { causes: { $in: [new RegExp(causes, "i")] } }
      const query2 = { countries: { $in: [new RegExp(countries, "i")] } }
      const ngosByCauseAndCountry = (await Ngos.find( { $and: [ query, query2 ] }).toArray()).map(prepare);
      //If error, return query failed
      if (!ngosByCauseAndCountry) {
        throw new Error ('NGOs query by City failed');
      }
      console.log('NGOs query by City performed');
      return ngosByCauseAndCountry;
    },
    ngosByCauseAndCity: async (_, { causes, cities }, { mongo }) => {
      const Ngos = await mongo.collection('ngos');
      const query = { causes: { $in: [new RegExp(causes, "i")] } }
      const query2 = { cities: { $in: [new RegExp(cities, "i")] } }
      const ngosByCauseAndCity = (await Ngos.find( { $and: [ query, query2 ] }).toArray()).map(prepare);
      //If error, return query failed
      if (!ngosByCauseAndCity) {
        throw new Error ('NGOs query by City failed');
      }
      console.log('NGOs query by City performed');
      return ngosByCauseAndCity;
    },
    ctasFeedData: async (_, { args }, { mongo, user }) => {
      const Ctas = await mongo.collection('ctas');
      const ctasFeedData = (await Ctas.find({}).toArray()).map(prepare);

      //If error in getting data, throw error
      if(!ctasFeedData) {
        throw new Error ('CTAs feed data could not be retrieved');
      }
      console.log('CTAs Feed Data Sent');
      return ctasFeedData
    },
    ctasByCause: async (_, { causes }, { mongo }) => {
      const Ctas = await mongo.collection('ctas');
      const query = { causes: { $in: [new RegExp(causes, "i")] }}
      const ctasByCause = (await Ctas.find(query).toArray()).map(prepare);
      //If error, return query failed
      if (!ctasByCause) {
        throw new Error ('CTAs query by CAUSE failed');
      }
      console.log('CTAs query by CAUSE performed');
      return ctasByCause;
    },
  },
  Mutation: {
    signup: async (_, { email, password, name }, { mongo }) => {

      // Validate if valid email
      if (!validateEmail(email)){
        throw new Error ('Please enter a valid email');
      }

      //Validate pasword
      const acceptPwd = validatePassword(password)
      if (acceptPwd !== 'Valid') {
        throw new Error(acceptPwd);
      }

      //If both regex succeeds, check for existing user
      const Users = mongo.collection('users');
      const existingUser = await Users.findOne({ email });
      if (existingUser) {
        throw new Error('Email already used');
      }

      //If user available, hash password with bycrpt and register user in db
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
      //Validate pasword
      const acceptPwd = validatePassword(password)
      if (acceptPwd !== 'Valid') {
        throw new Error(acceptPwd);
      }

      // Validate if valid email
      if (!validateEmail(email)){
        throw new Error ('Please enter a valid email');
      }

      //Check if email exists
      const Users = mongo.collection('users');
      const user = await Users.findOne({ email });
      if (!user) {
        throw new Error ('Email does not exist, register first');
      }
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        throw new Error ('Password is incorrect, please try again');
      }
      user.jwt = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      console.log('User ' + email + ' Logged In');
      return user;
    },

    signupAdmin: async (_, { orgName, orgEmail, name, lastName, password}, { mongo }) => {

      // Validate if valid email
      if (!validateEmail(orgEmail)){
        throw new Error ('Please enter a valid email');
      }

      //Validate pasword
      const acceptPwd = validatePassword(password)
      if (acceptPwd !== 'Valid') {
        throw new Error(acceptPwd);
      }

      //If both regex succeeds, check for existing NGO
      const Ngos = mongo.collection('ngos');
      const existingNgo = await Ngos.findOne({ name : orgName });
      if (existingNgo) {
        throw new Error ('NGO already exists. Please contact Volunteer support')
      }

      //If both regex succeeds, check for existing user
      const Admins = mongo.collection('admins');
      const existingAdmin = await Admins.findOne({ orgEmail });
      if (existingAdmin) {
        throw new Error('Only one NGO per Admin user is allowed');
      }

      //If user available, hash password with bycrpt and register user in db
      const hash = await bcrypt.hash(password, 10);

      await Admins.insert({
        orgEmail,
        password: hash,
        name,
        lastName,
        orgName
      });

      //Find created user by ID and sign the JWT, then store to DB
      const adminUser = await Admins.findOne({ orgEmail });
      adminUser.jwt = jwt.sign({ _id: adminUser._id }, process.env.JWT_SECRET );
      console.log('Admin User created');
      return adminUser;
    },

    createNGO: async ( _, {
      name,
      mission,
      description,
      logo,
      dateFounded,
      causes,
      images,
      worldwide,
      continents,
      countries,
      cities
    }, { mongo } ) => {
      const Ngos = mongo.collection('ngos');
      //Check if there´s an NGO with the same name
      const checkExisting = await Ngos.findOne({ name });
      if (checkExisting) {
        throw new Error ('NGO already exists. Please contact Volunteer support')
      }
      //If it doesn't, create NGO with provided inputs.
      await Ngos.insert({
        name,
        mission,
        description,
        logo,
        dateFounded,
        causes,
        images,
        worldwide,
        continents,
        countries,
        cities
      });
      const ngo = await Ngos.findOne({ name });
      console.log(name + ' NGO Added');
      return ngo;
    },
    createCTA: async ( _, {
      ngo,
      name,
      goal,
      description,
      startDate,
      endDate,
      numericObjective,
      numericProgress,
      images,
      continents,
      countries,
      cities,
    }, { mongo } ) => {
      const Ngos = mongo.collection('ngos');
      const Ctas = mongo.collection('ctas');
      //Get owner NGO Id and Causes
      const ownerNgo = await Ngos.findOne({ name : ngo });
      if (!ownerNgo) {
        throw new Error ('CTA Owner assignment failed')
      }
      const owner = ownerNgo._id
      const causes = ownerNgo.causes

      //check if there is a CTA with the same name and owner NGO
      const ctaExists = await Ctas.findOne({ name })
      if(ctaExists && ctaExists.owner.toString() == owner.toString() ){
        throw new Error ('A CTA with the same name already exists for your NGO')
      }
      //If it doesn't exist, create CTA saving NGO OID as owner
      await Ctas.insert({
        name,
        goal,
        owner,
        causes,
        description,
        startDate,
        endDate,
        numericObjective,
        numericProgress,
        images,
        continents,
        countries,
        cities,
      });
      const cta = await Ctas.findOne({ name });
      console.log(name + ' CTA Added');
      return cta;
    },
  }
};

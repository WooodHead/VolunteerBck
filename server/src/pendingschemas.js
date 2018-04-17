type Sponsor{
  _id: String!,
  name: String,
  logo: String,
  webUrl: String,
  supportedNgos:[NGO],
  supportedProjects:[Project],
},


type Project {
  _id: String,
  owner: NGO,
  name: String,
  goal: String,
  description: String,
  startDate: String,
  endDate: String,
  images:[String],
  ctas:[CTA],
  worldwide: String
  continents: [String]
  countries: [String]
  cities: [String]
},

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
  ngo: NGO,
  name: String
  goal: String
  description: String
  causes: [Cause]
  startDate: String
  endDate: String
  status: String
  ctas: [CTA]
  continents: [String]
  countries: [String]
  cities: [String]
  images: [String]
},

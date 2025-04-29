const mongoose = require("mongoose");
const dotenv = require("dotenv");
const axios = require("axios");
const bcrypt = require("bcrypt");

dotenv.config();
const User = require("../src/models/User"); // Adjust path

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

const fetchRandomUsers = async (count = 10) => {
  const res = await axios.get(`https://randomuser.me/api/?results=${count}`);
  return res.data.results;
};

const mapToUserModel = async (userData) => {
  const hashedPassword = await bcrypt.hash("Test@1234", 10); // Default password

  const relationshipTypes = [
    "Casual Dating",
    "Long-Term Relationship",
    "Friendship",
    "Networking",
    "Companionship",
    "Marriage",
    "Hookups",
    "Something Serious",
    "Open Relationship",
    "Exploring / Not Sure",
  ];

  const zodiacSigns = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ];

  const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

  return {
    fullName: `${userData.name.last}`.toLowerCase(),
    userName: `${userData.login.username.toLowerCase()}`,
    email: userData.email.toLowerCase(),
    password: hashedPassword,
    age: userData.dob.age,
    dob: userData.dob.date,
    gender: userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1),
    isVerified: true,
    isProfileSetup: true,
    bio: "Hi! I'm new here. Looking to meet new people.",
    interestIn: randomChoice(["Male", "Female", "Non-binary"]),
    ageRange: [18, 35],
    relationShipType: randomChoice(relationshipTypes),
    zodiacSign: randomChoice(zodiacSigns),
    interest: ["music", "movies", "travel", "books", "art"].slice(
      0,
      Math.floor(Math.random() * 5) + 1
    ),
    locationName: userData.location.city.toLowerCase(),
    locationcoordiantes: {
      type: "Point",
      coordinates: [
        parseFloat(userData.location.coordinates.longitude),
        parseFloat(userData.location.coordinates.latitude),
      ],
    },
    profilePicture: userData.picture.large,
    twoBestPics: [userData.picture.medium, userData.picture.thumbnail],
    isPremiumUser: Math.random() < 0.5,
  };
};

const seedUsers = async () => {
  try {
    await connectDB();
    await User.deleteMany({});

    const apiUsers = await fetchRandomUsers(10);
    const formattedUsers = await Promise.all(apiUsers.map(mapToUserModel));

    await User.insertMany(formattedUsers);

    console.log("✅ 10 random users seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seedUsers();

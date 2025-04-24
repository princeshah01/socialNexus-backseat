const { subHours } = require("date-fns");
const timeToCheckFor = subHours(new Date(), 1);
console.log(timeToCheckFor);
const processProfileData = (data) => {
  const processedData = {};

  // Handle required fields
  processedData.fullName = data.fullName || null;
  processedData.gender = data.gender || null;
  processedData.dob = data.dob || null;
  processedData.bio = data.bio || null;
  processedData.locationName = data.locationName || null;

  // Parse JSON strings if present
  try {
    processedData.locationcoordiantes = data.locationcoordiantes
      ? JSON.parse(data.locationcoordiantes)
      : null;
  } catch (error) {
    processedData.locationcoordiantes = null;
  }

  processedData.InterestIn = data.InterestIn || null;

  // Handle array fields (interest and ageRange)
  try {
    processedData.interest = data.interest ? JSON.parse(data.interest) : [];
  } catch (error) {
    processedData.interest = [];
  }

  try {
    processedData.ageRange = data.ageRange ? JSON.parse(data.ageRange) : [];
  } catch (error) {
    processedData.ageRange = [];
  }

  processedData.zodicSign = data.zodicSign || null;
  processedData.relationshipType = data.relationshipType || null;

  // Handle optional fields (e.g., twoBestPics, profilePicture)
  processedData.twoBestPics = data.twoBestPics
    ? data.twoBestPics.map((file) => file.filename)
    : [];
  processedData.profilePicture = data.profilePicture
    ? data.profilePicture[0].filename
    : null;

  return processedData;
};

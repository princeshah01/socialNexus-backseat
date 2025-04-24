const processProfileData = (data) => {
  const processedData = {};

  processedData.fullName = data.fullName ? data.fullName.trim() : null;
  processedData.gender = data.gender ? data.gender.trim() : null;
  processedData.dob = data.dob ? data.dob.trim() : null;
  processedData.bio = data.bio ? data.bio.trim() : null;
  processedData.locationName = data.locationName
    ? data.locationName.trim()
    : null;
  try {
    processedData.locationcoordiantes = data.locationcoordiantes
      ? JSON.parse(data.locationcoordiantes)
      : null;
  } catch (error) {
    processedData.locationcoordiantes = null;
  }

  processedData.InterestIn = data.InterestIn ? data.InterestIn.trim() : null;
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

  processedData.zodiacSign = data.zodiacSign || null;
  processedData.relationShipType = data.relationShipType || null;
  processedData.twoBestPics = data.twoBestPics
    ? data.twoBestPics.map((file) =>
        encodeURI(`${process.env.API_BASE_URI}/uploads/${file.filename}`)
      )
    : [];
  processedData.profilePicture = data.profilePicture
    ? encodeURI(
        `${process.env.API_BASE_URI}/uploads/${data.profilePicture[0].filename}`
      )
    : null;

  return processedData;
};
module.exports = processProfileData;

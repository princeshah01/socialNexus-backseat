exports.removeNullAndData = (org, additional) => {
  const newObj = {};
  Object.keys(org).forEach((k) => {
    if (
      org[k] !== null &&
      !(Array.isArray(org[k]) && org[k].length === 0) &&
      org[k] !== ""
    ) {
      newObj[k] = org[k];
    }
  });
  return { ...newObj, ...additional };
};

exports.userSafeData =
  "fullName userName interestIn dob age gender isVerified bio profilePicture twoBestPics locationName interest";

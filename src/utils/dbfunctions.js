const User = require("../models/User")

const storeLastFivePassword = async (id, oldPassword) => {
    try {
        await User.updateOne(
            { _id: id },
            {
                $push: {
                    lastPassword: {
                        $each: [oldPassword],
                        $slice: -5
                    }
                }
            }
        );
        return true
    } catch (error) {
        return false
    }
}

module.exports = storeLastFivePassword;
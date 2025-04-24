const bcrypt = require("bcrypt")
const compareWithLastPassword = async (password, passwordArray) => {

    for (let i = 0; i < passwordArray.length; i++) {
        const isMatched = await bcrypt.compare(password, passwordArray[i])
        if (isMatched) {
            return true
        }
    }
    return false

}
module.exports = compareWithLastPassword
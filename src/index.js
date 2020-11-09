const school = require('./school')
const login = require('./login')
const updateAgreement = require('./updateAgreement')
const checkpw = require('./checkpw')
const registpw = require('./registpw')
const secondLogin = require('./secondLogin')
const userInfo = require('./userInfo')
const registerSurvey = require('./registerSurvey')

module.exports = {
    searchSchool: school,
    login: login,
    updateAgreement: updateAgreement,
    passwordExists: checkpw,
    registerPassword: registpw,
    secondLogin: secondLogin,
    userInfo: userInfo,
    registerSurvey: registerSurvey
}

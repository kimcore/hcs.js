const school = require('./school')
const login = require('./login')
const updateAgreement = require('./updateAgreement')
const checkpw = require('./checkpw')
const registerPassword = require('./registerPassword')
const secondLogin = require('./secondLogin')
const userInfo = require('./userInfo')
const registerSurvey = require('./registerSurvey')

module.exports = {
    searchSchool: school,
    login: login,
    updateAgreement: updateAgreement,
    passwordExists: checkpw,
    registerPassword: registerPassword,
    secondLogin: secondLogin,
    userInfo: userInfo,
    registerSurvey: registerSurvey
}

const searchSchool = require('./school')
const login = require('./login')
const updateAgreement = require('./updateAgreement')
const passwordExists = require('./checkpw')
const registerPassword = require('./registerPassword')
const secondLogin = require('./secondLogin')
const userInfo = require('./userInfo')
const registerSurvey = require('./registerSurvey')

module.exports = {
    searchSchool, login, updateAgreement,
    passwordExists, registerPassword,
    secondLogin, userInfo, registerSurvey
}

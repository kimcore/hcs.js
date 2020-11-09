const request = require('./request')
const encrypt = require('./encrypt')

module.exports = async (endpoint, schoolCode, name, birthday) => {
    const data = {
        birthday: encrypt(birthday),
        loginType: 'school',
        name: encrypt(name),
        orgCode: schoolCode,
        stdntPNo: null
    }
    const response = await request('/v2/findUser', 'POST', data, endpoint)
    return response.isError ? {
        success: false,
        message: response['message']
    } : {
        success: true,
        agreementRequired: response['pInfAgrmYn'] === 'N',
        schoolName: response['orgName'],
        name: name,
        birthday: birthday,
        token: response['token']
    }
}

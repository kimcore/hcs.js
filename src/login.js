const request = require('./request')
const encrypt = require('./encrypt')

module.exports = async (endpoint, schoolCode, name, birthday) => {
    const data = {
        orgcode: schoolCode,
        name: encrypt(name),
        birthday: encrypt(birthday)
    }
    const response = await request('/loginwithschool', 'POST', data, endpoint)
    return response.isError ? {
        success: false,
        message: response['message']
    } : {
        success: true,
        agreementRequired: response['infAgrmYn'] === 'N',
        registerRequired: response['registerDtm'] === undefined,
        registeredAt: response['registerDtm'],
        registeredAtYMD: response['registerYmd'],
        schoolName: response['orgname'],
        name: name,
        birthday: birthday,
        token: response['token']
    }
}

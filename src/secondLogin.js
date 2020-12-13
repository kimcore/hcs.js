const request = require('./request')
const encrypt = require('./encrypt')

module.exports = async (endpoint, token, password) => {
    const data = {
        deviceUuid: '',
        password: encrypt(password)
    }
    const response = await request('/v2/validatePassword', 'POST', data, endpoint, {'Authorization': token})
    return response.isError ? {
        success: false,
        failCount: response['data']['remainMinutes'] ? 5 : response['data']['failCnt'],
        remainingMinutes: Number(response['data']['remainMinutes'] ? response['data']['remainMinutes'] : 0),
    } : {
        success: true,
        token: response
    }
}

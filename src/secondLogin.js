const request = require('./request')
const raon = require('./raon')

module.exports = async (endpoint, token, password) => {
    const data = {
        deviceUuid: '',
        makeSession: true,
        password: await raon(password)
    }
    const response = await request('/v2/validatePassword', 'POST', data, endpoint, {'Authorization': token})
    return typeof response != "string" ? {
        success: false,
        failCount: response['data']['remainMinutes'] ? 5 : response['data']['failCnt'],
        remainingMinutes: Number(response['data']['remainMinutes'] ? response['data']['remainMinutes'] : 0),
    } : {
        success: true,
        token: response
    }
}

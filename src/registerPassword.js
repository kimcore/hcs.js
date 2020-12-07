const request = require('./request')
const encrypt = require('./encrypt')

module.exports = async (endpoint, token, password) => {
    const data = {
        deviceUuid: '',
        password: encrypt(password)
    }
    const response = await request('/v2/registerPassword', 'POST', data, endpoint, {'Authorization': token})
    return {success: response}
}

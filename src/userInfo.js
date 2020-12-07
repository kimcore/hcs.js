const request = require('./request')

module.exports = async (endpoint, token) => {
    const response = await request('/v2/selectUserGroup', 'POST', {}, endpoint, {'Authorization': token})
    const list = []
    for (const user of response) {
        const data = {
            orgCode: user['orgCode'],
            userPNo: user['userPNo']
        }
        const userinfo = await request('/v2/getUserInfo', 'POST', data, endpoint, {'Authorization': user['token']})
        list.push({
            registerRequired: userinfo['registerDtm'] === undefined,
            registeredAt: userinfo['registerDtm'],
            registeredAtYMD: userinfo['registerYmd'],
            schoolName: userinfo['orgName'],
            schoolCode: userinfo['orgCode'],
            isHealthy: userinfo['isHealthy'],
            name: userinfo['userNameEncpt'],
            UID: userinfo['userPNo'],
            token: userinfo['token']
        })
    }
    return list
}

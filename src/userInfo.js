const request = require('./request')

module.exports = async (endpoint, token) => {
    const response = await request('/selectGroupList', 'POST', {}, endpoint, {'Authorization': token})
    const users = response['groupList']
    const list = []
    for (const user of users) {
        const data = {
            orgCode: user['orgCode'],
            userPNo: user['userPNo']
        }
        const userinfo = await request('/userrefresh', 'POST', data, endpoint)
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

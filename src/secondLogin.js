const request = require('./request')
const raon = require('./util/raon')

module.exports = async (endpoint, token, password) => {
    const data = {
        deviceUuid: '',
        makeSession: true,
        password: await raon(password)
    }
    const response = await request('/v2/validatePassword', 'POST', data, endpoint, {'Authorization': token})
    const success = typeof response == "string"

    return success ? {
        success, token: response
    } : (
        response['isError'] && response['message'] !== "비밀번호를 다시한번더 입력해주세요" ? {
            success,
            failCount: response['data']['failCnt'] ?? 5,
            remainingMinutes: response['data']['remainMinutes'] ? Number(response['data']['remainMinutes']) : 0
        } : {
            success, message: "가상 키보드의 암호화 구조가 변경되어 현재 사용할 수 없습니다. 라이브러리 업데이트를 기다려주세요."
        }
    )
}

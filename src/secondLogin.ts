import request from "./request"
import buildRaon from "./raon/buildRaon"

export type SecondLoginResult = SecondLoginResultSuccess | SecondLoginResultFailure

export interface SecondLoginResultSuccess {
    /**
     * 성공 여부와 에 따라 제공되는 데이터가 다릅니다.
     *
     * @example if (result.success) {
     *      // 로그인 성공 데이터
     *    } else {
     *      // 로그인 실패 데이터
     *    }
     * */
    success: true
    /** 설문 토큰 */
    token: string
}

export interface SecondLoginResultFailure {
    /**
     * 성공 여부, 참/거짓에 따라 제공되는 데이터가 다릅니다.
     *
     * @example if (result.success) {
     *      // 로그인 실패 데이터
     *    } else {
     *      // 로그인 성공 데이터
     *    }
     * */
    success: false
    /** 로그인 실패 횟수 */
    failCount?: number
    /** 남은 시간 */
    remainingMinutes?: number
    message: string
}

export async function secondLogin(endpoint: string, token: string, password: string): Promise<SecondLoginResult> {
    const data = {
        deviceUuid: "",
        makeSession: true,
        password: await buildRaon(password)
    }
    const response = await request('/v2/validatePassword', 'POST', data, endpoint, token)

    if (response.token) {
        return {
            success: true, token: response.token
        }
    }

    if (response.message == "비밀번호를 다시한번더 입력해주세요") {
        return {
            success: false,
            failCount: null,
            remainingMinutes: null,
            message: "가상키보드 오류"
        }
    }

    let message = null
    if (response.statusCode == 252) {
        switch (response.errorCode) {
            case 1e3:
                message = "비밀번호를 5회 틀리셔서 5분후 재시도 하실 수 있습니다."
                break
            case 1001:
                if (!response.data.canInitPassword) {
                    message = "사용자 비밀번호가 맞지 않습니다. 본인이나 가족이 이미 설정한 비밀번호를 입력하여 주시기 바랍니다."
                }
                break
            case 1003:
                message = "비밀번호가 초기화 되었습니다. 다시 로그인하세요"
        }
    } else if (response.statusCode == 255) {
        switch (response.errorCode) {
            case 1004:
                message = "입력시간이 초과되어 다시 비밀번호를 입력하시기 바랍니다."
        }
    }

    return {
        success: false,
        failCount: response.data.failCnt ? Number(response.data.failCnt) : 5,
        remainingMinutes: response.data.remainMinutes ? Number(response.data.remainMinutes) : 0,
        message
    }
}

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
    const success = typeof response == "string"

    return success ? {
        success: true, token: response
    } : (
        response['isError'] && response['message'] !== "비밀번호를 다시한번더 입력해주세요" ? {
            success: false,
            failCount: response['data']['failCnt'] ? Number(response['data']['failCnt']) : 5,
            remainingMinutes: response['data']['remainMinutes'] ? Number(response['data']['remainMinutes']) : 0,
            message: response['message']
        } : {
            success: false,
            failCount: null,
            remainingMinutes: null,
            message: "가상키보드 오류"
        }
    )
}

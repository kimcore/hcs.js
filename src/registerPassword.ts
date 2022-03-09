import fetchHcs from "./util/fetchHcs"
import encrypt from "./util/encrypt"

/** 비밀번호 설정 결과 */
export interface RegisterPasswordResult {
    success: boolean
}

/**
 * 비밀번호를 설정합니다.
 * @param endpoint 관할 시/도 엔드포인트
 * @param token 1차 로그인 토큰
 * @param password 비밀번호
 * @returns {Promise<RegisterPasswordResult>}
 */
export async function registerPassword(endpoint: string, token: string, password: string): Promise<RegisterPasswordResult> {
    const data = {
        deviceUuid: "",
        password: encrypt(password)
    }
    const response = await fetchHcs("/v2/registerPassword", "POST", data, endpoint, token)
    return {success: response}
}

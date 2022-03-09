import fetchHcs from "./util/fetchHcs"

/**
 * 비밀번호 설정 여부를 확인합니다.
 * @param endpoint 관할 시/도 엔드포인트
 * @param token 1차 로그인 토큰
 * @returns {boolean}
 */
export async function passwordExists(endpoint: string, token: string): Promise<boolean> {
    return fetchHcs('/v2/hasPassword', 'POST', {}, endpoint, token)
}


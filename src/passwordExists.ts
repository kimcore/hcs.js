import request from "./request"

/**
 * 비밀번호 설정 여부를 확인합니다.
 *
 * @param endpoint 관할 시/도 엔드포인트
 * @param token 로그인 세션 토큰
 */
export async function passwordExists(endpoint: string, token: string): Promise<boolean> {
    return await request('/v2/hasPassword', 'POST', {}, endpoint, token)
}

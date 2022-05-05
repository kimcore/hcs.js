import fetchHcs from "./util/fetchHcs"

/** 학교 정보 */
export interface School {
    /** 학교명 */
    name: string
    /** 학교명(영문) */
    nameEn: string
    /** 관할 시/도 */
    city: string
    /** 학교 주소 */
    address: string
    /** 관할 시/도 엔드포인트 */
    endpoint: string
    /** 암호화된 학교식별번호, 로그인 시에는 이것을 사용해야 합니다. */
    schoolCode: string
    /** 학교식별번호 */
    rawSchoolCode: string
    /** 학교 검색 인증 키 */
    searchKey: string
}

/**
 * 학교를 검색합니다.
 * @param schoolName 학교명
 * @returns {Promise<School[]>}
 */
export async function searchSchool(schoolName: string): Promise<School[]> {
    const response = await fetchHcs("/v2/searchSchool", "GET", {orgName: schoolName})
    const schoolList = Object(response["schulList"])
    return schoolList.map(school => {
        return {
            name: school["kraOrgNm"],
            nameEn: school["engOrgNm"],
            city: school["lctnScNm"],
            address: school["addres"],
            endpoint: school["atptOfcdcConctUrl"],
            schoolCode: school["orgCode"],
            rawSchoolCode: school["juOrgCode"],
            searchKey: response.key
        }
    })
}

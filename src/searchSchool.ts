import request from "./request"

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
    /** 학교식별번호 */
    schoolCode: string
}

export async function searchSchool(schoolName: string): Promise<School[]> {
    const response = await request("/v2/searchSchool", "GET", {orgName: schoolName})
    const schoolList = Object(response["schulList"])
    return schoolList.map(school => {
        return {
            name: school["kraOrgNm"],
            nameEn: school["engOrgNm"],
            city: school["lctnScNm"],
            address: school["addres"],
            endpoint: school["atptOfcdcConctUrl"],
            schoolCode: school["orgCode"]
        }
    })
}

import * as searchSchool from "./searchSchool"
import * as login from "./login"
import * as updateAgreement from "./updateAgreement"
import * as passwordExists from "./passwordExists"
import * as registerPassword from "./registerPassword"
import * as secondLogin from "./secondLogin"
import * as userInfo from "./userInfo"
import * as registerSurvey from "./registerSurvey"

export default {
    ...searchSchool,
    ...login,
    ...updateAgreement,
    ...passwordExists,
    ...registerPassword,
    ...secondLogin,
    ...userInfo,
    ...registerSurvey
}

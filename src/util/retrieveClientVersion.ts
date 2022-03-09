import fetchHcs from "./fetchHcs"

export default async function retrieveClientVersion() {
    const html = await fetchHcs()
    return html.match(/<link rel=icon href=https:\/\/.*\.toastcdn\.net\/eduro\/(.*)\/favicon\.ico type=image\/x-icon>/)[1]
}

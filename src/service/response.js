export const SendSuccess = (res, message, data) => {
    res.status(200).json({ success: true, message, data }) // success
}
export const SendCreate = (res, message, data) => {
    res.status(201).json({ success: true, message, data }) // insert
}
export const SendAlready = (res, message, data) => {
    res.status(208).json({ success: true, message, data }) // already
}
export const SendError = (res, status, message, error) => {
    res.status(status).json({ success: false, message, error, data: {} })
}
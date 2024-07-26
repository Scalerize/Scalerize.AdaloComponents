export const isEmail = (email) => {
    if (typeof (email) !== 'string') {
        return false;
    }
    return /^[+0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$/gm.test(email);
}
export const getAdaloPictureLink = (value) => {
    return `https://adalo-uploads.imgix.net/${value.url}?auto=compress&h=30`;
}


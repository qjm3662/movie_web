function getIconByMIME(mime) {
    if (!mime)
        return require('../img/file.png');
    else if (mime.startsWith('audio/'))
        return require('../img/music.png');
    else if (mime.startsWith('application/vnd.ms-excel')
        || mime.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.'))
        return require('../img/excel.png');
    else if (mime.startsWith('application/msword') ||
        mime.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml') ||
        mime.startsWith('application/vnd.ms-word'))
        return require('../img/word.png');
    else if (mime.startsWith('application/vnd.ms-powerpoint') ||
        mime.startsWith('application/vnd.openxmlformats-officedocument.presentationml'))
        return require('../img/ppt.png');
    else if (mime.startsWith('application/pdf'))
        return require('../img/pdf.png');
    else if (mime.startsWith('image'))
        return require('../img/picture.png');
    else
        return require('../img/file.png');
}

export {
    getIconByMIME,
}
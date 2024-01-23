module.exports = function getFileNameFromUrl(url) {
    return url.split('/').pop().split('?')[0];
};
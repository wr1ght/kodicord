const Http = require('../modules/Http');
const http = new Http();

function encode(data) {
    if (!data) return null;
    const dataBase64 = (Buffer.isBuffer(data)) ? data.toString('base64') : new Buffer(data).toString('base64');
    const dataImgBase64 = `data:image/png;base64,${dataBase64}`;
    return dataImgBase64;
};

module.exports = async function(imageURL) {
        if (!imageURL) return null;
        const response = await http.get({ url: imageURL, options: { encoding: null }});
        if (!response) return null;
        return encode(response);
}
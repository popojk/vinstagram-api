const imgur = require('imgur');
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
imgur.setClientId(IMGUR_CLIENT_ID);

export const imgurFileHandler = (file: any) => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    return imgur.uploadFile(file.path)
      .then((img: any) => {
        resolve(img?.link || null);
      })
      .catch((err: any) => reject(err));
  });
};
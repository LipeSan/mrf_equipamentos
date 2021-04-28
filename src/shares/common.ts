import moment from 'moment';
const FileReader = require('filereader');
const Blob = require('node-blob');
const { Storage } = require('@google-cloud/storage');
import { firebaseConfig } from '../config/firebase';

interface Base64 {
  base64data: string,
  type: string
}

const storage = new Storage({
  keyFilename: firebaseConfig.apiKey,
});

const generateSerieNumber = () => {
  const date = new Date();
  const number = moment(date).format('YYYYMMDDHHMMSS');
  return number
}

const toBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64DataAux = new Buffer(reader.result.replace(/^data:image\/\w+;base64,/, ""), 'base64');
      const result: Base64 = {
        base64data: base64DataAux.toString(),
        type: reader.result.split(';')[0].split('/')[1]
      }
      resolve(result);
    };
    reader.onerror = (error: any) => reject(error);
  })
}

const toBlob = (base64: any, type: string) => {
  return new Blob([base64], { type: type });
}

const uploadImage = async (imagePath: string, image: any) => {
  await storage.bucket(firebaseConfig.storageBucket).upload(imagePath, {
    gzip: true,
    metadata: {
      cacheControl: 'public, max-age=31536000'
    }
  });
}
export default { generateSerieNumber, toBase64, toBlob, uploadImage }
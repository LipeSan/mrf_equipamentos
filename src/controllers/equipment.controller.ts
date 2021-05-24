import { resolve } from "path";
import firebase from '../database/index';
import firebaseadmin from '../database/firebase-admin';
import Common from '../shares/common';
import { firebaseConfig } from '../config/firebase';
import { url } from "inspector";
const Buffer = require('buffer/').Buffer;


const database = firebase.database();
const bucket = firebaseadmin.storage().bucket("gs://" + firebaseConfig.storageBucket);

const createEquipment = (equipment: any) => {
    return new Promise((resolve, reject) => {
        const equipmentId = Common.generateSerieNumber();
        database.ref('equipments/' + equipmentId).set({
            ...equipment,
            equipmentId: equipmentId
        }).then(() => {
            resolve({ success: true, message: '', data: { ...equipment, equipmentId: equipmentId } })
        }).catch((error: any) => {
            console.log("ERROR - equipments", error);
            reject({ success: false, message: '', data: null });
        });
    })
}

const getEquipmentById = (equipmentId: string) => {
    return new Promise((resolve, reject) => {
        database.ref('equipments/' + equipmentId).on('value', (snapshot: any) => {
            const data = snapshot.val();
            if (data.images && data.images.length > 0) {
                data.images.forEach((elem: any) => {
                    elem.name = elem.url;
                    elem.url = firebaseConfig.urlImage1 + elem.url + firebaseConfig.urlImage2;
                })
            }
            resolve({ success: true, message: '', data: data })
        }, (error: any) => {
            console.log("ERROR - getEquipmentById", error);
            reject({ success: false, message: '', data: null })
        })
    })
}

const getEquipments = () => {
    return new Promise((resolve, reject) => {
        let resultList: any = []
        database.ref('equipments/').orderByKey().on('value', (snapshot: any) => {
            snapshot.forEach((element: any) => {
                let elementAux = element.val();
                //console.log("DATA",elementAux.images.length);

                if (elementAux.images && elementAux.images.length > 0) {
                    elementAux.images.forEach((elem: any) => {
                        elem.name = elem.url;
                        elem.url = firebaseConfig.urlImage1 + elem.url + firebaseConfig.urlImage2;
                    })
                }
                resultList.push(elementAux);
            })
            resolve({ success: true, message: '', data: resultList })
        }, (error: any) => {
            console.log("ERROR - getEquipment", error);
            reject({ success: false, message: '', data: null })
        });
    });
}

const updateEquipamentById = (equipmentId: string, equipment: any) => {
    return new Promise((resolve, reject) => {
        database.ref('equipments').child(equipmentId).once('value').then((snapshot: any) => {
            if (snapshot.hasChildren()) {
                    snapshot.ref.update(equipment).then((data: any) => {
                        resolve({ success: true, message: '', data: data })
                    }).catch((error: any) => {
                        console.log("ERROR - updateEquipamentById", error);
                        reject({ success: false, message: '', data: null })
                    });
            } else {
                reject({ success: false, message: '', data: null })
            }
        }).catch((error: any) => {
            console.log("ERROR - updateEquipamentById", error);
            reject({ success: false, message: '', data: null })
        })
    });

}

const uploadImages = async (imagePath: string, file: any) => {
    return new Promise(async (resolve, reject) => {
        let urlList: any = [];
        console.log("DATA");

        let typeFile = file.mimetype.split('/')[1];
        const fileName = `${imagePath}_${Common.generateSerieNumber()}.${typeFile}`;
        let newFileName = `images/${fileName}`;
        let fileUpload = bucket.file(newFileName);
        const blobStream = fileUpload.createWriteStream({
            resumable: true,
            metadata: {
                ContentType: file.mimetype,
                metadata: {
                    firebaseStorageDownloadTokens: null, // Can technically be anything you want
                },
            }
        });
        blobStream.on('error', (error: any) => {
            console.log("ERROR - uploadImages 1", error);
            reject({ success: false, message: '', data: error });
        });
        blobStream.on('finish', () => {
            resolve({ success: true, message: '', data: { url: fileName } });
        }).on('error', (error: any) => {
            console.log("ERROR - uploadImages 2", error);
            reject({ success: false, message: '', data: error });
        }).end(file.buffer);
    })



}

export default {
    createEquipment,
    getEquipmentById,
    getEquipments,
    updateEquipamentById,
    uploadImages,
}
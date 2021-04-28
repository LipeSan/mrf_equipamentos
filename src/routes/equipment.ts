import {Router} from 'express';
import Equipment from '../controllers/equipment.controller';
import formidable from 'formidable';
const Multer = require('multer');

const router = Router();
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    }
  });

router.post('/', async(req, res) => {
    const equipment = req.body;
    const result = await Equipment.createEquipment(equipment);
    res.send(result);
});

router.get('/', async(req, res) => {
    const result = await Equipment.getEquipments();
    res.send(result);
});

router.get('/:id', async(req, res) => {
    const equipmentId = req.params.id;
    const result = await Equipment.getEquipmentById(equipmentId?equipmentId:'');
    res.send(result);
});

router.patch('/:id', async(req, res) => {
    const equipmentId = req.params.id;
    const equipment = req.body; 
    const result = await Equipment.updateEquipamentById(equipmentId?equipmentId:'', equipment);
    res.send(result);
});

router.post('/upload/:id', multer.single('file'), async (req, res) => {
    let file:any = req.file;
    const equipmentId = req.params.id;
    console.log("DATA",file);
    const result = await Equipment.uploadImages(equipmentId, file);
    res.send(result);
})

// router.post('/upload/:id', async(req, res) => {
//     const equipmentId = req.params.id;
//     const equipment = req.body; 
//     let files:Array<any> = [];
    
//     var form = new formidable.IncomingForm();
//     form.on('error', async (error) => {
//         console.log("ERROR - updload",error);
        
//     });
//     form.on('file', function(field, file) {
//         console.log(file.name);
//         files.push(file);
//     })
//     form.on('progress', async (bytesReceived, bytesExpected) => {
//         const percent_complete = (bytesReceived / bytesExpected) * 100;
//         console.log(percent_complete.toFixed(2));
//     });
//     form.on('end', async () => {
//         const result = await Equipment.uploadImages(equipmentId, files);   
//         console.log("END",result);
        
//     });
//     form.parse(req, ()=>{});
    
//     //const result = await Equipment.uploadImages(equipmentId?equipmentId:'', []);
//     //res.send(true);
// });

module.exports = (app:any) => app.use('/equipments', router);
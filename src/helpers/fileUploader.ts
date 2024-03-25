import multer from "multer";
import path from "path";
import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'dy6sgpkql', 
  api_key: '357623463728155', 
  api_secret: 'kVHm3ajDRFO2f52xQmldafGKoh4' 
});




// save file in local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});



// upload file in cloudinary
export const uploadToCloudinary = async(file:any)=>{
 await cloudinary.uploader.upload("E:/Work FIles/PH-HEALTHCARE-SERVER/uploads/rakib8680.png",
  { public_id: "olympic_flag" }, 
  function(error, result) {console.log(result); });
}




export const upload = multer({ storage: storage });




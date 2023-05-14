const express = require("express")
const uploadRouter = express.Router()
const multer  = require('multer')
const {returnErr} = require('../../utils/returnErr')
const BaseUrl = 'http://localhost:3303/static/upload'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './static/upload')
  },
  filename: function (req, file, cb) {
    cb(null,  Date.now()+'.'+file.originalname.split('.')[1])
  }
})

const upload = multer({ storage: storage })
//上传接口



//上传用户头像

uploadRouter.post('/user/avatar',upload.single('avatar'), (req, res) => {
  const {size,filename,originalname} = req.file    
  const allowImgType = ['png','jpg','jpeg']
  const preventImgType = originalname.split('.')[1]
  if(!allowImgType.includes(preventImgType.toLowerCase())) return returnErr(res,`图片类型只能为：${allowImgType.join('、')}`)
  if(size/1024/1024>2) return returnErr(res,'图像大小不能超过2M')
  res.send({code:200,msg:'图片上传成功',url:`${BaseUrl}/${filename}`})
})


// {
//   fieldname: 'avatar',
//   originalname: 'banner.jpg',
//   encoding: '7bit',
//   mimetype: 'image/jpeg',
//   destination: './static/upload',
//   filename: 'avatar1683166913076.jpg',
//   path: 'static\\upload\\avatar1683166913076.jpg',
//   size: 129428
// }
module.exports = uploadRouter
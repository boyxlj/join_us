const express = require('express')
const cors = require('cors')
const {resolve} = require('path')
const app = express()
app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use('/api',require('./router'))
app.use('/api/manger',require('./mangerRouter'))

app.use('/static',express.static(resolve(__dirname,'./static')))

const port = 3303
app.listen(port,()=>{
  console.log(`serve in running ${port}`)
})
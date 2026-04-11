import express from 'express'
const PORT = 8000

const app = express()
app.use(express.json())

app.get('/mythologies', (req,res)=>{
    res.json({message: "Here are your mythologies response"})
})


app.listen(PORT,(req,res)=>{
    console.log("Server is running✅")
})

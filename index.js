import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

const app = express()
dotenv.config()

const PORT = process.env.PORT || 5000

app.use(cors())

app.get('/', (req, res) => {
  res.json({ msg: "Index is running" })
})

app.listen(PORT, () => {
  console.log(`Backend running on port:${PORT}`)
})
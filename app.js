import express from 'express'
import cors from "cors"
import routes from './routes.js'
import { PORT } from './config.js'

import { sequelize } from './databases/conecta.js'
import { Usuario } from './models/Usuario.js'
import { Log } from './models/Log.js'

const app = express()


app.use(express.json())
app.use(cors())
app.use(routes)

async function conecta_db() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com banco de dados realizada com sucesso');

    await Usuario.sync()
    await Log.sync()

  } catch (error) {
    console.error('Erro na conexão com o banco: ', error);
  }
}
conecta_db()

app.get('/', (req, res) => {
  res.send('Conta Certa')
})

app.listen(PORT, () => {
  console.log(`Servidor Rodando na Porta: ${PORT}`)
})
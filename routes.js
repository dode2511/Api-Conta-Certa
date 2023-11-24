import { Router } from "express"
import { usuarioAlteraSenha, usuarioCreate, usuarioIndex } from "./controllers/usuarioController.js"
import { loginUsuario } from "./controllers/loginController.js"
import { verificaLogin } from "./middlewares/verificaLogin.js"
import { entradaDestroy, entradaCreate, entradaIndex, entradapesq } from "./controllers/entradaController.js"
import { saidaCreate, saidaDestroy, saidaIndex, saidaPesq } from "./controllers/saidaController.js"

const router = Router()



router.get(`/entradas`,entradaIndex)
      .post(`/entradas`,entradaCreate)
      .delete(`/entradas`,entradaDestroy)
      .get(`/entradas/:id`,entradapesq)





router.get(`/saida`,saidaIndex)
router.get(`/saida`,saidaCreate)
router.get(`/saida`,saidaDestroy)
router.get(`/saida/:id`,saidaPesq)













router.get('/usuarios', usuarioIndex)//verificaLogin
      .post('/usuarios', usuarioCreate)
      .put('/usuarios', usuarioAlteraSenha)
         
router.get('/login', loginUsuario)

export default router
import { Router } from "express"
import { usuarioAlteraSenha, usuarioCreate, usuarioIndex } from "./controllers/usuarioController.js"
import { loginUsuario } from "./controllers/loginController.js"
import { verificaLogin } from "./middlewares/verificaLogin.js"
import { entradaDestroy, entradaCreate, entradaIndex, entradapesq,  entradaGraphDias, entradaCategorias,   } from "./controllers/entradaController.js"
import { saidaCreate, saidaDestroy, saidaIndex, saidaPesq } from "./controllers/saidaController.js"

const router = Router()



router.get(`/entradas`,entradaIndex)
      .post(`/entradas`,entradaCreate)
      .delete(`/entradas`,entradaDestroy)
      .get(`/entradas/:id`,entradapesq)
      .get('/entrada/dias', entradaGraphDias)

router.get('/graph',entradaCategorias )




router.get(`/saidas`,saidaIndex)
router.post(`/saidas`,saidaCreate)
router.delete(`/saidas`,saidaDestroy)
router.get(`/saidas/:id`,saidaPesq)













router.get('/usuarios', usuarioIndex)//verificaLogin
      .post('/usuarios', usuarioCreate)
      .put('/usuarios', usuarioAlteraSenha)
         
router.get('/login', loginUsuario)

export default router
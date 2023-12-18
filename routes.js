import { Router } from "express"
import { login, usuarioAlteraSenha, usuarioCreate, usuarioIndex } from "./controllers/usuarioController.js"
import { loginUsuario } from "./controllers/loginController.js"
import { verificaLogin } from "./middlewares/verificaLogin.js"
import { entradaDestroy, entradaCreate, entradaIndex, entradapesq,  entradaGraphDias, entradaCategorias, entradaPesqData, TotalEntradaUsuario,  } from "./controllers/entradaController.js"
import { saidaCategoriasData, saidaCreate, saidaDestroy, saidaIndex, saidaPesq, saidaproximos, saidapassadas, TotalSaidaUsuario } from "./controllers/saidaController.js"

const router = Router()



router.get(`/entradas`,entradaIndex)
      .post(`/entradas`,entradaCreate)
      .delete(`/entradas/:id`,entradaDestroy)
      .get(`/entradas/:id`,entradapesq)
      .get('/graphEntradas/:id',entradaCategorias )
      .get('/pesqData/:id', entradaPesqData)
      .get('/dias', entradaGraphDias)
      .get('/totalEntradas/:id',TotalEntradaUsuario )





router.get(`/saidas`,saidaIndex)
router.post(`/saidas`,saidaCreate)
router.delete(`/saidas`,saidaDestroy)
router.get(`/saidas/:id`,saidaPesq)
      .get('/graphSaidas/:id',saidaCategoriasData )
      .get('/graphproximos/:id',saidaproximos )
      .get('/graphpassadas/:id',saidapassadas )
      .get('/totalSaidas/:id',TotalSaidaUsuario )





router.get('/usuarios', usuarioIndex)//verificaLogin
      .post('/usuarios', usuarioCreate)
      .put('/usuarios', usuarioAlteraSenha)
         
router.get('/login2', loginUsuario)
      .post("/login", login)

export default router
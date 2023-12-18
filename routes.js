import { Router } from "express"
import { login, usuarioAlteraSenha, usuarioCreate, usuarioIndex } from "./controllers/usuarioController.js"
import { loginUsuario } from "./controllers/loginController.js"
import { verificaLogin } from "./middlewares/verificaLogin.js"

import { entradaDestroy, entradaCreate, entradaIndex, entradapesq,  entradaGraphDias, entradaCategorias, entradaPesqData, TotalEntradaUsuario, TotalEntradaAnual,  } from "./controllers/entradaController.js"
import { TotalDespesasAno, TotalSaidaUsuario, saidaCategoriasData, saidaCreate, saidaDestroy, saidaIndex, saidaMetodoData, saidaPesq, saidapassadas, saidaproximos, teste } from "./controllers/saidaController.js"
import { SaldoLiquidoUsuario } from "./controllers/saldoController.js"

const router = Router()



router.get(`/entradas`,entradaIndex)
      .post(`/entradas`,entradaCreate)
      .delete(`/entradas/:id`,entradaDestroy)
      .get(`/entradas/:id`,entradapesq)
      .get('/graphEntradas/:id',entradaCategorias )
      .get('/pesqData/:id', entradaPesqData)
      .get('/dias', entradaGraphDias)
      .get('/totalEntradas/:id',TotalEntradaUsuario )
      .get('/totalEntradasAno/:id',TotalEntradaAnual )





router.get(`/saidas`,saidaIndex)
router.post(`/saidas`,saidaCreate)
router.delete(`/saidas`,saidaDestroy)
router.get(`/saidas/:id`,saidaPesq)
      .get('/graphSaidas/:id',saidaCategoriasData )
      .get('/graphproximos/:id',saidaproximos )
      .get('/graphpassadas/:id',saidapassadas )
      .get('/totalSaidas/:id',TotalSaidaUsuario )
      .get('/graphMetodoValorData/:id',saidaMetodoData )
      .get('/graphValorParcela/:id',teste )
      .get('/totalDespesasAno/:id',TotalDespesasAno )




router.get('/saldoAnual/:id',SaldoLiquidoUsuario )


router.get('/usuarios', usuarioIndex)//verificaLogin
      .post('/usuarios', usuarioCreate)
      .put('/usuarios', usuarioAlteraSenha)
         
router.get('/login2', loginUsuario)
      .post("/login", login)

export default router
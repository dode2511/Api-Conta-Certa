import { Entrada } from '../models/Entrada.js'

export const entradaIndex = async (req, res) => {
  try {
    const entrada = await Entrada.findAll()
    res.status(200).json(entrada)
  } catch (error) {
    res.status(400).send(error)
  }
}




export const entradaCreate = async (req, res) => {
  const { valor, metodo, descricao, categoria, data, usuario_id,parcelas} = req.body

  if (!descricao || !usuario_id || !valor || !categoria || !data ) {
    res.status(400).json({ id: 0, msg: "Erro... Informe os dados" })
    return
  }

  try {
    const entrada = await Entrada.create({
      descricao, metodo, valor, categoria, data,usuario_id,parcelas
    });
    res.status(201).json(entrada)
  } catch (error) {
    res.status(400).send(error)
  }
}

export const entradaDestroy = async (req, res) => {
  const { id } = req.params

  try {
    await Entrada.destroy({ where: { id } });
    res.status(200).json({ msg: "Ok! Removido com Sucesso" })
  } catch (error) {
    res.status(400).send(error)
  }
}

export const entradapesq = async (req, res) => {
  const { id } = req.params

  try {
    const entrada = await Entrada.findByPk(id)
    res.status(200).json(entrada)
  } catch (error) {
    res.status(400).send(error)
  }
}




export const entradaCatGrafico = async (req, res) =>{
  try {
  const dadosAgrupados = await Entrada.findAll({
    attributes: ['categoria', [sequelize.fn('COUNT', 'id'), 'total']],
    group: ['categoria'],
  });

  res.json(dadosAgrupados);
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Erro interno do servidor' });
}
}






export const entradaGraphDias = async (req, res) => {

  const data = new Date()           
  data.setDate(data.getDate() - 7)  

  const dia = data.getDate().toString().padStart(2, "0")
  const mes = (data.getMonth() + 1).toString().padStart(2, "0")
  const ano = data.getFullYear()

  const atras_7 = ano + "-" + mes + "-" + dia

  try {
    const entrada = await Entrada.findAll({
      attributes: [
        [sequelize.fn('DAY', sequelize.col('data')), "dia"],
        [sequelize.fn('MONTH', sequelize.col('data')), "mes"],
        'valor',
        [sequelize.fn('count', sequelize.col('id')), 'num']],
      group: [
        sequelize.fn('DAY', sequelize.col('data')),
        sequelize.fn('MONTH', sequelize.col('data')),
        'valor'],
      where: { data: { [Op.gte]: atras_7 } }
    });
    res.status(200).json(entrada)
  } catch (error) {
    res.status(400).send(error)
  }
}
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
    const entrada = await Entrada.findAll({
      attributes: ['categoria', [sequelize.fn('COUNT', 'id'), 'total']],
      group: ['categoria'],
    });

    res.json(entrada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

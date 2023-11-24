import { Saida } from '../models/Saida.js'

export const saidaIndex = async (req, res) => {
  try {
    const saida = await Saida.findAll()
    res.status(200).json(saida)
  } catch (error) {
    res.status(400).send(error)
  }
}




export const saidaCreate = async (req, res) => {
  const { valor, metodo, descricao, categoria, data, } = req.body

  if (!descricao || !descricao || !valor || !categoria || !data ) {
    res.status(400).json({ id: 0, msg: "Erro... Informe os dados" })
    return
  }

  try {
    const saida = await Saida.create({
      descricao, metodo, valor, categoria, data
    });
    res.status(201).json(saida)
  } catch (error) {
    res.status(400).send(error)
  }
}

export const saidaDestroy = async (req, res) => {
  const { id } = req.params

  try {
    await Saida.destroy({ where: { id } });
    res.status(200).json({ msg: "Ok! Removido com Sucesso" })
  } catch (error) {
    res.status(400).send(error)
  }
}

export const saidaPesq = async (req, res) => {
  const { id } = req.params

  try {
    const saida = await Saida.findByPk(id)
    res.status(200).json(saida)
  } catch (error) {
    res.status(400).send(error)
  }
}
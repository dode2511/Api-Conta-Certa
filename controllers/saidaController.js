import { Saida } from '../models/Saida.js'
import { startOfMonth, endOfMonth, format, startOfDay, subDays } from 'date-fns';
import { sequelize } from '../databases/conecta.js'
import { Op } from "sequelize"
import addMonths from 'date-fns/addMonths/index.js'

export const saidaIndex = async (req, res) => {
  try {
    const saida = await Saida.findAll()
    res.status(200).json(saida)
  } catch (error) {
    res.status(400).send(error)
  }
}




export const saidaCreate = async (req, res) => {
  const { valor, metodo, descricao, categoria, data,usuario_id,num_parcelas } = req.body

  if (!descricao || !usuario_id || !valor || !categoria || !data  ) {
    res.status(400).json({ id: 0, msg: "Erro... Informe os dados" })
    return
  }

  try {
    const saida = await Saida.create({
      descricao, metodo, valor, categoria, data,usuario_id,num_parcelas
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




export const saidaCategoriasData = async (req, res) =>{
  const { id: usuario_id } = req.params;
  const { mes, ano } = req.query;

  try {
    const dadosAgrupados = await Saida.findAll({
      attributes: [
        'categoria',
         [sequelize.fn('COUNT', sequelize.col('id')), 'num']
        ],
        where: {
          usuario_id: usuario_id ,
          data: {
            [Op.between]: [
              startOfMonth(new Date(Number(ano), Number(mes) - 1)),
              endOfMonth(new Date(Number(ano), Number(mes) - 1))
            ],
        },
      },
      group: ['categoria'],
    },);
  
    res.json(dadosAgrupados);
  } catch (error) {
    console.error(error);
    res.status(400).send(error)
  }
}


export const saidaproximos = async (req, res) => {
  const { id: usuario_id } = req.params;

  try {
    const currentDate = new Date();
    const formattedCurrentDate = format(currentDate, 'yyyy-MM-dd');
    console.log('Formatted Current Date:', formattedCurrentDate);

    const dadosAgrupados = await Saida.findAll({
      where: {
        usuario_id: usuario_id,
        categoria: 'Fixos',
        data: {
          [Op.gte]: formattedCurrentDate,
        },
      },
    });

    console.log('Dados Agrupados:', dadosAgrupados);
    res.json(dadosAgrupados);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};


export const saidapassadas = async (req, res) => {
  const { id: usuario_id } = req.params;

  try {
    const dadosAgrupados = await Saida.findAll({
      where: {
        usuario_id: usuario_id,
        data: {
          [Op.lt]: new Date(), // Menor que a data atual
        },
      },
    });

    console.log('Dados Agrupados:', dadosAgrupados);
    res.json(dadosAgrupados);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};
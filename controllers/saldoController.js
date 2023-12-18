import { Op } from 'sequelize';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { Saida } from '../models/Saida.js';
import { Entrada } from '../models/Entrada.js'
import { sequelize } from '../databases/conecta.js'


export const SaldoLiquidoUsuario = async (req, res) => {
  const { id: usuario_id } = req.params;
  const { ano } = req.query;

  try {
    const saldosPorMes = [];
    for (let mes = 1; mes <= 12; mes++) {
      const dataInicio = startOfMonth(new Date(Number(ano), mes - 1));
      const dataFim = endOfMonth(new Date(Number(ano), mes - 1));

      const entradas = await Entrada.findAll({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('valor')), 'total'],
        ],
        where: {
          usuario_id: usuario_id,
          data: {
            [Op.between]: [dataInicio, dataFim],
          },
        },
      });

      const saidas = await Saida.findAll({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('valor')), 'total'],
        ],
        where: {
          usuario_id: usuario_id,
          data: {
            [Op.between]: [dataInicio, dataFim],
          },
        },
      });

      const nomeMes = format(dataInicio, 'MMMM'); 

      
      const saldoLiquido = (entradas[0]?.dataValues.total || 0) - (saidas[0]?.dataValues.total || 0);

      saldosPorMes.push({
        mes: mes,
        nomeMes: nomeMes,
        saldoLiquido: saldoLiquido,
      });
    }

    res.json(saldosPorMes);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};
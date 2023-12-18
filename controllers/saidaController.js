import { Saida } from '../models/Saida.js';
import { startOfMonth, endOfMonth, format, startOfDay, subDays  } from 'date-fns';
import {  utcToZonedTime } from 'date-fns-tz'
import { sequelize } from '../databases/conecta.js'
import { Op } from "sequelize"
import addMonths from 'date-fns/addMonths/index.js'
import { ParcelasSaidas } from '../models/ParcelasSaidas.js';

export const saidaIndex = async (req, res) => {
  try {
    const saida = await  Saida.findAll()
    res.status(200).json(saida)
  } catch (error) {
    res.status(400).send(error)
  }
}





export const saidaCreate = async (req, res) => {
  const { valor, metodo, descricao, categoria, data, usuario_id,num_parcelas} = req.body

  if (!descricao || !usuario_id || !valor || !categoria || !data ) {
    res.status(400).json({ id: 0, msg: "Erro... Informe os dados" })
    return
  }

  const calcularDataVencimento = (dataSaida, numeroParcela) => {
    const mesesParaVencimento = numeroParcela; 
    return addMonths(new Date(dataSaida), mesesParaVencimento);
  };
    let transaction;
  try {
    transaction = await sequelize.transaction();
    const valorParcela = (valor/num_parcelas).toFixed(2);


    const saida = await Saida.create({
      descricao, metodo, valor, categoria, data,usuario_id,num_parcelas
    },{transaction});

    const parcelasData = Array.from({ length: num_parcelas }, (_, index) => ({
      num: index + 1,
      valor_parcela: parseFloat(valorParcela),
      data_vencimento: calcularDataVencimento(data, index + 1),
      transacao_id: saida.id,
      usuario_id: saida.usuario_id
    }));
    const parcelasCriadas = await ParcelasSaidas.bulkCreate(parcelasData, { transaction });

    await transaction.commit();


    const respostaJSON = {
      saida: saida.toJSON(),
      parcelas: parcelasCriadas.map(parcela => parcela.toJSON())
    };

    res.status(201).json(respostaJSON)
  } catch (error) {

    if (transaction) await transaction.rollback();

    console.error('Erro ao criar saida com parcelas:', error);
    res.status(400).send(error);
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
         [sequelize.fn('COUNT', sequelize.col('id')), 'num'],

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





export const saidaMetodoData = async (req, res) => {
  const { id: usuario_id } = req.params;
  const { mes, ano } = req.query;

  try {
    const dadosAgrupados = await Saida.findAll({
      attributes: [
        'metodo',
         [sequelize.fn('COUNT', sequelize.col('id')), 'num'],
         [sequelize.fn('SUM', sequelize.col('valor')), 'total']

        ],
        where: {
          usuario_id: usuario_id ,
          data: {
            [Op.between]: [
              startOfMonth(new Date(Number(ano), Number(mes) - 1)),
              endOfMonth(new Date(Number(ano), Number(mes) - 1))
            ],
        },
        num_parcelas: 0,
      },
      group: ['metodo'],
    },);
  
    res.json(dadosAgrupados);
  } catch (error) {
    console.error(error);
    res.status(400).send(error)
  }
}


export const teste = async (req, res) => {
  const { id: usuario_id } = req.params;
  const { mes, ano } = req.query;

  try {
    const dadosAgrupados = await ParcelasSaidas.findAll({
      attributes: [
  
         [sequelize.fn('SUM', sequelize.col('valor_parcela')), 'total_parcela']

        ],
        where: {
          usuario_id: usuario_id ,
          data_vencimento: {
            [Op.between]: [
              startOfMonth(new Date(Number(ano), Number(mes) - 1)),
              endOfMonth(new Date(Number(ano), Number(mes) - 1))
            ],
        },
      },
      
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



export const TotalSaidaUsuario = async (req, res) =>{
  const { id: usuario_id } = req.params;
  const { mes, ano } = req.query;

  try {
    const dadosAgrupados = await Saida.findAll({
      attributes: [
        
         [sequelize.fn('SUM', sequelize.col('valor')), 'total']
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
    },);
  
    res.json(dadosAgrupados);
  } catch (error) {
    console.error(error);
    res.status(400).send(error)
  }
}



export const TotalDespesasAno = async (req, res) => {
  const { id: usuario_id } = req.params;
  const { ano } = req.query;

  try {
    const totalsPorMes = [];
    for (let mes = 1; mes <= 12; mes++) {
      const dataInicio = startOfMonth(utcToZonedTime(new Date(Number(ano), mes - 1), 'UTC'));
      const dataFim = endOfMonth(utcToZonedTime(new Date(Number(ano), mes - 1), 'UTC'));

      const dadosAgrupados = await Saida.findAll({
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

      const nomeMes = format(dataInicio, 'MMMM', { timeZone: 'UTC' }); // Obtém o nome do mês em UTC

      // Adiciona o total, o mês e o nome do mês ao array
      totalsPorMes.push({
        mes: mes,
        nomeMes: nomeMes,
        total: dadosAgrupados[0]?.dataValues.total || 0,
      });
    }

    res.json(totalsPorMes);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};


export const saidaMesIdex = async (req, res) => {
  const { id: usuario_id } = req.params;
  const { mes,ano } = req.query;
 try {
  const dadosAgrupados = await Saida.findAll({
      where: {
        usuario_id: usuario_id ,
        data: {
          [Op.between]: [
            startOfMonth(new Date(Number(ano), Number(mes) - 1)),
            endOfMonth(new Date(Number(ano), Number(mes) - 1))
          ],
      },
    },
  },);

  res.json(dadosAgrupados);
} catch (error) {
  console.error(error);
  res.status(400).send(error)
}
}

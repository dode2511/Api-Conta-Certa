import { Entrada } from '../models/Entrada.js'
import { Op } from "sequelize"
import { sequelize } from '../databases/conecta.js'
import { Parcelas } from '../models/Parcelas.js'
import Transaction from 'sequelize'
import addMonths from 'date-fns/addMonths/index.js'
import { startOfMonth, endOfMonth } from 'date-fns';

export const entradaIndex = async (req, res) => {
  try {
    const entrada = await Entrada.findAll()
    res.status(200).json(entrada)
  } catch (error) {
    res.status(400).send(error)
  }
}





export const entradaDestroy = async (req, res) => {
  const { id } = req.body

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




export const entradaCategorias = async (req, res) =>{
  const { id: usuario_id } = req.params;
  const { mes, ano } = req.query;

  try {
    const dadosAgrupados = await Entrada.findAll({
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




export const entradaCreate = async (req, res) => {
  const { valor, metodo, descricao, categoria, data, usuario_id,num_parcelas} = req.body

  if (!descricao || !usuario_id || !valor || !categoria || !data ) {
    res.status(400).json({ id: 0, msg: "Erro... Informe os dados" })
    return
  }

  const calcularDataVencimento = (dataEntrada, numeroParcela) => {
    const mesesParaVencimento = numeroParcela; 
    return addMonths(new Date(dataEntrada), mesesParaVencimento);
  };
    let transaction;
  try {
    transaction = await sequelize.transaction();
    const valorParcela = (valor/num_parcelas).toFixed(2);


    const entrada = await Entrada.create({
      descricao, metodo, valor, categoria, data,usuario_id,num_parcelas
    },{transaction});

    const parcelasData = Array.from({ length: num_parcelas }, (_, index) => ({
      num: index + 1,
      valor_parcela: parseFloat(valorParcela),
      data_vencimento: calcularDataVencimento(data, index + 1),
      transacao_id: entrada.id,
      usuario_id: entrada.usuario_id
    }));
    const parcelasCriadas = await Parcelas.bulkCreate(parcelasData, { transaction });

    await transaction.commit();


    const respostaJSON = {
      entrada: entrada.toJSON(),
      parcelas: parcelasCriadas.map(parcela => parcela.toJSON())
    };

    res.status(201).json(respostaJSON)
  } catch (error) {

    if (transaction) await transaction.rollback();

    console.error('Erro ao criar entrada com parcelas:', error);
    res.status(400).send(error);
  }
}
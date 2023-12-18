import { DataTypes } from 'sequelize';
import { sequelize } from '../databases/conecta.js';
import { Usuario } from './Usuario.js';

import { Saida } from './Saida.js';



export const ParcelasSaidas = sequelize.define('parcelassaidas', {
    id_: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    valor_parcela: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    num: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    data_vencimento: {
      type: DataTypes.TEXT(100),
      allowNull: false
    }
  }, {
    paranoid: true,
    timestamps: false
  });


  ParcelasSaidas.belongsTo(Usuario, {
    foreignKey: {
      name: 'usuario_id',
      allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })

  

  ParcelasSaidas.belongsTo(Saida, {
    foreignKey: {
      name: 'transacao_id',
      allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })

  
Saida.hasMany(ParcelasSaidas, {
    foreignKey: 'transacao_Id'
  })



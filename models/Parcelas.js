import { DataTypes } from 'sequelize';
import { sequelize } from '../databases/conecta.js';
import { Usuario } from './Usuario.js';
import { Entrada } from './Entrada.js';
import { Saida } from './Saida.js';



export const Parcelas = sequelize.define('parcelas', {
    id: {
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


  Parcelas.belongsTo(Usuario, {
    foreignKey: {
      name: 'usuario_id',
      allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })

  

  Parcelas.belongsTo(Entrada, {
    foreignKey: {
      name: 'transacao_id',
      allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })

  
Entrada.hasMany(Parcelas, {
    foreignKey: 'transacao_Id'
  })



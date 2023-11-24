import { DataTypes } from 'sequelize';
import { sequelize } from '../databases/conecta.js';
import { Usuario } from './Usuario.js';



export const Saida = sequelize.define('saida', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    valor: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    categoria: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT(100),
      allowNull: false
    },
    metodo: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    data: {
      type: DataTypes.DATE(),
      allowNull: false
    },
  }, {
    paranoid: true
  },{
    timestamps: false,
  });


  Saida.belongsTo(Usuario, {
    foreignKey: {
      name: 'usuario_id',
      allowNull: false
    },
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })

  
Usuario.hasMany(Saida, {
    foreignKey: 'usuario_Id'
  })
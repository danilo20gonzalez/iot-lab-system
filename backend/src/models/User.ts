import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class Usuario extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
  public email!: string;
  public rolId!: number;
  public creadoEn!: Date;
}

Usuario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
    },
    rolId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: [[1, 2]], // Solo permite los roles con id 1 (admin) y 2 (operador)
      },
    },
    creadoEn: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: false,
  }
);

export default Usuario;
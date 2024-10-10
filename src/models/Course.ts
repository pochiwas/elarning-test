import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Course extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
}

Course.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
}, {
  sequelize,
  tableName: 'Courses',
});

export default Course;

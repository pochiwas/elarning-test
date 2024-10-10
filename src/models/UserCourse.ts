import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class UserCourse extends Model {
  public userId!: number;
  public courseId!: number;
}

UserCourse.init({
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  courseId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
}, {
  sequelize,
  tableName: 'UserCourses',
});

export default UserCourse;

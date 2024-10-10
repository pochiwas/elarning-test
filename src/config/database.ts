import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno desde .env

const sequelize = new Sequelize(
  process.env.DB_NAME!, // Nombre de la base de datos
  process.env.DB_USER!, // Usuario de la base de datos
  process.env.DB_PASSWORD!, // Contraseña de la base de datos
  {
    host: process.env.DB_HOST, // Host del servidor de MySQL
    dialect: 'mysql', // Motor de base de datos
    logging: false, // Desactivar el logging de SQL (opcional)
  }
);

export default sequelize;

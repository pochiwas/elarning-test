import express, { Application } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import sequelize from "./config/database";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import courseRoutes from "./routes/course.routes";

// Cargar variables de entorno desde .env
dotenv.config();

const app: Application = express();

// Middleware para parsear JSON
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/*+json" }));
app.use(cors());

// Rutas

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/courses", courseRoutes);


// Conectar a la base de datos y arrancar el servidor
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos exitosa.");

    // Sincroniza los modelos con la base de datos
    await sequelize.sync({ force: false }); // Cambiar a true si quieres recrear las tablas en cada inicio

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  }
};

startServer();
export default app;

FROM node:22-alpine

# Carpeta de trabajo
WORKDIR /app

# Copiamos dependencias primero (mejor cache)
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del proyecto
COPY . .

# Exponemos el puerto de Angular
EXPOSE 4200

# Comando para levantar Angular en modo dev
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--port", "4200"]
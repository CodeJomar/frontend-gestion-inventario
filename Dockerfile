# Imagen base de Node.js (versión 23)
FROM node:23-alpine

# Directorio de trabajo
WORKDIR /app

# Copiamos dependencias
COPY package.json package-lock.json* ./
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto donde Next.js servirá la app
EXPOSE 3000

# Modo desarrollo
CMD ["npm", "run", "dev"]

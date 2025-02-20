# Imagen base de Node.js (usamos la versión LTS)
FROM node:16 AS build

# Definir el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias de Angular
RUN npm install

# Copiar el código fuente de la aplicación
COPY . .

# Construir la aplicación Angular para producción
RUN npm run build --prod

# Servir la aplicación Angular usando un servidor HTTP (nginx)
FROM nginx:alpine

# Copiar los archivos de la aplicación Angular construidos en la etapa anterior
COPY --from=build /app/dist/motion-parts-angular /usr/share/nginx/html

# Exponer el puerto 80 (nginx por defecto)
EXPOSE 80

# Iniciar nginx para servir la aplicación
CMD ["nginx", "-g", "daemon off;"]

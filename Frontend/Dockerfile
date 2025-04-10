# Etapa 1: Construcción con Node.js
FROM node:slim AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia archivos de dependencias
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Compila la aplicación Angular para producción
RUN npm run build --configuration=production

# Etapa 2: Servir con Nginx
FROM nginx:1.27.4-alpine-slim

# Elimina configuración por defecto de nginx (opcional pero recomendado)
RUN rm -rf /usr/share/nginx/html/*

# Copia la app compilada desde la etapa anterior
COPY --from=build /app/dist/nombre-del-proyecto-angular/browser /usr/share/nginx/html

# (Opcional) Copia configuración personalizada de nginx si la tienes
COPY default.conf /etc/nginx/conf.d/default.conf

# Expone el puerto 80
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]

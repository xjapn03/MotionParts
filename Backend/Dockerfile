# Usar la imagen base de OpenJDK 21
FROM openjdk:21-jdk-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el archivo JAR generado por Spring Boot desde la carpeta target
COPY target/ecommerce-backend.jar /app/ecommerce-backend.jar

# Exponer el puerto 8080
EXPOSE 8080

# Ejecutar la aplicación Spring Boot
CMD ["java", "-jar", "ecommerce-backend.jar"]

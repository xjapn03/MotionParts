# Usar la imagen base de OpenJDK 21
FROM openjdk:21-jdk-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el archivo JAR generado por Spring Boot desde la carpeta target
COPY build/libs/ecommerce-0.0.1-SNAPSHOT.jar app.jar


# Exponer el puerto 8080
EXPOSE 8080

# Ejecutar la aplicación Spring Boot
CMD ["java", "-jar", "app.jar"]

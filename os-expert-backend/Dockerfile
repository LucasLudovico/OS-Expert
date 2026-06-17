# Stage 1: Build
FROM maven:3.8.5-eclipse-temurin-17 AS build

# Define o diretório de trabalho na raiz do container
WORKDIR /app

# Copia tudo (incluindo o pom pai e a pasta do backend)
COPY . .

# Compila tudo a partir do diretório /app
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copia apenas o jar final da subpasta para a raiz do container
COPY --from=build /app/os-expert-backend/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
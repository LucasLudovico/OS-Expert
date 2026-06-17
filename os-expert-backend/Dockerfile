# Stage 1: Build
FROM maven:3.8.5-eclipse-temurin-17 AS build
WORKDIR /app

# Copia primeiro os poms para resolver dependências de cache
COPY pom.xml .
COPY os-expert-backend/pom.xml ./os-expert-backend/

# Copia o restante do código
COPY . .

# Compila a partir da raiz
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copia o jar resultante para a raiz do container
COPY --from=build /app/os-expert-backend/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
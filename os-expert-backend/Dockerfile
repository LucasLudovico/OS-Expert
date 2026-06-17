# Stage 1: Build
FROM maven:3.8.5-eclipse-temurin-17 AS build
COPY . .
# Compila tudo a partir da raiz para garantir que o parent POM seja lido
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:17-jre-jammy
# Copia o jar gerado dentro da pasta do backend para a raiz da imagem
COPY --from=build /os-expert-backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]
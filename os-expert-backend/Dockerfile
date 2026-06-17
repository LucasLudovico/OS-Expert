# Stage 1: Build
FROM maven:3.8.5-openjdk-17 AS build
COPY . .
# Compila apenas o módulo do backend
RUN mvn clean package -pl os-expert-backend -DskipTests

# Stage 2: Run
FROM openjdk:17-jdk-slim
# Copia o jar do módulo do backend para a raiz
COPY --from=build /os-expert-backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]
# Stage 1: Build
FROM maven:3.8.5-eclipse-temurin-17 AS build
COPY . .
# Compila apenas o módulo do backend
RUN mvn clean package -pl os-expert-backend -DskipTests

# Stage 2: Run
FROM eclipse-temurin:17-jre-jammy
# Copia o jar do módulo do backend para a raiz
COPY --from=build /os-expert-backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]
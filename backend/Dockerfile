# Stage 1: Build the application using Maven and Eclipse Temurin JDK 21
FROM maven:3.9.3-eclipse-temurin-21 AS build

WORKDIR /app

# Copy only the pom.xml first to leverage caching of dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the source code
COPY src ./src

# Build the application and skip tests for faster build
RUN mvn clean package -DskipTests

# Stage 2: Run the application with a lightweight JRE base image
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy the jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Use the PORT environment variable provided by Render or default to 8080
ENV PORT=8080

# Run the Spring Boot application binding to the PORT environment variable
ENTRYPOINT ["sh", "-c", "java -jar /app/app.jar --server.port=$PORT"]
FROM eclipse-temurin:19-alpine
RUN mkdir /opt/app
RUN echo -e "DB_URL=jdbc:postgresql://postgres:5432/articlelate\nUSER=runner\nPASS=postgres" > .env
EXPOSE 8080
COPY restapi-0.0.1-SNAPSHOT.jar /opt/app
CMD ["java", "-jar", "/opt/app/restapi-0.0.1-SNAPSHOT.jar"]

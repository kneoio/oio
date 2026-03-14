FROM eclipse-temurin:21-jre-jammy
RUN groupadd -r oio && useradd -r -g oio oio
WORKDIR /app
COPY target/oio-*-runner.jar app.jar
RUN chown oio:oio app.jar
USER oio
EXPOSE 8080 38798
ENTRYPOINT ["java", "--add-opens=java.base/java.lang=ALL-UNNAMED", "--add-opens=java.base/java.lang.invoke=ALL-UNNAMED", "-jar", "app.jar"]

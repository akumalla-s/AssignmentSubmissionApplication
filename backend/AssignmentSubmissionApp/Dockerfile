# Stage 1: Build the application
FROM adoptopenjdk/openjdk11:ubi as build

# Set the current working directory inside the image
WORKDIR /app

# Copy maven executable to the image
COPY mvnw .
COPY .mvn .mvn

# Copy the pom.xml file
COPY pom.xml .

# Build all the dependencies in preparation to go offline.
RUN ./mvnw dependency:go-offline -B

# Copy the project source
COPY src src

# Package the application
RUN ./mvnw package -DskipTests
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)


# Stage 2: Create the final image
FROM adoptopenjdk/openjdk11:ubi

ARG DEPENDENCY=/app/target/dependency

# Set the working directory inside the image
WORKDIR /app

# Copy project dependencies from the build stage
COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app

# Specify the command to run your application
ENTRYPOINT ["java", "-cp", "app:app/lib/*", "com.srinredd.assignmentsubmissionapp.AssignmentSubmissionApplication"]
#ENTRYPOINT ["java", "-cp", "/app/app:/app/lib/*", "com.srinredd.assignmentsubmissionapp.AssignmentSubmissionApplication"]

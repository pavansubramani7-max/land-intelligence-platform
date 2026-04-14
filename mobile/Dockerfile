FROM ubuntu:22.04
RUN apt-get update && apt-get install -y curl git unzip xz-utils zip libglu1-mesa
RUN git clone https://github.com/flutter/flutter.git /flutter -b stable
ENV PATH="/flutter/bin:$PATH"
RUN flutter doctor
WORKDIR /app
COPY pubspec.yaml .
RUN flutter pub get
COPY . .
RUN flutter build apk --release

FROM golang:1.27-alpine AS builder
WORKDIR /src
COPY go.mod go.sum ./
RUN apk add --no-cache git
RUN go mod download
COPY . .
WORKDIR /src
RUN go build -o /usr/local/bin/backend .

FROM alpine:3.18
RUN addgroup -S app && adduser -S app -G app
COPY --from=builder /usr/local/bin/backend /usr/local/bin/backend
USER app
EXPOSE 8080
ENV ALLOWED_ORIGIN=""
ENTRYPOINT ["/usr/local/bin/backend"]

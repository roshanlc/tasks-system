FROM golang:1.22.3-alpine3.20 AS build
WORKDIR /app
COPY . .
RUN go build -ldflags "-s -w" -o /app/main .

FROM alpine:3.20
COPY --from=build /app/main /app/main
RUN touch /app/.env
RUN touch .env
# Set environment variables here
EXPOSE 9000
ENV GIN_MODE release
CMD ["/app/main"]
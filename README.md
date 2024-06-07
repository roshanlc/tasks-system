# Tasks management

### Details:
- Database: postgres
- Backend: Go 
- Frontend: React

## 1. Run Application
- Make sure you have docker compose installed on your machine
- Follow the steps
  ```bash
  # clone the repository
  git clone https://github.com/roshanlc/tasks-system

  cd tasks-system

  # run the compose file
  docker compose up

  # Might take a minute or two depending on your system
  # Backend will be live at: http://localhost:9000
  # Frontend will be  live at: http://localhost:9001
  ```

## 2. Run Tests

## Backend

```bash
cd backend

# test controllers (http handlers)
go test ./controller -v

# test services
go test ./service -v
```

## Frontend
- Make sure the system is up
```bash
cd frontend

# run tests
pnpm run test
```
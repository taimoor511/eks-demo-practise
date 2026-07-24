# Task Manager — Dummy Microservice App

A minimal 3-tier microservice demo:

- **frontend** — React (Vite), served by nginx, proxies `/api` to backend
- **backend** — Node.js/Express REST API for tasks
- **database** — MongoDB

```
/frontend   React app (Task Manager UI)
/backend    Express API (CRUD for tasks)
docker-compose.yml
```

## Run locally with Docker Compose

```bash
docker compose up --build
```

Then open http://localhost — the UI talks to the backend via nginx, which
proxies `/api` to the `backend` container, which talks to the `mongo`
container.

To stop:

```bash
docker compose down
```

To also wipe the Mongo data volume:

```bash
docker compose down -v
```

## Run without Docker (dev mode)

Backend:

```bash
cd backend
cp .env.example .env   # edit MONGO_URI to point at a local Mongo
npm install
npm run dev            # http://localhost:5000
```

Frontend:

```bash
cd frontend
npm install
npm run dev             # http://localhost:3000, proxies /api to :5000
```

## API

| Method | Path              | Description       |
|--------|-------------------|--------------------|
| GET    | /api/tasks        | List tasks         |
| POST   | /api/tasks        | Create a task      |
| PUT    | /api/tasks/:id    | Update a task      |
| DELETE | /api/tasks/:id    | Delete a task      |

## Deploying to EC2 with Docker

1. Provision an EC2 instance (Amazon Linux 2023 or Ubuntu), open inbound
   port 80 (and 22 for SSH) in its security group.
2. Install Docker + the Compose plugin on the instance:
   ```bash
   sudo yum install -y docker            # Amazon Linux
   sudo systemctl enable --now docker
   sudo usermod -aG docker $USER         # log out/in after this
   DOCKER_CONFIG=${DOCKER_CONFIG:-$HOME/.docker}
   mkdir -p $DOCKER_CONFIG/cli-plugins
   curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
     -o $DOCKER_CONFIG/cli-plugins/docker-compose
   chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose
   ```
3. Copy this project to the instance (`git clone` or `scp`).
4. From the project root:
   ```bash
   docker compose up --build -d
   ```
5. Visit `http://<ec2-public-ip>` in a browser.

For a longer-lived setup, put the compose stack behind an Elastic IP and/or
an Application Load Balancer, and consider moving Mongo to a managed
service (Atlas or DocumentDB) instead of the in-container volume.

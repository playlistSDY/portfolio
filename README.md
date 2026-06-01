# Son Dongyeol Portfolio

Responsive animated portfolio website for a system builder and infrastructure engineer.

## Local Run

```bash
python -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Open `http://localhost:8000`.

## Docker Compose

```bash
docker compose up --build
```

Open `http://localhost:8000`.

## Project Links And Images

Project detail content is managed in `app/static/app.js` under `projectData`.

To add service links:

```js
links: [
  { label: "Service", url: "https://example.com" },
  { label: "GitHub", url: "https://github.com/..." },
]
```

To add photos or screenshots, place files in `app/static/assets/projects/`.
The expected filenames are listed in `app/static/assets/projects/README.md`.

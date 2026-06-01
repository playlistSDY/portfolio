from pathlib import Path

from fastapi import FastAPI, Request, Response
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr, Field
from starlette.middleware.gzip import GZipMiddleware


BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"


class ContactMessage(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    email: EmailStr
    message: str = Field(min_length=8, max_length=1200)


app = FastAPI(
    title="Son Dongyeol Portfolio",
    description="Responsive animated portfolio for a system builder and infrastructure engineer.",
    version="1.0.0",
)
app.add_middleware(GZipMiddleware, minimum_size=1000)


@app.middleware("http")
async def cache_static_assets(request: Request, call_next) -> Response:
    response = await call_next(request)
    if request.url.path.startswith("/static/assets/"):
        response.headers["Cache-Control"] = "public, max-age=31536000, immutable"
    return response


app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.get("/")
def index() -> FileResponse:
    return FileResponse(STATIC_DIR / "index.html")


@app.head("/")
def index_head() -> FileResponse:
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/robots.txt", include_in_schema=False)
def robots_txt() -> FileResponse:
    return FileResponse(STATIC_DIR / "robots.txt", media_type="text/plain")


@app.post("/api/contact")
def contact(message: ContactMessage) -> dict[str, str]:
    # Replace this with email, Discord, Slack, or database persistence when needed.
    return {
        "status": "received",
        "message": f"{message.name}님의 메시지를 받았습니다.",
    }

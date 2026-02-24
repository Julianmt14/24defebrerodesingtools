# Build stage
FROM python:3.11-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Production stage
FROM python:3.11-slim

WORKDIR /app

# Install runtime dependencies and ODAFileConverter
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 wget \
    && wget -qO /tmp/oda.deb "https://www.opendesign.com/guestfiles/get?filename=ODAFileConverter_QT6_lnxX64_8.3dll_26.12.deb" \
    && apt-get install -y /tmp/oda.deb \
    && rm /tmp/oda.deb \
    && rm -rf /var/lib/apt/lists/*

# Copy installed packages from builder
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH
ENV PYTHONPATH=/app

# Copy application code
COPY . .

# Expose port
EXPOSE 8001

# Run migrations and start server
CMD ["sh", "-c", "alembic upgrade head && uvicorn app:app --host 0.0.0.0 --port ${PORT:-8001}"]

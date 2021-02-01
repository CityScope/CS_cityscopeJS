FROM python:3.7.4-slim

EXPOSE 8080

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    git \
    && apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENV WORKDIR /app/

WORKDIR ${WORKDIR}

COPY Pipfile Pipfile.lock ${WORKDIR}

RUN pip install pipenv --no-cache-dir && \
    pipenv install --system --deploy && \
    pip uninstall -y pipenv virtualenv-clone virtualenv

COPY . $WORKDIR

ENV WORKER 8
ENV PORT 8080
ENV HOST 0.0.0.0
ENV REDISHOST namaphdb

CMD gunicorn -w ${WORKER} -k uvicorn.workers.UvicornWorker main:app --bind ${HOST}:${PORT}

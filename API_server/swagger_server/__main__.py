#!/usr/bin/env python3

import connexion

from swagger_server import encoder
from connexion.middleware import MiddlewarePosition
from starlette.middleware.cors import CORSMiddleware


def main():
    app = connexion.App(__name__, specification_dir='./swagger/')

    app.add_middleware(
        CORSMiddleware,
        position=MiddlewarePosition.BEFORE_EXCEPTION,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.app.json_encoder = encoder.JSONEncoder
    app.add_api('swagger.yaml', arguments={'title': 'Indexing API'}, pythonic_params=True)
    cors = CORS(app)
    app.run(port=8080)


if __name__ == '__main__':
    main()

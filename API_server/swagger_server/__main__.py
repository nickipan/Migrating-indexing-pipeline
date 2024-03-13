#!/usr/bin/env python3

import connexion

from swagger_server import encoder
# from connexion.middleware import MiddlewarePosition
# from starlette.middleware.cors import CORSMiddleware
from flask_cors import CORS
from connexion.resolver import RestyResolver


def main():
    app = connexion.App(__name__, specification_dir='./swagger/')

    cors = CORS(app.app)

    app.app.json_encoder = encoder.JSONEncoder
    app.add_api('swagger.yaml', resolver=RestyResolver('seaiceservices.api'), arguments={'title': 'Indexing API'}, pythonic_params=True)

    app.run(port=8080)


if __name__ == '__main__':
    main()

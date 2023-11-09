import flask
from flask_cors import CORS
import dataclasses, json
from db.models.tournament import TournamentDAO


def create_server(db):
    app = flask.Flask(__name__)
    CORS(app)
    app.config["DEBUG"] = True

    @app.route('/', methods=['GET'])
    def home():
        tournaments = TournamentDAO.get_all_tournaments(db)
        return flask.jsonify(tournaments)

    @app.route('/api/v1/resources/tournaments/all', methods=['GET'])
    def api_all():
        tournaments = TournamentDAO.get_all_tournaments(db)
        return flask.jsonify(tournaments)

    return app
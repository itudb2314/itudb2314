import flask
from flask_cors import CORS
import dataclasses, json
from db.models.tournament import TournamentDAO
from db.models.squad import SquadDAO

def create_server(db):
    app = flask.Flask(__name__)
    CORS(app)
    app.config["DEBUG"] = True

    @app.route('/', methods=['GET'])
    def home():
        squads = SquadDAO.get_all_squads(db)
        return flask.jsonify(squads)

    @app.route('/api/v1/resources/tournaments/all', methods=['GET'])
    def api_all():
        tournaments = TournamentDAO.get_all_tournaments(db)
        return flask.jsonify(tournaments)
    
    @app.route('/api/v1/resources/squads/all', methods=['GET'])
    def api_all_squads():
        squads = SquadDAO.get_all_squads(db)
        return flask.jsonify(squads)

    return app
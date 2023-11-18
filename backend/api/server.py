import flask
from flask_cors import CORS
from dataclasses import make_dataclass
from db.models.tournament import TournamentDAO
from db.models.tournament_stage import TournamentStageDAO
from db.models.squad import SquadDAO


def create_server(db):
    app = flask.Flask(__name__)
    CORS(app)
    app.config["DEBUG"] = True

    @app.route('/tournaments', methods=['GET'])
    def get_all_tournaments():
        tournaments = TournamentDAO.get_all_tournaments(db)
        return flask.jsonify(tournaments)

    @app.route('/tournaments', methods=['POST'])
    def update_tournament():
        tournament = flask.request.get_json()["newTournament"]
        tournament = make_dataclass('Tournament', tournament.keys())(**tournament)
        tournament = TournamentDAO.update_tournament(db, tournament)
        return flask.jsonify(tournament)

    @app.route('/tournaments', methods=['DELETE'])
    def delete_tournament():
        # print body
        tournament_id = flask.request.get_json()
        print(tournament_id)
        TournamentDAO.delete_tournament(db, tournament_id)
        return flask.jsonify({})

    @app.route('/squads', methods=['GET'])
    def api_all_squads():
        squads = SquadDAO.get_all_squads(db)
        return flask.jsonify(squads)

    return app
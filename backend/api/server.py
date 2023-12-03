import flask
from flask_cors import CORS
from dataclasses import make_dataclass
from db.models.tournament import TournamentDAO
from db.models.squad import SquadDAO
from db.models.match import MatchDAO
from db.models.goal import GoalDAO
from db.models.teams import TeamsDAO
from db.models.group_standing import GroupStandingDAO
from db.models.manager import ManagerDAO
from db.models.tournament_details import TournamentDetailsDAO


def create_server(db):
    app = flask.Flask(__name__)
    CORS(app)
    app.config["DEBUG"] = True

    @app.route('/tournaments', methods=['POST'])
    def create_tournament():
        tournament = flask.request.get_json()["newTournament"]
        tournament = make_dataclass('Tournament', tournament.keys())(**tournament)
        TournamentDAO.create_tournament(db, tournament)
        return flask.jsonify({})


    @app.route('/tournaments', methods=['GET'])
    def get_all_tournaments():
        tournaments = TournamentDAO.get_all_tournaments(db)
        return flask.jsonify(tournaments)

    @app.route('/tournaments', methods=['PUT'])
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


    @app.route('/tournaments/<tournament_id>/', methods=['GET'])
    def get_tournament(tournament_id):
        details = TournamentDetailsDAO.get_tournament_details(db, tournament_id)
        return flask.jsonify(details)

    @app.route('/groupstandings', methods=['GET'])
    def api_all_group_standings():
        group_standings = GroupStandingDAO.get_all_group_standings_joined(db)
        return flask.jsonify(group_standings)

    @app.route('/squads', methods=['POST'])
    def create_squad():
        new_squad = flask.request.get_json()['newSquad']  # Fix the brackets here
        new_squad = make_dataclass('Squad', new_squad.keys())(**new_squad)
        SquadDAO.create_squad_member(db, new_squad)
        return flask.jsonify({})

    @app.route('/squads', methods=['GET'])
    def get_all_squads():
        squads = SquadDAO.get_all_squads(db)
        return flask.jsonify(squads)
        
    @app.route('/squads', methods=['PUT'])
    def update_squad():
        squad_data = flask.request.get_json()['squadData']  # Use square brackets here
        squad_data = make_dataclass('Squad', squad_data.keys())(**squad_data)
        SquadDAO.update_squad_member(db, squad_data)
        return flask.jsonify({'message': 'Squad updated successfully'})

    @app.route('/squads', methods=['DELETE'])
    def delete_squad_member():
        tournament_id = flask.request.get_json()['tournament_id']
        team_id = flask.request.get_json()['team_id']
        player_id = flask.request.get_json()['player_id']
        SquadDAO.delete_squad_member(db, tournament_id, team_id, player_id)
        return flask.jsonify({})
    
    @app.route('/matches', methods=['GET'])
    def api_all_matches():
        matches = MatchDAO.get_all_matches(db)
        return flask.jsonify(matches)
    
    @app.route('/goals', methods=['GET'])
    def api_all_goals():
        goals = GoalDAO.get_all_goals(db)
        return flask.jsonify(goals)
    
    @app.route('/matches/<match_id>', methods=['GET'])
    def api_match_by_id(match_id : str):
        match = MatchDAO.get_match_by_id(db, match_id)
        if match:
            return flask.jsonify(match), 200
        else:
            return flask.jsonify({'message': 'Match not found'}), 404
        
    @app.route('/goals/<match_id>', methods=['GET'])
    def api_goals_by_match_id(match_id : str):
        goals = GoalDAO.get_match_goals(db, match_id)
        if goals:
            return flask.jsonify(goals), 200
        else:
            return flask.jsonify({'message': 'Goals not found'}), 404

    
    @app.route('/tournaments/teams', methods=['GET'])
    def api_all_teams():
        teams = TeamsDAO.get_all_teams(db)
        return flask.jsonify(teams)
    
    @app.route('/tournaments/teams', methods=['PUT'])
    def update_teams():
        teams = flask.request.get_json()["newTeam"]
        teams = make_dataclass('Team', teams.keys())(**teams)
        teams = TeamsDAO.update_team(db, teams)
        return flask.jsonify(teams)

    
    @app.route('/tournaments/teams', methods=['DELETE'])
    def delete_teams():
        team_data = flask.request.get_json()
        team_id = team_data['team_id']  # Correctly parse the team_id
        TeamsDAO.delete_team(db, team_id)
        return flask.jsonify({'message': 'Team deleted successfully'})

    @app.route('/tournaments/teams', methods=['POST'])
    def create_teams():
        teams = flask.request.get_json()["newTeam"]
        teams = make_dataclass('Team', teams.keys())(**teams)
        TeamsDAO.create_team(db, teams)
        return flask.jsonify({})
    

    @app.route('/managers', methods=['GET'])
    def api_all_managers():
        managers = ManagerDAO.get_all_managers(db)
        return flask.jsonify(managers)

    return app

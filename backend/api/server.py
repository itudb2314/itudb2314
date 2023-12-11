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
from db.models.squad_appearance_player import SquadAppearancePlayerDAO
from db.models.confederations import ConfederationDAO
from db.models.bookings import BookingsDOA
from db.models.Player import PlayerDAO
from db.models.awards import AwardDAO


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
        tournament_id = flask.request.get_json()
        TournamentDAO.delete_tournament(db, tournament_id)
        return flask.jsonify({})
    
    @app.route('/managers', methods=['GET'])
    def api_all_managers():
        managers = ManagerDAO.get_all_managers(db)
        return flask.jsonify(managers)
    
    @app.route('/managers', methods=['POST'])
    def create_manager():
        new_manager = flask.request.get_json()['newManager']
        new_manager = make_dataclass('Manager', new_manager.keys())(**new_manager)
        ManagerDAO.insert_manager(db, new_manager)
        return flask.jsonify({})
    
    @app.route('/managers', methods=['PUT'])
    def update_manager():
        manager_data = flask.request.get_json()['managerData']
        manager_data = make_dataclass('Manager', manager_data.keys())(**manager_data)
        ManagerDAO.update_manager(db, manager_data)
        return flask.jsonify(manager_data)
    
    @app.route('/managers', methods=['DELETE'])
    def delete_manager():
        manager_id = flask.request.get_json()['manager_id']
        ManagerDAO.delete_manager(db, manager_id)
        return flask.jsonify({})

    @app.route('/tournaments/<tournament_id>/', methods=['GET'])
    def get_tournament(tournament_id):
        if tournament_id == 'WC-1950':
            details = MatchDAO.get_tournemant_matches(db, tournament_id, "final round")
            print(details)
            return flask.jsonify(details)
        details = TournamentDetailsDAO.get_tournament_details(db, tournament_id)
        return flask.jsonify(details)
    
    @app.route('/groupstanding/<tournament_id>', methods=['GET'])
    def get_group_standings(tournament_id):
        group_standings = GroupStandingDAO.get_all_group_standings_on_tournament_joined(db, tournament_id)
        return flask.jsonify(group_standings)


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
    
    # @app.route('/squadsJOINED', methods=['GET'])
    # def get_all_squads_joined():
    #     squads = SquadAppearancePlayerDAO.get_all_squads(db)
    #     return flask.jsonify(squads)
    
    @app.route('/squadsJOINED', methods=['GET'])
    def get_all_squads_joined():
        page = flask.request.args.get('page', default=0, type=int)
        items_per_page = flask.request.args.get('items_per_page', default=22, type=int)
        squads = SquadAppearancePlayerDAO.get_squads_paginated(db, page, items_per_page)
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
    
    @app.route('/squads/<tournament_id>/<team_id>', methods=['GET'])
    def get_single_squad(tournament_id, team_id):
        single_squad = SquadAppearancePlayerDAO.get_single_squad(db, tournament_id, team_id)
        if single_squad:
            return flask.jsonify(single_squad), 200
        else:
            return flask.jsonify({'message': 'Squad not found'}), 404
        
    @app.route('/matches', methods=['GET'])
    def get_all_matches():
        matches = MatchDAO.get_all_matches(db)
        return flask.jsonify(matches)
    
    @app.route('/goals', methods=['GET'])
    def get_all_goals():
        goals = GoalDAO.get_all_goals(db)
        return flask.jsonify(goals)
    
    @app.route('/matches/<match_id>', methods=['GET'])
    def get_match_by_id(match_id : str):
        match = MatchDAO.get_match_by_id(db, match_id)
        if match:
            return flask.jsonify(match), 200
        else:
            return flask.jsonify({'message': 'Match not found'}), 404

    @app.route('/goals/<match_id>', methods=['GET'])
    def get_goals_by_match_id(match_id : str):
        goals = GoalDAO.get_match_goals(db, match_id)
        if goals:
            return flask.jsonify(goals), 200
        else:
            return flask.jsonify({'message': 'Goals not found'}), 404
        
    @app.route('/matches/<match_id>', methods=['DELETE'])
    def delete_match(match_id : str):
        MatchDAO.delete_match(db, match_id)
        return flask.jsonify({'message': 'Match deleted successfully'})
    
    @app.route('/matches', methods=['POST'])
    def create_match():
        match = flask.request.get_json()['matchdata']
        match = make_dataclass('Match', match.keys())(**match)
        MatchDAO.create_match(db, match)
        return flask.jsonify({})

    @app.route('/bookings/<match_id>', methods=['GET'])
    def get_bookings_by_match_id(match_id : str):
        bookings = BookingsDOA.get_match_bookings(db, match_id)
        return flask.jsonify(bookings)

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
    

    @app.route('/confederations', methods=['GET'])
    def get_confederation_names():
        confederations = ConfederationDAO.get_confederation_names(db)
        return flask.jsonify(confederations)

    @app.route('/players', methods=['POST'])
    def create_player():
        new_player = flask.request.get_json()['newPlayer']
        new_player = make_dataclass('Player', new_player.keys())(**new_player)
        PlayerDAO.create_player(db, new_player)
        return flask.jsonify({})

    @app.route('/players', methods=['GET'])
    def get_all_players():
        players = PlayerDAO.get_all_players(db)
        return flask.jsonify(players)

    @app.route('/players/<player_id>', methods=['GET'])
    def get_player(player_id):
        player = PlayerDAO.get_player(db, player_id)
        if player:
            return flask.jsonify(player), 200
        else:
            return flask.jsonify({'message': 'Player not found'}), 404

    @app.route('/players', methods=['PUT'])
    def update_player():
        player_data = flask.request.get_json()['playerData']
        player_data = make_dataclass('Player', player_data.keys())(**player_data)
        PlayerDAO.update_player(db, player_data)
        return flask.jsonify({'message': 'Player updated successfully'})

    @app.route('/players', methods=['DELETE'])
    def delete_player():
        player_id = flask.request.get_json()['player_id']
        PlayerDAO.delete_player(db, player_id)
        return flask.jsonify({'message': 'Player deleted successfully'})


    @app.route('/awards', methods=['GET'])
    def get_all_awards():
        awards = AwardDAO.get_all_awards(db)
        return flask.jsonify(awards)


    @app.route('/awards/<tournament_filter>/<award_filter>', methods=['GET'])
    def get_all_tournament_awards(tournament_filter: str, award_filter: str):
        awards = AwardDAO.get_all_awards(db, tournament_filter, award_filter)
        return flask.jsonify(awards)

    return app

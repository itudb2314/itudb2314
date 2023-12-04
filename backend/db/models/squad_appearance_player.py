from dataclasses import dataclass
from typing import List
import mysql.connector
from db.db import db

@dataclass
class Squad:
    tournament_id: str
    team_id: str
    player_id: str
    shirt_number: int
    position_name: str
    position_code: str
    family_name: str
    given_name: str
    team_name: str
    tournament_name: str

@dataclass
class actual_squad:
    tournament_id: str
    team_id: str
    team_name: str
    tournament_name: str
    squad: List[Squad]

class SquadAppearancePlayerDAO():
    
    @staticmethod
    def get_all_squads(db: db) -> list:
        try:
            connection = db.get_connection()
            query = """
                SELECT s.tournament_id, s.team_id, s.player_id, s.shirt_number, s.position_name, s.position_code,
                    p.family_name, p.given_name, t.team_name, tr.tournament_name
                FROM squads s
                JOIN players p ON s.player_id = p.player_id
                JOIN teams t ON s.team_id = t.team_id
                JOIN tournaments tr ON s.tournament_id = tr.tournament_id
                ORDER BY s.tournament_id DESC, s.team_id ASC
                LIMIT 100
            """
            cursor = connection.cursor()
            cursor.execute(query)
            results = cursor.fetchall()
            if results is None:
                return None

            grouped_squads = {}
            for result in results:
                tournament_id, team_id, player_id, shirt_number, position_name, position_code, family_name, given_name, team_name, tournament_name = result
                key = (tournament_id, team_id, team_name, tournament_name)
                if key not in grouped_squads:
                    grouped_squads[key] = actual_squad(tournament_id, team_id, team_name, tournament_name, [])
                grouped_squads[key].squad.append(
                    Squad(tournament_id, team_id, player_id, shirt_number, position_name, position_code,
                        family_name=family_name, given_name=given_name, team_name=team_name, tournament_name=tournament_name)
                )

            return list(grouped_squads.values())
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            connection.rollback()
        finally:
            cursor.close()
            connection.close()
from dataclasses import dataclass
import mysql.connector
from db.db import db

@dataclass
class Player_apperance():
    tournament_id: str
    match_id: str
    team_id: str
    home_team: bool
    away_team: bool
    player_id: str
    shirt_number: int
    position_name: str
    position_code: str
    starter: bool
    substitute: bool

class Player_apperanceDAO():
    @staticmethod
    def create_player_apperance(db: db, player_apperance: Player_apperance) -> None:
        try:
            connection = db.get_connection()
            query = """
                INSERT INTO player_apperances (
                    tournament_id,
                    match_id,
                    team_id,
                    home_team,
                    away_team,
                    player_id,
                    shirt_number,
                    position_name,
                    position_code,
                    starter,
                    substitute
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor = connection.cursor()
            cursor.execute(query, (
                player_apperance.tournament_id,
                player_apperance.match_id,
                player_apperance.team_id,
                player_apperance.home_team,
                player_apperance.away_team,
                player_apperance.player_id,
                player_apperance.shirt_number,
                player_apperance.position_name,
                player_apperance.position_code,
                player_apperance.starter,
                player_apperance.substitute
            ))
            connection.commit()
            print("Player_apperance created successfully.")
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            connection.rollback()
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def get_squad_apperance(db: db, tournament_id: str, match_id: str, team_id: str) -> list:
        try:
            connection = db.get_connection()
            query = """
                SELECT * FROM player_apperances WHERE tournament_id = %s AND match_id = %s AND team_id = %s
            """
            cursor = connection.cursor()
            cursor.execute(query, (tournament_id, match_id, team_id))
            results = cursor.fetchall()
            if results is None:
                return None
            return [Player_apperance(*result) for result in results]
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            connection.rollback()
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def get_player_apperance(db: db, tournament_id: str, match_id: str, team_id: str, player_id: str) -> list:
        try:
            connection = db.get_connection()
            query = """
                SELECT * FROM player_apperances WHERE tournament_id = %s AND match_id = %s AND team_id = %s AND player_id = %s
            """
            cursor = connection.cursor()
            cursor.execute(query, (tournament_id, match_id, team_id, player_id))
            result = cursor.fetchone()
            if result is None:
                return None
            return Player_apperance(*result)
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            connection.rollback()
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def get_all_player_apperances(db: db) -> list:
        try:
            connection = db.get_connection()
            query = """
                SELECT * FROM player_apperances
            """
            cursor = connection.cursor()
            cursor.execute(query)
            results = cursor.fetchall()
            if results is None:
                return None
            return [Player_apperance(*result) for result in results]
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            connection.rollback()
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def update_player_apperance(db: db, player_apperance: Player_apperance) -> None:
        try:
            connection = db.get_connection()
            query = """
                UPDATE player_apperances SET
                    shirt_number = %s,
                    position_name = %s,
                    position_code = %s,
                    starter = %s,
                    substitute = %s
                WHERE tournament_id = %s AND match_id = %s AND team_id = %s AND player_id = %s
            """
            cursor = connection.cursor()
            cursor.execute(query, (
                player_apperance.shirt_number,
                player_apperance.position_name,
                player_apperance.position_code,
                player_apperance.starter,
                player_apperance.substitute,
                player_apperance.tournament_id,
                player_apperance.match_id,
                player_apperance.team_id,
                player_apperance.player_id
            ))
            connection.commit()
            print("Player_apperance updated successfully.")
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            connection.rollback()
        finally:
            cursor.close()
            connection.close()
    
    @staticmethod
    def delete_player_apperance(db: db, tournament_id: str, match_id: str, team_id: str, player_id: str) -> None:
        try:
            connection = db.get_connection()
            query = """
                DELETE FROM player_apperances WHERE tournament_id = %s AND match_id = %s AND team_id = %s AND player_id = %s
            """
            cursor = connection.cursor()
            cursor.execute(query, (tournament_id, match_id, team_id, player_id))
            connection.commit()
            print("Player_apperance deleted successfully.")
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            connection.rollback()
        finally:
            cursor.close()
            connection.close()
            
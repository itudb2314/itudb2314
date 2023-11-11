from dataclasses import dataclass
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

class SquadDAO():
    @staticmethod
    def create_squad(db: db, squad: Squad) -> None:
        try:
            connection = db.get_connection()
            query = """
                INSERT INTO squads (
                    tournament_id,
                    team_id,
                    player_id,
                    shirt_number,
                    position_name,
                    position_code
                ) VALUES (%s, %s, %s, %s, %s, %s)
            """
            cursor = connection.cursor()
            cursor.execute(query, (
                squad.tournament_id,
                squad.team_id,
                squad.player_id,
                squad.shirt_number,
                squad.position_name,
                squad.position_code
            ))
            connection.commit()
            print("Squad created successfully.")
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            connection.rollback()
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def get_squad(db: db, tournament_id: str, team_id: str) -> list:
        try:
            connection = db.get_connection()
            query = """
                SELECT * FROM squads WHERE tournament_id = %s AND team_id = %s
            """
            cursor = connection.cursor()
            cursor.execute(query, (tournament_id, team_id))
            results = cursor.fetchall()
            if results is None:
                return None
            return [Squad(*result) for result in results]
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            connection.rollback()
        finally:
            cursor.close()
            connection.close()
    
    @staticmethod
    def get_all_squads(db: db) -> list:
        try:
            connection = db.get_connection()
            query = """
                SELECT * FROM squads
            """
            cursor = connection.cursor()
            cursor.execute(query)
            results = cursor.fetchall()
            if results is None:
                return None
            return [Squad(*result) for result in results]
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            connection.rollback()
        finally:
            cursor.close()
            connection.close()
    
    @staticmethod
    def update_squad(db: db, squad: Squad) -> None:
        try:
            connection = db.get_connection()
            query = """
                UPDATE squads SET
                    shirt_number = %s,
                    position_name = %s,
                    position_code = %s
                WHERE tournament_id = %s AND team_id = %s AND player_id = %s
            """
            cursor = connection.cursor()
            cursor.execute(query, (
                squad.shirt_number,
                squad.position_name,
                squad.position_code,
                squad.tournament_id,
                squad.team_id,
                squad.player_id
            ))
            connection.commit()
            print("Squad updated successfully.")
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            connection.rollback()
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def delete_squad(db: db, tournament_id: str, team_id: str) -> None:
        try:
            connection = db.get_connection()
            query = """
                DELETE FROM squads WHERE tournament_id = %s AND team_id = %s
            """
            cursor = db.conn.cursor()
            cursor.execute(query, (tournament_id, team_id))
            connection.commit()
            print("Squad deleted successfully.")
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            connection.rollback()
        finally:
            cursor.close()
            connection.close()
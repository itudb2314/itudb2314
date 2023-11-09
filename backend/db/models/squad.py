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
            cursor = db.conn.cursor()
            cursor.execute(query, (
                squad.tournament_id,
                squad.team_id,
                squad.player_id,
                squad.shirt_number,
                squad.position_name,
                squad.position_code
            ))
            cursor.close()
            db.conn.commit()
            print("Squad created successfully.")
        except mysql.connector.Error as err:
            print(f"Error: {err}")

    @staticmethod
    def get_squad(db: db, tournament_id: str, team_id: str) -> list:
        try:
            query = """
                SELECT * FROM squads WHERE tournament_id = %s AND team_id = %s
            """
            cursor = db.conn.cursor()
            cursor.execute(query, (tournament_id, team_id))
            result = cursor.fetchall()
            cursor.close()
            return result
        except mysql.connector.Error as err:
            print(f"Error: {err}")
    
    @staticmethod
    def get_all_squads(db: db) -> list:
        try:
            query = """
                SELECT * FROM squads
            """
            cursor = db.conn.cursor()
            cursor.execute(query)
            result = cursor.fetchall()
            cursor.close()
            return result
        except mysql.connector.Error as err:
            print(f"Error: {err}")
    
    @staticmethod
    def update_squad(db: db, squad: Squad) -> None:
        try:
            query = """
                UPDATE squads SET
                    shirt_number = %s,
                    position_name = %s,
                    position_code = %s
                WHERE tournament_id = %s AND team_id = %s AND player_id = %s
            """
            cursor = db.conn.cursor()
            cursor.execute(query, (
                squad.shirt_number,
                squad.position_name,
                squad.position_code,
                squad.tournament_id,
                squad.team_id,
                squad.player_id
            ))
            cursor.close()
            db.conn.commit()
            print("Squad updated successfully.")
        except mysql.connector.Error as err:
            print(f"Error: {err}")

    @staticmethod
    def delete_squad(db: db, tournament_id: str, team_id: str) -> None:
        try:
            query = """
                DELETE FROM squads WHERE tournament_id = %s AND team_id = %s
            """
            cursor = db.conn.cursor()
            cursor.execute(query, (tournament_id, team_id))
            cursor.close()
            db.conn.commit()
            print("Squad deleted successfully.")
        except mysql.connector.Error as err:
            print(f"Error: {err}")
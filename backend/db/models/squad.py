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

@dataclass
class actual_squad:
    tournament_id: str
    team_id: str
    squad: List[Squad]

class SquadDAO():
    @staticmethod
    def create_squad_member(db: db, squad: Squad) -> None:
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
                SELECT tournament_id, team_id, player_id, shirt_number, position_name, position_code
                FROM squads
                ORDER BY tournament_id DESC, team_id ASC
                LIMIT 100
            """
            cursor = connection.cursor()
            cursor.execute(query)
            results = cursor.fetchall()
            if results is None:
                return None

            grouped_squads = {}
            for result in results:
                tournament_id, team_id, player_id, shirt_number, position_name, position_code = result
                key = (tournament_id, team_id)
                if key not in grouped_squads:
                    grouped_squads[key] = actual_squad(tournament_id, team_id, [])
                grouped_squads[key].squad.append(Squad(tournament_id, team_id, player_id, shirt_number, position_name, position_code))

            return list(grouped_squads.values())
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            connection.rollback()
        finally:
            cursor.close()
            connection.close()
    
    @staticmethod
    def update_squad_member(db: db, squad: Squad) -> None:
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
            cursor = connection.cursor()
            cursor.execute(query, (tournament_id, team_id))
            connection.commit()
            print("Squad deleted successfully.")
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            connection.rollback()
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def delete_squad_member(db: db, tournament_id: str, team_id: str, player_id: str) -> None:
        try:
            connection = db.get_connection()
            query = """
                DELETE FROM squads WHERE tournament_id = %s AND team_id = %s AND player_id = %s
            """
            cursor = connection.cursor()
            cursor.execute(query, (tournament_id, team_id, player_id))
            connection.commit()
            print("Squad member deleted successfully.")
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            connection.rollback()
        finally:
            cursor.close()
            connection.close()
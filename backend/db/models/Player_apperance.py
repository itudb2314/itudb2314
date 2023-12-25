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

    #join data
    given_name: str = None
    family_name: str = None

@dataclass
class Joined_Player_apperance():
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
    match_name: str
    family_name: str
    given_name: str
    team_name: str
    tournament_name: str

class Player_apperanceDAO():
    @staticmethod
    def create_player_apperance(db: db, player_apperance: Player_apperance) -> None:
        try:
            connection = db.get_connection()
            query = """
                INSERT INTO player_appearances (
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
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
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
                SELECT pa.*, p.given_name, p.family_name
                FROM player_appearances pa 
                JOIN players p ON pa.player_id = p.player_id
                WHERE tournament_id = %s AND match_id = %s AND team_id = %s
            """
            cursor = connection.cursor()
            cursor.execute(query, (tournament_id, match_id, team_id))
            results = cursor.fetchall()
            print(results[0])
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
                SELECT * FROM player_appearances WHERE tournament_id = %s AND match_id = %s AND team_id = %s AND player_id = %s
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
    def get_all_player_appearances(db: db) -> list:
        try:
            connection = db.get_connection()
            query = """
                SELECT 
                    pa.tournament_id, 
                    pa.match_id, 
                    pa.team_id, 
                    pa.home_team, 
                    pa.away_team,
                   pa.player_id, 
                   pa.shirt_number, 
                   pa.position_name, 
                   pa.position_code,
                   pa.starter, 
                   pa.substitute, 
                   m.match_name,
                   p.family_name, 
                   p.given_name, 
                   t.team_name, 
                   tr.tournament_name
                FROM player_appearances pa
                JOIN players p ON pa.player_id = p.player_id
                JOIN teams t ON pa.team_id = t.team_id
                JOIN tournaments tr ON pa.tournament_id = tr.tournament_id
                JOIN matches m ON pa.match_id = m.match_id
                LIMIT 100
            """
            cursor = connection.cursor()
            cursor.execute(query)
            results = cursor.fetchall()
            if results is None:
                return None
            return [Joined_Player_apperance(*result) for result in results]
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
                UPDATE player_appearances SET
                    shirt_number = %s,
                    position_name = %s,
                    position_code = %s,
                    starter = %s,
                    substitute = %s,
                    home_team = %s,
                    away_team = %s
                WHERE tournament_id = %s AND match_id = %s AND team_id = %s AND player_id = %s
            """
            cursor = connection.cursor()
            cursor.execute(query, (
                player_apperance.shirt_number,
                player_apperance.position_name,
                player_apperance.position_code,
                player_apperance.starter,
                player_apperance.substitute,
                player_apperance.home_team,
                player_apperance.away_team,
                player_apperance.tournament_id,
                player_apperance.match_id,
                player_apperance.team_id,
                player_apperance.player_id
            ))
            connection.commit()
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
                DELETE FROM player_appearances WHERE tournament_id = %s AND match_id = %s AND team_id = %s AND player_id = %s
            """
            cursor = connection.cursor()
            cursor.execute(query, (tournament_id, match_id, team_id, player_id))
            connection.commit()
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            connection.rollback()
        finally:
            cursor.close()
            connection.close()
            
    @staticmethod
    def get_all_appearances_paginated(db: db, page: int, items_per_page: int, order_by: str, order: str) -> list:
        try:
            connection = db.get_connection()  
            offset = (page) * items_per_page          
            if order_by == "tournament_name":
                order_by = "tr.tournament_name"
            elif order_by == "match_name":
                order_by = "m.match_name"
            elif order_by == "family_name":
                order_by = "p.family_name"
            elif order_by == "given_name":
                order_by = "p.given_name"
            elif order_by == "team_name":
                order_by = "t.team_name"
            else:
                order_by = "tournament_id"

            if order == "asc":
                order = "asc"
            else:
                order = "desc"

            query = f"""
                SELECT 
                pa.tournament_id, 
                pa.match_id, 
                pa.team_id, 
                pa.home_team, 
                pa.away_team,
                pa.player_id, 
                pa.shirt_number, 
                pa.position_name, 
                pa.position_code,
                pa.starter, 
                pa.substitute, 
                m.match_name,
                p.family_name, 
                p.given_name, 
                t.team_name,
                tr.tournament_name
                FROM player_appearances pa
                JOIN players p ON pa.player_id = p.player_id
                JOIN teams t ON pa.team_id = t.team_id
                JOIN tournaments tr ON pa.tournament_id = tr.tournament_id
                JOIN matches m ON pa.match_id = m.match_id
                ORDER BY {order_by} {order}
                LIMIT %s OFFSET %s
            """
            cursor = connection.cursor()
            cursor.execute(query, (items_per_page, offset))
            results = cursor.fetchall()
            if results is None:
                return None
            return [Joined_Player_apperance(*result) for result in results]
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            connection.rollback()
        finally:
            cursor.close()
            connection.close()

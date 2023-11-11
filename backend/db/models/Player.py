from dataclasses import dataclass
import mysql.connector
from db.db import db
from datetime import datetime


@dataclass
class Player:
    player_id: str
    family_name: str
    given_name: str
    birth_date: datetime.date
    female: bool
    goal_keeper: bool
    defender: bool
    midfielder: bool
    forward: bool
    count_tournaments: int
    list_tournaments: str
    player_wikipedia_link: str


class PlayerDAO():
    @staticmethod
    def create_player(db: db, player: Player) -> None:
        try:
            connection = db.get_connection()
            cursor = connection.cursor()
            query = """
                INSERT INTO players (
                    player_id,
                    family_name,
                    given_name,
                    birth_date,
                    female,
                    goal_keeper,
                    defender,
                    midfielder,
                    forward,
                    count_tournaments,
                    list_tournaments,
                    player_wikipedia_link
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(query, (
                player.player_id,
                player.family_name,
                player.given_name,
                player.birth_date,
                player.female,
                player.goal_keeper,
                player.defender,
                player.midfielder,
                player.forward,
                player.count_tournaments,
                player.list_tournaments,
                player.player_wikipedia_link
            ))
            connection.commit()
            print("Player created successfully.")
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            connection.rollback()
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def get_player(db: db, player_id: str) -> Player:
        try:
            connection = db.get_connection()
            query = """
                SELECT * FROM players WHERE player_id = %s
            """
            cursor = connection.cursor()
            cursor.execute(query, (player_id,))
            result = cursor.fetchone()
            if result is None:
                return None
            return Player(*result)
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            connection.rollback()
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def get_all_players(db: db) -> list:
        try:
            connection = db.get_connection()
            query = """
                SELECT * FROM players
            """
            cursor = connection.cursor()
            cursor.execute(query)
            results = cursor.fetchall()
            if results is None:
                return None
            return [Player(*result) for result in results]
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            connection.rollback()
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def update_player(db: db, player: Player) -> None:
        try:
            connection = db.get_connection()
            query = """
                UPDATE players SET
                    family_name = %s,
                    given_name = %s,
                    birth_date = %s,
                    female = %s,
                    goal_keeper = %s,
                    defender = %s,
                    midfielder = %s,
                    forward = %s,
                    count_tournaments = %s,
                    list_tournaments = %s,
                    player_wikipedia_link = %s
                WHERE player_id = %s
            """
            cursor = connection.cursor()
            cursor.execute(query, (
                player.family_name,
                player.given_name,
                player.birth_date,
                player.female,
                player.goal_keeper,
                player.defender,
                player.midfielder,
                player.forward,
                player.count_tournaments,
                player.list_tournaments,
                player.player_wikipedia_link,
                player.player_id
            ))
            connection.commit()
            print("Player updated successfully.")
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            connection.rollback()
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def delete_player(db: db, player_id: str) -> None:
        try:
            connection = db.get_connection()
            query = """
                DELETE FROM players WHERE player_id = %s
            """
            cursor = connection.cursor()
            cursor.execute(query, (player_id,))
            connection.commit()
            print("Player deleted successfully.")
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            connection.rollback()
        finally:
            cursor.close()
            connection.close()
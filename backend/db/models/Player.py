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

    # @staticmethod
    # def get_all_players_paginated(db: db, page: int, items_per_page: int) -> list:
    #     try:
    #         connection = db.get_connection()
    #         offset = (page) * items_per_page
    #         query = """
    #             SELECT * FROM players
    #             limit %s offset %s
    #         """
    #         cursor = connection.cursor()
    #         cursor.execute(query, (items_per_page, offset))
    #         results = cursor.fetchall()
    #         if results is None:
    #             return None
    #         return [Player(*result) for result in results]
    #     except mysql.connector.Error as err:
    #         print(f"Error: {err}")
    #         connection.rollback()
    #     finally:
    #         cursor.close()
    #         connection.close()

    def get_all_players_paginated(db: db, page: int, items_per_page: int, female: str, goal_keeper: str, defender: str, midfielder: str, forward: str, sorting_field: str, sorting_order:str) -> list:
        try:
            connection = db.get_connection()
            offset = page * items_per_page

            filters = []
            if female != 'all':
                filters.append(f"female = {female}")
            if goal_keeper != 'all':
                filters.append(f"goal_keeper = {goal_keeper}")
            if defender != 'all':
                filters.append(f"defender = {defender}")
            if midfielder != 'all':
                filters.append(f"midfielder = {midfielder}")
            if forward != 'all':
                filters.append(f"forward = {forward}")

            if sorting_field == 'neither' or sorting_order == 'neither':
                sorting_field = 'player_id'
                sorting_order = 'ASC'
            
            query = f"""
                SELECT * FROM players
                {"WHERE " + " AND ".join(filters) if filters else ""}
                ORDER BY {sorting_field} {sorting_order}
                LIMIT %s OFFSET %s
            """
            cursor = connection.cursor()
            cursor.execute(query, (items_per_page, offset))
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
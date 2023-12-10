from dataclasses import dataclass
from db.db import db
import mysql.connector


@dataclass
class Award:
    player_id: str
    given_name: str
    family_name: str
    award_name: str


@dataclass
class AwardWinner:
    tournament_id: str
    award_id: str
    shared: bool
    player_id: str
    team_id: str


class AwardDAO:
    @staticmethod
    def get_awards(db: db, award_id: str) -> Award:
        try:
            conn = db.get_connection()
            query = """
                    SELECT award_id, award_name, award_description, year_introduced
                    FROM awards WHERE award_id = %s
                """

            cursor = conn.cursor()
            cursor.execute(query, (award_id,))

            result = cursor.fetchone()
            return Award(*result)

        except mysql.connector.Error as err:
            print(f"Error: {err}")
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def get_award_winner(db: db, tournament_id: str, award_id: str) -> AwardWinner:
        try:
            conn = db.get_connection()
            query = """
                    SELECT tournament_id, award_id, shared, player_id, team_id
                    FROM award_winners WHERE tournament_id = %s AND award_id = %s
                """

            cursor = conn.cursor()
            cursor.execute(query, (tournament_id, award_id))

            result = cursor.fetchone()
            return AwardWinner(*result)

        except mysql.connector.Error as err:
            print(f"Error: {err}")
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def get_tournament_awards(db: db, tournament_id: str):
        try:
            conn = db.get_connection()
            query = """
                SELECT player_id, given_name, family_name, award_name
                FROM award_winners
                LEFT JOIN players USING (player_id)
                LEFT JOIN awards USING (award_id)
                WHERE tournament_id = %s
                """

            cursor = conn.cursor()
            cursor.execute(query, (tournament_id,))

            result = cursor.fetchall()
            return [Award(*result) for result in result]

        except mysql.connector.Error as err:
            print(f"Error: {err}")
        finally:
            cursor.close()
            conn.close()

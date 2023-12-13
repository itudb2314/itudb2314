from dataclasses import dataclass
from db.db import db
import mysql.connector


@dataclass
class AwardWinner:
    tournament_id: str
    award_id: str
    shared: bool
    player_id: str
    team_id: str


@dataclass
class AwardWithTournament:
    tournament_id: str
    player_id: str
    award_id: str
    player_name: str
    tournament_name: str
    award_name: str
    team_id: str


class AwardDAO:
    @staticmethod
    def get_all_awards(db: db, tournament_filter: str, award_filter: str, sort: str) -> list[AwardWithTournament]:
        try:
            conn = db.get_connection()
            cursor = conn.cursor()
            if award_filter == 'all':
                award_filter = '%'

            if tournament_filter == 'all':
                tournament_filter = '%'

            if sort == 'tournament_name':
                sort = 'tournament_id DESC, award_id ASC'
            elif sort == 'award_name':
                sort = 'award_id ASC, tournament_id DESC'
            elif sort == 'player_name':
                sort = 'player_id DESC'

            query = f"""
                SELECT tournament_id, player_id, award_id, 
                       CONCAT(given_name, CONCAT( ' ', family_name)) AS player_name, 
                       tournament_name, award_name, team_id
                FROM award_winners
                LEFT JOIN tournaments USING (tournament_id)
                LEFT JOIN awards USING (award_id)
                LEFT JOIN players USING (player_id)
                WHERE award_name LIKE %s AND tournaments.tournament_id LIKE %s
                ORDER BY {sort}
                """
            cursor.execute(query, (award_filter, tournament_filter))

            rows = cursor.fetchall()
            return [AwardWithTournament(*row) for row in rows]

        except mysql.connector.Error as err:
            print(f"Error: {err}")
        finally:
            cursor.close()
            conn.close()


    @staticmethod
    def search_all_awards(db: db, tournament_filter: str, award_filter: str, sort: str, search: str):
        try:
            conn = db.get_connection()
            cursor = conn.cursor()
            if award_filter == 'all':
                award_filter = '%'

            if tournament_filter == 'all':
                tournament_filter = '%'

            if sort == 'tournament_name':
                sort = 'tournament_id DESC, award_id ASC'
            elif sort == 'award_name':
                sort = 'award_id ASC, tournament_id DESC'
            elif sort == 'player_name':
                sort = 'player_id DESC'

            query = f"""
                    SELECT tournament_id, player_id, award_id,
                    CONCAT(given_name, CONCAT( ' ', family_name)) AS player_name,
                    tournament_name, award_name, team_id
                    FROM award_winners
                    LEFT JOIN tournaments USING (tournament_id)
                    LEFT JOIN awards USING (award_id)
                    LEFT JOIN players USING (player_id)
                    WHERE award_name LIKE %s AND tournaments.tournament_id LIKE %s AND CONCAT(given_name, CONCAT( ' ', family_name)) LIKE CONCAT('%', %s, '%')
                    ORDER BY {sort}
                    """
            cursor.execute(query, (award_filter, tournament_filter, search))

            rows = cursor.fetchall()
            return [AwardWithTournament(*row) for row in rows]

        except mysql.connector.Error as err:
            print(f"Error: {err}")
        finally:
            cursor.close()
            conn.close()


    @staticmethod
    def create_award(db: db, award: AwardWinner):
        try:
            conn = db.get_connection()
            cursor = conn.cursor()
            query = """
                    INSERT INTO award_winners (tournament_id, award_id, shared, player_id, team_id)
                    VALUES (%s, %s, %s, %s, %s)
                    """
            cursor.execute(query, (award.tournament_id, award.award_id, award.shared, award.player_id, award.team_id))
            conn.commit()

        except mysql.connector.Error as err:
            print(f"Error: {err}")
        finally:
            cursor.close()
            conn.close()


    @staticmethod
    def update_award(db: db, award: AwardWinner):
        try:
            conn = db.get_connection()
            cursor = conn.cursor()
            query = """
                    UPDATE award_winners
                    SET player_id = %s, team_id = %s
                    WHERE tournament_id = %s AND award_id = %s
                    """
            cursor.execute(query, (award.player_id, award.team_id, award.tournament_id, award.award_id))
            conn.commit()

        except mysql.connector.Error as err:
            print(f"Error: {err}")
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def delete_award(db: db, tournament_id: str, award_id: str, player_id: str):
        try:
            conn = db.get_connection()
            cursor = conn.cursor()
            query = """
                    DELETE FROM award_winners
                    WHERE tournament_id = %s AND award_id = %s AND player_id = %s
                    """
            cursor.execute(query, (tournament_id, award_id, player_id))
            conn.commit()
        except mysql.connector.Error as err:
            print(f"Error: {err}")
        finally:
            cursor.close()
            conn.close()

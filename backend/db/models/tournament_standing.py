from attr import dataclass
from db.db import db
import mysql.connector

@dataclass
class TournamentStanding():
    tournament_id: str
    position: int
    team_id: str


class TournamentStandingDAO():
    @staticmethod
    def create_tournament_standing(db: db, tournament_standing: TournamentStanding) -> None:
        try:
            query = """
                INSERT INTO tournament_standings (
                    tournament_id,
                    position,
                    team_id
                ) VALUES (%s, %s, %s)
            """
            cursor = db.conn.cursor()
            cursor.execute(query, (
                tournament_standing.tournament_id,
                tournament_standing.position,
                tournament_standing.team_id
            ))
            db.conn.commit()
        except mysql.connector.Error as err:
            print(f"Error: {err}")
        finally:
            cursor.close()
    
    @staticmethod
    def get_tournament_standing_by_id(db: db, tournament_id: str, position: int) -> TournamentStanding:
        try:
            query = """
                SELECT * FROM tournament_standings where tournament_id = %s AND position = %s
            """
            cursor = db.conn.cursor()
            cursor.execute(query, (tournament_id, position))
            result = cursor.fetchone()
            if result:
                return TournamentStanding(result[0], result[1], result[2])
            else:
                return None

        except mysql.connector.Error as err:
            print(f"Error: {err}")
        finally:
            cursor.close()

    @staticmethod
    def update_tournament_standing(db: db, standing: TournamentStanding) -> None:
        try:
            query = """
                UPDATE tournament_standings SET team_id = %s WHERE tournament_id = %s AND position = %s
            """
            cursor = db.conn.cursor()
            cursor.execute(query, (standing.team_id, standing.tournament_id, standing.position))
            db.conn.commit()
        except mysql.connector.Error as err:
            print(f"Error: {err}")
        finally:
            cursor.close()
            
    @staticmethod
    def delete_tournament_standing(db: db, tournament_id: str, position: int) -> None:
        try:
            query = """
                DELETE FROM tournament_standings WHERE tournament_id = %s AND position = %s
            """
            cursor = db.conn.cursor()
            cursor.execute(query, (tournament_id, position))
            db.conn.commit()
        except mysql.connector.Error as err:
            print(f"Error: {err}")
        finally:
            cursor.close()
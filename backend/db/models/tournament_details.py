from datetime import datetime
from dataclasses import asdict
from dataclasses import dataclass
from db.db import db
import mysql.connector
from mysql.connector import errorcode


@dataclass
class TournamentDetails:
    match_id: str
    team1: str
    team2: str
    winner: int
    home_team_score: int
    away_team_score: int
    stage_name: str


class TournamentDetailsDAO:
    @staticmethod
    def get_tournament_details(db: db, tournament_id: str):
        try:
            conn = db.get_connection()
            query = "Call GetKnockoutMatches(%s);"
            cursor = conn.cursor()
            cursor.execute(query, (tournament_id,))
            result = cursor.fetchall()
            return [TournamentDetails(*row) for row in result]
        except mysql.connector.Error as err:
            print(err)
        finally:
            cursor.close()
            conn.close()

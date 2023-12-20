from dataclasses import dataclass
from db.db import db
import mysql.connector
from mysql.connector import errorcode

@dataclass
class TeamStats:
    team_id: str
    team_name: str
    tournament_id: str
    award_count: int
    number_of_goals: int
    number_of_wins: int
    number_of_draws: int
    number_of_losses: int


class TeamStatsDAO():
    @staticmethod
    def get_team_stats(db: db, team_id: str, tournament_filter: str) -> list:
        try:
            if tournament_filter == 'all':
                tournament_filter = '%'

            conn = db.get_connection()
            query = """SELECT      tac.team_id,      tac.team_name,      tac.tournament_id,      tac.award_count,     nog.number_of_goals,     now.number_of_wins,     nod.number_of_draws,     nol.number_of_losses 
            FROM      team_award_count tac  
            LEFT JOIN      number_of_goals nog ON tac.team_id = nog.team_id AND tac.tournament_id = nog.tournament_id 
            LEFT JOIN      number_of_wins now ON tac.team_id = now.team_id AND tac.tournament_id = now.tournament_id 
            LEFT JOIN      number_of_draws nod ON tac.team_id = nod.team_id AND tac.tournament_id = nod.tournament_id 
            LEFT JOIN      number_of_losses nol ON tac.team_id = nol.team_id AND tac.tournament_id = nol.tournament_id
            where tac.tournament_id like %s and tac.team_id = %s"""
            cursor = conn.cursor()
            cursor.execute(query, (tournament_filter,team_id))
            records = cursor.fetchall()
            cursor.close()
            return [TeamStats(*record) for record in records]
        except mysql.connector.Error as err:
            print(f"Error: {err}")
        finally:
            db.disconnect(conn)

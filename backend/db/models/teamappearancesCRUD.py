from attr import dataclass
import mysql.connector
from mysql.connector import errorcode

@dataclass
class TeamAppearance():
    tournament_id: str
    match_id: str
    team_id: str
    opponent_id: str
    home_team: bool
    away_team: bool
    goals_for: int
    goals_against: int
    goal_differential: int
    extra_time: bool
    penalty_shootout: bool
    penalties_for: int
    penalties_against: int
    result: str
    win: bool
    lose: bool
    draw: bool


class TeamAppearanceDAO():
    @staticmethod
    def create_team_appearance(db, ta: TeamAppearance) -> None:
        try:
            query = """INSERT INTO team_appearances (
                    tournament_id, 
                    match_id,
                    team_id,
                    opponent_id,
                    home_team,
                    away_team,
                    goals_for,
                    goals_against,
                    goal_differential,
                    extra_time,
                    penalty_shootout,
                    penalties_for,
                    penalties_against,
                    result, 
                    win,
                    lose, 
                    draw
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor = db.conn.cursor()
            cursor.execute(query, (
                ta.tournament_id, 
                ta.match_id, 
                ta.team_id, 
                ta.opponent_id,
                ta.home_team, 
                ta.away_team, 
                ta.goals_for, 
                ta.goals_against,
                ta.goal_differential, 
                ta.extra_time, 
                ta.penalty_shootout,
                ta.penalties_for, 
                ta.penalties_against, 
                ta.result, 
                ta.win,
                ta.lose, 
                ta.draw
            ))
            cursor.close()
            db.conn.commit()
        except mysql.connector.Error as err:
            print(f"Error: {err}")

    @staticmethod
    def get_team_appearance_by_match_id(db, match_id: str) -> TeamAppearance:
        try:
            query = "SELECT * FROM team_appearances WHERE match_id = %s"
            cursor = db.conn.cursor()
            cursor.execute(query, (match_id,))
            row = cursor.fetchone()
            cursor.close()
            if row is None:
                return None
            return TeamAppearance(*row)
        except mysql.connector.Error as err:
            print(f"Error: {err}")

    @staticmethod
    def get_all_team_appearances(db) -> list[TeamAppearance]:
        try:
            query = "SELECT * FROM team_appearances"
            cursor = db.conn.cursor()
            cursor.execute(query)
            rows = cursor.fetchall()
            cursor.close()
            return [TeamAppearance(*row) for row in rows]
        except mysql.connector.Error as err:
            print(f"Error: {err}")

    @staticmethod
    def update_team_appearance(db, ta: TeamAppearance) -> None:
        try:
            query = """UPDATE team_appearances SET
                        tournament_id = %s, opponent_id = %s,
                        home_team = %s, away_team = %s,
                        goals_for = %s, goals_against = %s,
                        goal_differential = %s, extra_time = %s,
                        penalty_shootout = %s, penalties_for = %s,
                        penalties_against = %s, result = %s, win = %s,
                        lose = %s, draw = %s
                    WHERE match_id = %s AND team_id = %s
            """
            cursor = db.conn.cursor()
            cursor.execute(query, (
                ta.tournament_id, 
                ta.opponent_id, 
                ta.home_team,
                ta.away_team, 
                ta.goals_for, 
                ta.goals_against,
                ta.goal_differential, 
                ta.extra_time, 
                ta.penalty_shootout,
                ta.penalties_for, 
                ta.penalties_against, 
                ta.result, 
                ta.win,
                ta.lose, 
                ta.draw, 
                ta.match_id, 
                ta.team_id
            ))
            cursor.close()
            db.conn.commit()
        except mysql.connector.Error as err:
            print(f"Error: {err}")

    @staticmethod
    def delete_team_appearance(db, match_id: str, team_id: str) -> None:
        try:
            query = "DELETE FROM team_appearances WHERE match_id = %s AND team_id = %s"
            cursor = db.conn.cursor()
            cursor.execute(query, (match_id, team_id))
            cursor.close()
            db.conn.commit()
        except mysql.connector.Error as err:
            print(f"Error: {err}")



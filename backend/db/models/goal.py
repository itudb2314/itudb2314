from db.db import db 
from attr import dataclass
import mysql.connector
from mysql.connector import errorcode

@dataclass
class Goal():
    goal_id: str
    tournament_id : str
    match_id : str
    team_id : str
    home_team : bool
    away_team : bool
    player_id : str
    shirt_number : int
    player_team_id : str
    minute_label : str
    minute_regulation : int
    minute_stoppage : int
    match_period : str
    own_goal : bool
    penalty : bool

class GoalDAO():
    @staticmethod
    def create_goal(db: db, goal: Goal) -> None:
        try:
            query = """
                INSERT INTO goals (
                    goal_id,
                    tournament_id,
                    match_id,
                    team_id,
                    home_team,
                    away_team,
                    player_id,
                    shirt_number,
                    player_team_id,
                    minute_label,
                    minute_regulation,
                    minute_stoppage,
                    match_period,
                    own_goal,
                    penalty
                ) VALUES (%s, %s, %s, %s, %s, %s %s, %s, %s, %s, %s, %s, %s, %s, %s) 
            """
            cursor = db.conn.cursor()
            cursor.execute(query, (
                    goal.goal_id,
                    goal.tournament_id,
                    goal.match_id,
                    goal.team_id,
                    goal.home_team,
                    goal.away_team,
                    goal.player_id,
                    goal.shirt_number,
                    goal.player_team_id,
                    goal.minute_label,
                    goal.minute_regulation,
                    goal.minute_stoppage,
                    goal.match_period,
                    goal.own_goal,
                    goal.penalty   
            ))
            cursor.close()
            db.conn.commit()
        except mysql.connector.Error as error:
            print(f"Error: {error}")


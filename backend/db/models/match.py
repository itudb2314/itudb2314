from db.db import db 
from attr import dataclass
import mysql.connector
from mysql.connector import errorcode

@dataclass
class Match():
    tournament_id : str
    match_id : str
    match_name : str
    stage_name : str
    group_name : str
    group_stage : bool
    knockout_stage : bool
    replayed : bool
    replay : bool
    match_date : str
    match_time : str
    stadium_id : str
    home_team_id : str
    away_team_id : str
    score : str
    home_team_score : int
    away_team_score : int
    home_team_score_margin : int
    away_team_score_margin : int
    extra_time : bool
    penalty_shootout : bool
    score_penalties : str
    home_team_score_penalties : int
    away_team_score_penalties : int
    result : str
    home_team_win : bool
    away_team_win : bool
    draw : bool

class MatchDAO():
    @staticmethod
    def create_match(db: db, match: Match) -> None:
        try:
            query = """ 
                INSERT INTO goals(
                    tournament_id, 
                    match_id,
                    match_name,
                    stage_name,
                    group_name,
                    group_stage,
                    knockout_stage, 
                    replayed,
                    replay,
                    match_date, 
                    match_time, 
                    stadium_id, 
                    home_team_id, 
                    away_team_id, 
                    score, 
                    home_team_score, 
                    away_team_score, 
                    home_team_score_margin,
                    away_team_score_margin,
                    extra_time,                
                    penalty_shootout,
                    score_penalties, 
                    home_team_score_penalties, 
                    away_team_score_penalties, 
                    result, 
                    home_team_win, 
                    away_team_win, 
                    draw, 
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor = db.conn.cursor()
            cursor.execute(query, (
                    match.tournament_id, 
                    match.match_id,
                    match.match_name,
                    match.stage_name,
                    match.group_name,
                    match.group_stage,
                    match.knockout_stage, 
                    match.replayed,
                    match.replay,
                    match.match_date, 
                    match.match_time, 
                    match.stadium_id, 
                    match.home_team_id, 
                    match.away_team_id, 
                    match.score, 
                    match.home_team_score, 
                    match.away_team_score, 
                    match.home_team_score_margin,
                    match.away_team_score_margin,
                    match.extra_time,                
                    match.penalty_shootout,
                    match.score_penalties, 
                    match.home_team_score_penalties, 
                    match.away_team_score_penalties, 
                    match.result, 
                    match.home_team_win, 
                    match.away_team_win, 
                    match.draw, 
            ))
            cursor.close()
            db.conn.commit()
        except mysql.connector.Error as error:
            print(f"Error: {error}")
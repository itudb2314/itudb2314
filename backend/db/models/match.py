from db.db import db 
from dataclasses import dataclass
import mysql.connector
from mysql.connector import errorcode


@dataclass
class Match:
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
            db.conn.commit()
        except mysql.connector.Error as error:
            print(f"Error: {error}")
        finally: 
            cursor.close()

    @staticmethod
    def get_match_by_id(db : db, match_id : str) -> Match:
        try:
            query = """
                    SELECT * FROM matches WHERE match_id = %s
                    """
            cursor = db.conn.cursor()
            cursor.execute(query, (match_id))
            result = cursor.fetchone()
            if result:
                return Match(result[0], result[1], result[2], result[3],result[4], result[5], result[6], 
                            result[7], result[8], result[9], result[10], result[11],result[12], result[13], 
                            result[14], result[15], result[16], result[17], result[18],result[19], result[20], 
                            result[21], result[22], result[23], result[24], result[25], result[26],result[27])
            else:
                return None
        
        except mysql.connector.Error as error:
            print(f"Error: {error}")
        finally:
            cursor.close()

    @staticmethod
    def update_match(db : db, match : Match) -> None:
        try:
            query = """
                    UPDATE matches SET
                        tournament_id = %s,
                        match_name = %s,
                        stage_name = %s,
                        group_name = %s,
                        group_stage = %s,
                        knockout_stage = %s,
                        replayed = %s,
                        replay = %s,
                        match_date = %s,
                        match_time = %s,
                        stadium_id = %s,
                        home_team_id = %s,
                        away_team_id = %s,
                        score = %s,
                        home_team_score = %s,
                        away_team_score = %s,
                        home_team_score_margin = %s,
                        away_team_score_margin = %s,
                        extra_time = %s,
                        penalty_shootout = %s,
                        score_penalties = %s,
                        home_team_score_penalties = %s,
                        away_team_score_penalties = %s,
                        result = %s,
                        home_team_win = %s,
                        away_team_win = %s,
                        draw = %s
                    WHERE match_id = %s
                    """
            cursor = db.conn.cursor()
            cursor.execute(query, (
                    match.tournament_id,
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
                    match.match_id
            ))
            db.conn.commit()
        except mysql.connector.Error as error:
            print(f"Error: {error}")
        finally:
            cursor.close()
    
    @staticmethod
    def delete_match(db : db, match_id : str) -> None:
        try:   
            query = """
                    DELETE FROM matches WHERE match_id = %s
                    """
            cursor = db.conn.cursor()
            cursor.execute(query, (match_id))
            db.conn.commit()
        except mysql.connector.Error as error:
            print(f"Error: {error}")
        finally:
            cursor.close()
        
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

    #attributes from join operations
    stadium_name : str = None
    city_name : str = None
    home_team_name : str = None
    away_team_name : str = None
    tournament_name : str = None


class MatchDAO():
    @staticmethod
    def create_match(db: db, match: Match) -> None:
        try:
            connection = db.get_connection()
            query = """ 
                INSERT INTO matches(
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
                    draw
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor = connection.cursor()
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
                    match.draw
            ))
            connection.commit()
        except mysql.connector.Error as error:
            connection.rollback()
            print("MySQL Error:", error)
        finally: 
            cursor.close()
            connection.close()

    @staticmethod
    def get_all_matches(db : db) -> list[Match]:
        try:
            matches = []
            connection = db.get_connection()
            query = """
                    SELECT m.*, s.stadium_name, s.city_name, thome.team_name, taway.team_name, t.tournament_name 
                    FROM matches m 
                    LEFT JOIN stadiums s ON m.stadium_id = s.stadium_id 
                    LEFT JOIN teams thome ON m.home_team_id = thome.team_id
                    LEFT JOIN teams taway ON m.away_team_id = taway.team_id
                    LEFT JOIN tournaments t ON m.tournament_id = t.tournament_id
                    ORDER BY m.tournament_id DESC, m.match_id DESC
                    """
            cursor = connection.cursor()
            cursor.execute(query)
            results = cursor.fetchall()
            if results:
                for result in results:
                    match = Match(result[0], result[1], result[2], result[3],result[4], result[5], result[6], 
                            result[7], result[8], result[9], result[10], result[11],result[12], result[13], 
                            result[14], result[15], result[16], result[17], result[18],result[19], result[20], 
                            result[21], result[22], result[23], result[24], result[25], result[26],result[27],
                            result[28], result[29], result[30], result[31], result[32])
                    matches.append(match)
                return matches
            else:
                return None
        
        except mysql.connector.Error as error:
            connection.rollback()
            print("MySQL Error:", error)
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def get_match_by_id(db : db, match_id : str) -> Match:
        try:
            connection = db.get_connection()
            query = """
                    SELECT m.*, s.stadium_name, s.city_name, thome.team_name, taway.team_name, t.tournament_name 
                    FROM matches m 
                    LEFT JOIN stadiums s ON m.stadium_id = s.stadium_id 
                    LEFT JOIN teams thome ON m.home_team_id = thome.team_id
                    LEFT JOIN teams taway ON m.away_team_id = taway.team_id
                    LEFT JOIN tournaments t ON m.tournament_id = t.tournament_id
                    WHERE match_id = %s
                    """
            cursor = connection.cursor()
            cursor.execute(query, (match_id,))
            result = cursor.fetchone()
            if result:
                return Match(result[0], result[1], result[2], result[3],result[4], result[5], result[6], 
                            result[7], result[8], result[9], result[10], result[11],result[12], result[13], 
                            result[14], result[15], result[16], result[17], result[18],result[19], result[20], 
                            result[21], result[22], result[23], result[24], result[25], result[26],result[27], 
                            result[28], result[29], result[30], result[31], result[32])
            else:
                return None
        
        except mysql.connector.Error as error:
            connection.rollback()
            print("MySQL Error:", error)
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def get_tournemant_matches(db: db, tournament_id: str, stage_name: str = None) -> list[Match] | None:
        matches = []
        try:
            connection = db.get_connection()
            if stage_name == None:
                query = """
                        SELECT m.*, s.stadium_name, s.city_name, thome.team_name, taway.team_name, t.tournament_name 
                        FROM matches m 
                        LEFT JOIN stadiums s ON m.stadium_id = s.stadium_id 
                        LEFT JOIN teams thome ON m.home_team_id = thome.team_id
                        LEFT JOIN teams taway ON m.away_team_id = taway.team_id
                        LEFT JOIN tournaments t ON m.tournament_id = t.tournament_id
                        WHERE m.tournament_id = %s
                        """
                cursor = connection.cursor()
                cursor.execute(query, (tournament_id,stage_name))
            else:
                query = """
                        SELECT m.*, s.stadium_name, s.city_name, thome.team_name, taway.team_name, t.tournament_name 
                        FROM matches m 
                        LEFT JOIN stadiums s ON m.stadium_id = s.stadium_id 
                        LEFT JOIN teams thome ON m.home_team_id = thome.team_id
                        LEFT JOIN teams taway ON m.away_team_id = taway.team_id
                        LEFT JOIN tournaments t ON m.tournament_id = t.tournament_id
                        WHERE m.tournament_id = %s and m.stage_name = %s
                        ORDER BY m.match_id DESC
                        """
                cursor = connection.cursor()
                cursor.execute(query, (tournament_id,stage_name))

            results = cursor.fetchall()
            if results:
                for result in results:
                    match = Match(result[0], result[1], result[2], result[3],result[4], result[5], result[6], 
                            result[7], result[8], result[9], result[10], result[11],result[12], result[13], 
                            result[14], result[15], result[16], result[17], result[18],result[19], result[20], 
                            result[21], result[22], result[23], result[24], result[25], result[26],result[27], 
                            result[28], result[29], result[30], result[31], result[32])
                    matches.append(match)
                return matches
            else:
                return None
        
        except mysql.connector.Error as error:
            connection.rollback()
            print("MySQL Error:", error)
        finally:
            connection.close()
            connection.close()

    @staticmethod
    def get_groupstage_matches(db : db, tournament_id: str, group_stage: bool) -> list[Match]:
        matches = []
        try:
            connection = db.get_connection()
            query = """
                    SELECT * FROM matches WHERE tournament_id = %s AND group_stage = %s
                    """
            cursor = connection.cursor()
            cursor.execute(query, (tournament_id, group_stage))
            results = cursor.fetchall()
            if results:
                for result in results:
                    match = Match(result[0], result[1], result[2], result[3],result[4], result[5], result[6], 
                            result[7], result[8], result[9], result[10], result[11],result[12], result[13], 
                            result[14], result[15], result[16], result[17], result[18],result[19], result[20], 
                            result[21], result[22], result[23], result[24], result[25], result[26],result[27])
                    matches.append(match)
                return matches
            else:
                return None
        
        except mysql.connector.Error as error:
            connection.rollback()
            print("MySQL Error:", error)
        finally:
            cursor.close()
            connection.close()
    
    @staticmethod
    def get_knockoutstage_matches(db : db, tournament_id: str, knockout_stage: bool) -> list[Match]:
        matches = []
        try:
            connection = db.get_connection()
            query = """
                    SELECT * FROM matches WHERE tournament_id = %s AND knockout_stage = %s
                    """
            cursor = connection.cursor()
            cursor.execute(query, (tournament_id, knockout_stage))
            results = cursor.fetchall()
            if results:
                for result in results:
                    match = Match(result[0], result[1], result[2], result[3],result[4], result[5], result[6], 
                            result[7], result[8], result[9], result[10], result[11],result[12], result[13], 
                            result[14], result[15], result[16], result[17], result[18],result[19], result[20], 
                            result[21], result[22], result[23], result[24], result[25], result[26],result[27])
                    matches.append(match)
                return matches
            else:
                return None
        
        except mysql.connector.Error as error:
            connection.rollback()
            print("MySQL Error:", error)
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def get_tournament_stadiums(db: db, tournament_id: str) -> list[str]:
        stadiums = []
        try:
            connection = db.get_connection()
            query = """
                    SELECT DISTINCT stadium_name, stadium_id 
                    FROM matches LEFT JOIN stadiums 
                    USING(stadium_id)
                    WHERE tournament_id = %s
                    """
            cursor = connection.cursor()
            cursor.execute(query, (tournament_id,))
            results = cursor.fetchall()
            if results:
                for result in results:
                    print(result)
                    stadiums.append({'stadium_name': result[0], 'stadium_id': result[1]})
                return stadiums
            else:
                return None
        
        except mysql.connector.Error as error:
            connection.rollback()
            print("MySQL Error:", error)
        finally:
            connection.close()
            connection.close()

    @staticmethod
    def get_tournament_hometeams(db : db, tournament_id: str) -> list[dict]:
        teams = []
        try: 
            conn = db.get_connection()
            cursor = conn.cursor()
            query = """
                    SELECT DISTINCT team_name, home_team_id 
                    FROM matches LEFT JOIN teams 
                    ON home_team_id = team_id 
                    WHERE tournament_id = %s
                    """
            cursor.execute(query, (tournament_id,))
            rows = cursor.fetchall()
            cursor.close()
            conn.close()
            for row in rows:
                teams.append({"team_name": row[0], "team_id": row[1]})
            return teams
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            conn.rollback()
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def get_tournament_awayteams(db : db, tournament_id: str) -> list[dict]:
        teams = []
        try: 
            conn = db.get_connection()
            cursor = conn.cursor()
            query = """
                    SELECT DISTINCT team_name, away_team_id 
                    FROM matches LEFT JOIN teams 
                    ON away_team_id = team_id 
                    WHERE tournament_id = %s
                    """
            cursor.execute(query, (tournament_id,))
            rows = cursor.fetchall()
            cursor.close()
            conn.close()
            for row in rows:
                teams.append({"team_name": row[0], "team_id": row[1]})
            return teams
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            conn.rollback()
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def get_hometeam_matches(db : db, tournament_id: str,home_team_id : str) -> list[Match]:
        matches = []
        try:
            connection = db.get_connection()
            query = """
                    SELECT * FROM matches WHERE tournament_id = %s AND home_team_id = %s
                    """
            cursor = connection.cursor()
            cursor.execute(query, (tournament_id, home_team_id))
            results = cursor.fetchall()
            if results:
                for result in results:
                    match = Match(result[0], result[1], result[2], result[3],result[4], result[5], result[6], 
                            result[7], result[8], result[9], result[10], result[11],result[12], result[13], 
                            result[14], result[15], result[16], result[17], result[18],result[19], result[20], 
                            result[21], result[22], result[23], result[24], result[25], result[26],result[27])
                    matches.append(match)
                return matches
            else:
                return None
        
        except mysql.connector.Error as error:
            connection.rollback()
            print("MySQL Error:", error)
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def get_awayteam_matches(db : db, tournament_id: str, away_team_id : str) -> list[Match]:
        matches = []
        try:
            connection = db.get_connection()
            query = """
                    SELECT * FROM matches WHERE tournament_id = %s AND away_team_id = %s
                    """
            cursor = connection.cursor()
            cursor.execute(query, (tournament_id, away_team_id))
            results = cursor.fetchall()
            if results:
                for result in results:
                    match = Match(result[0], result[1], result[2], result[3],result[4], result[5], result[6], 
                            result[7], result[8], result[9], result[10], result[11],result[12], result[13], 
                            result[14], result[15], result[16], result[17], result[18],result[19], result[20], 
                            result[21], result[22], result[23], result[24], result[25], result[26],result[27])
                    matches.append(match)
                return matches
            else:
                return None
        
        except mysql.connector.Error as error:
            connection.rollback()
            print("MySQL Error:", error)
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def update_match(db : db, match : Match) -> None:
        try:
            connection = db.get_connection()
            query = """
                    UPDATE matches SET
                        match_name = %s,
                        replayed = %s,
                        replay = %s,
                        match_date = %s,
                        match_time = %s,
                        extra_time = %s
                    WHERE match_id = %s
                    """
            cursor = connection.cursor()
            cursor.execute(query, (
                    match.match_name,
                    match.replayed,
                    match.replay,
                    match.match_date,
                    match.match_time,
                    match.extra_time,
                    match.match_id
            ))
            connection.commit()
        except mysql.connector.Error as error:
            connection.rollback()
            print("MySQL Error:", error)
        finally:
            cursor.close()
            connection.close()
    
    @staticmethod
    def delete_match(db : db, match_id : str) -> None:
        try:   
            connection = db.get_connection()
            query = """
                    DELETE FROM matches WHERE match_id = %s
                    """
            cursor = connection.cursor()
            cursor.execute(query, (match_id,))
            connection.commit()
        except mysql.connector.Error as error:
            connection.rollback()
            print("MySQL Error:", error)
        finally:
            cursor.close()
            connection.close()
        

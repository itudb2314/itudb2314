from db.db import db
from dataclasses import dataclass
import mysql.connector
from mysql.connector import errorcode


@dataclass
class Goal:
    goal_id: str
    tournament_id: str
    match_id: str
    team_id: str
    home_team: bool
    away_team: bool
    player_id: str
    shirt_number: int
    player_team_id: str
    minute_label: str
    minute_regulation: int
    minute_stoppage: int
    match_period: str
    own_goal: bool
    penalty: bool

    #join data
    given_name: str
    family_name: str


class GoalDAO():
    @staticmethod
    def create_goal(db: db, goal: Goal) -> None:
        try:
            connection = db.get_connection()
            print(goal)
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
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) 
            """
            cursor = connection.cursor()
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
            connection.commit()
        except mysql.connector.Error as error:
            connection.rollback()
            print("MySQL Error:", error)
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def get_all_goals(db: db) -> list[Goal]:
        goals = []
        try:
            connection = db.get_connection()
            query = """
                    SELECT g.*, 
                    CASE WHEN p.given_name = 'not applicable' THEN ' ' ELSE p.given_name END as given_name, 
                    CASE WHEN p.family_name = 'not applicable' THEN ' ' ELSE p.family_name END as family_name
                    FROM goals g 
                    LEFT JOIN players p ON g.player_id = p.player_id
                    """
            cursor = connection.cursor()
            cursor.execute(query)
            results = cursor.fetchall()
            if results:
                for result in results:
                    goal = Goal(result[0], result[1], result[2], result[3], result[4], result[5], result[6], result[7],
                                result[8], result[9], result[10], result[11], result[12], result[13], result[14], result[15], result[16])
                    goals.append(goal)
                return goals
            else:
                return None
        except mysql.connector.Error as error:
            connection.rollback()
            print("MySQL Error:", error)
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def get_goal_by_id(db: db, goal_id: str) -> Goal:
        try:
            connection = db.get_connection()
            query = """
                    SELECT * FROM goals WHERE goal_id = %s
                    """
            cursor = connection.cursor()
            cursor.execute(query, (goal_id,))
            result = cursor.fetchone()
            if result:
                return Goal(result[0], result[1], result[2], result[3], result[4], result[5], result[6], result[7],
                            result[8], result[9], result[10], result[11], result[12], result[13], result[14])
            else:
                return None
        except mysql.connector.Error as error:
            connection.rollback()
            print("MySQL Error:", error)
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def get_match_goals(db: db, match_id: str) -> list[Goal]:
        goals = []
        try:
            connection = db.get_connection()
            query = """
                    SELECT g.*,
                    CASE WHEN p.given_name = 'not applicable' THEN ' ' ELSE p.given_name END as given_name, 
                    CASE WHEN p.family_name = 'not applicable' THEN ' ' ELSE p.family_name END as family_name
                    FROM goals g 
                    LEFT JOIN players p ON g.player_id = p.player_id
                    WHERE match_id = %s 
                    """
            cursor = connection.cursor()
            cursor.execute(query, (match_id,))
            results = cursor.fetchall()
            if results:
                for result in results:
                    goal =  Goal(result[0], result[1], result[2], result[3], result[4], result[5], result[6], result[7],
                                result[8], result[9], result[10], result[11], result[12], result[13], result[14], result[15], result[16])
                    goals.append(goal)
                return goals
            else:
                return None
        except mysql.connector.Error as error:
            connection.rollback()
            print("MySQL Error:", error)
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def get_team_goals(db: db, tournament_id: str, team_id: str) -> list[Goal]:
        goals = []
        try:
            connection = db.get_connection()
            query = """
                    SELECT * FROM goals WHERE tournament_id = %s AND team_id = %s 
                    """
            cursor = connection.cursor()
            cursor.execute(query, (tournament_id, team_id))
            results = cursor.fetchall()
            if results:
                for result in results:
                    goal =  Goal(result[0], result[1], result[2], result[3], result[4], result[5], result[6], result[7],
                                result[8], result[9], result[10], result[11], result[12], result[13], result[14])
                    goals.append(goal)
                return goals
            else:
                return None
        except mysql.connector.Error as error:
            connection.rollback()   
            print("MySQL Error:", error)
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def get_player_goals(db: db, player_id: str) -> int:
        try:
            connection = db.get_connection()
            query = """
                    SELECT count(player_id) FROM goals WHERE player_id = %s 
                    """
            cursor = connection.cursor()
            cursor.execute(query, (player_id,))
            results = cursor.fetchone()
            if results:
                return results[0]
            else:
                return 0
        except mysql.connector.Error as error:
            connection.rollback()
            print("MySQL Error:", error)
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def get_penalties(db: db, player_id: str) -> int:
        try:
            connection = db.get_connection()
            query = """
                    SELECT count(player_id) FROM goals WHERE player_id = %s AND penalty = 1
                    """
            cursor = connection.cursor()
            cursor.execute(query, (player_id,))
            results = cursor.fetchone()
            if results:
                return results[0]
            else:
                return 0
        except mysql.connector.Error as error:
            connection.rollback()
            print("MySQL Error:", error)
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def update_goal(db: db, goal: Goal) -> None:
        try:
            connection = db.get_connection()
            query = """
                    UPDATE goals SET
                        tournament_id = %s,
                        match_id = %s,
                        team_id = %s,
                        home_team = %s,
                        away_team = %s,
                        player_id = %s,
                        shirt_number = %s,
                        player_team_id = %s,
                        minute_label = %s,
                        minute_regulation = %s,
                        minute_stoppage = %s,
                        match_period = %s,
                        own_goal = %s,
                        penalty = %s
                    WHERE goal_id = %s"""
            cursor = connection.cursor()
            cursor.execute(query, (
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
                goal.penalty,
                goal.goal_id
            ))
            connection.commit()
        except mysql.connector.Error as error:
            connection.rollback()
            print("MySQL Error:", error)
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def delete_goal(db: db, goal_id: str) -> None:
        try:
            connection = db.get_connection()
            query = """
                    DELETE FROM goals WHERE goal_id = %s
                    """
            cursor = connection.cursor()
            cursor.execute(query, (goal_id,))
            connection.commit()
        except mysql.connector.Error as error:
            connection.rollback()
            print("MySQL Error:", error)
        finally:
            cursor.close()
            connection.close()

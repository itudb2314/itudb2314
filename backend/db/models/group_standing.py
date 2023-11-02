from dataclasses import dataclass

import mysql.connector
from db.db import db

@dataclass
class GroupStanding():
    tournament_id: str
    stage_number: int
    stage_name: str
    group_name: str
    position: str
    team_id: str
    played: int
    wins: int
    draws: int
    losses: int
    goals_for: int
    goals_against: int
    goal_difference: int
    points: int
    advanced: bool

class GroupStandingDAO():

    @staticmethod
    def insert_group_standing(db: db, group_standing: GroupStanding) -> None:
        try:
            query="""
                INSERT INTO group_standing (
                    tournament_id,
                    stage_number,
                    stage_name,
                    group_name,
                    position,
                    team_id,
                    played,
                    wins,
                    draws,
                    losses,
                    goals_for,
                    goals_against,
                    goal_difference,
                    points,
                    advanced
                ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"""
            
            cursor = db.conn.cursor()
            cursor.execute(query, (
                group_standing.tournament_id,
                group_standing.stage_number,
                group_standing.stage_name,
                group_standing.group_name,
                group_standing.position,
                group_standing.team_id,
                group_standing.played,
                group_standing.wins,
                group_standing.draws,
                group_standing.losses,
                group_standing.goals_for,
                group_standing.goals_against,
                group_standing.goal_difference,
                group_standing.points,
                group_standing.advanced
                ))
            db.conn.commit()
            cursor.close()

        except mysql.connector.Error as err:
            print (f"Error: {err}")
    
    @staticmethod
    def get_group_standing(db: db, tournament_id: str, stage_number: int, group_name: str, position: str) -> list:

        try:
            query="""
                SELECT * FROM group_standing
                WHERE tournament_id=%s AND stage_number=%s AND group_name=%s AND position=%s
                """
            cursor = db.conn.cursor()
            cursor.execute(query, (
                tournament_id,
                stage_number,
                group_name,
                position
                ))
            result = cursor.fetchone()
            cursor.close()
            return result
        except mysql.connector.Error as err:
            print (f"Error: {err}")
    
    @staticmethod
    def get_all_group_standings(db: db) -> list:
        try:
            query="""
                SELECT * FROM group_standing
            """
            cursor = db.conn.cursor()
            cursor.execute(query)
            result = cursor.fetchall()
            cursor.close()
            return result
        except mysql.connector.Error as err:
            print (f"Error: {err}")
    
    @staticmethod
    def update_group_standing(db: db, group_standing: GroupStanding) -> None:
        try:
            query="""
                UPDATE group_standing SET
                    played=%s,
                    wins=%s,
                    draws=%s,
                    losses=%s,
                    goals_for=%s,
                    goals_against=%s,
                    goal_difference=%s,
                    points=%s,
                    advanced=%s
                    WHERE tournament_id=%s AND stage_number=%s AND group_name=%s AND position=%s
                    """
            cursor = db.conn.cursor()
            cursor.execute(query, (
                group_standing.played,
                group_standing.wins,
                group_standing.draws,
                group_standing.losses,
                group_standing.goals_for,
                group_standing.goals_against,
                group_standing.goal_difference,
                group_standing.points,
                group_standing.advanced,
                group_standing.tournament_id,
                group_standing.stage_number,
                group_standing.group_name,
                group_standing.position
                ))
            db.conn.commit()
            cursor.close()
            print("Group_standing updated")
        except mysql.connector.Error as err:
            print (f"Error: {err}")
    
    @staticmethod
    def delete_group_standing(db: db, tournament_id: str, stage_number: int, group_name: str, position: str) -> None:
        try:
            query="""
                DELETE FROM group_standing
                WHERE tournament_id=%s AND stage_number=%s AND group_name=%s AND position=%s
                """
            cursor = db.conn.cursor()
            cursor.execute(query, (
                tournament_id,
                stage_number,
                group_name,
                position
                ))
            db.conn.commit()
            cursor.close()
            print("Group_standing deleted")
        except mysql.connector.Error as err:
            print (f"Error: {err}")
    
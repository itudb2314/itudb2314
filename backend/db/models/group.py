from dataclasses import dataclass

import mysql.connector
from db.db import db

@dataclass
class Group():
    tournament_id : str
    stage_number: int
    stage_name: str
    group_stage: int
    count_team: int

class GroupDAO():
    @staticmethod
    def insert_group(db: db, group: Group) -> None:
        try:
            query = """
                INSERT INTO 'groups' (
                    tournament_id,
                    stage_number,
                    stage_name,
                    group_stage,
                    count_team
                ) VALUES (%s, %s, %s, %s, %s)
            """
            cursor = db.conn.cursor()
            cursor.execute(query, (
                group.tournament_id,
                group.stage_number,
                group.stage_name,
                group.group_stage,
                group.count_team
            ))
            cursor.close()
            db.conn.commit()
            print("Group created successfully.")
        except mysql.connector.Error as err:
            print(f"Error: {err}")
    
    @staticmethod
    def get_group(db: db, tournament_id: str, stage_number: int, group_name:str) -> list:
        try:
            query = """
                SELECT * FROM 'groups' WHERE tournament_id = %s AND stage_number = %s AND group_name = %s
            """
            cursor = db.conn.cursor()
            cursor.execute(query, (tournament_id, stage_number, group_name))
            result = cursor.fetchall()
            cursor.close()
            return result
        except mysql.connector.Error as err:
            print(f"Error: {err}")

    @staticmethod
    def get_all_groups(db: db) -> list:
        try:
            query = """
                SELECT * FROM 'groups'
            """
            cursor = db.conn.cursor()
            cursor.execute(query)
            result = cursor.fetchall()
            cursor.close()
            return result
        except mysql.connector.Error as err:
            print(f"Error: {err}")
    
    @staticmethod
    def update_group(db: db, group: Group) -> None:
        try:
            query = """
                UPDATE 'groups' SET
                    group_stage = %s,
                    count_team = %s
                WHERE tournament_id = %s AND stage_number = %s AND group_name = %s
            """
            cursor = db.conn.cursor()
            cursor.execute(query, (
                group.group_stage,
                group.count_team,
                group.tournament_id,
                group.stage_number,
                group.group_name
            ))
            cursor.close()
            db.conn.commit()
            print("Group updated successfully.")
        except mysql.connector.Error as err:
            print(f"Error: {err}")
    
    @staticmethod
    def delete_group(db: db, tournament_id: str, stage_number: int, group_name:str) -> None:
        try:
            query = """
                DELETE FROM 'groups' WHERE tournament_id = %s AND stage_number = %s AND group_name = %s
            """
            cursor = db.conn.cursor()
            cursor.execute(query, (tournament_id, stage_number, group_name))
            cursor.close()
            db.conn.commit()
            print("Group deleted successfully.")
        except mysql.connector.Error as err:
            print(f"Error: {err}")
    
from dataclasses import dataclass

import mysql.connector
from db.db import db


@dataclass
class Group:
    tournament_id : str
    stage_number: int
    stage_name: str
    group_stage: int
    count_team: int


class GroupDAO:
    @staticmethod
    def insert_group(db: db, group: Group) -> None:
        try:
            conn = db.get_connection()
            query = """
                INSERT INTO 'groups' (
                    tournament_id,
                    stage_number,
                    stage_name,
                    group_stage,
                    count_team
                ) VALUES (%s, %s, %s, %s, %s)
            """
            cursor = conn.cursor()
            cursor.execute(query, (
                group.tournament_id,
                group.stage_number,
                group.stage_name,
                group.group_stage,
                group.count_team
            ))
            conn.commit()
        except mysql.connector.Error as err:
            conn.rollback()
        finally:
            cursor.close()
            conn.close()
    
    @staticmethod
    def get_group(db: db, tournament_id: str, stage_number: int, group_name:str) -> Group:
        try:
            conn = db.get_connection()
            query = """
                SELECT * FROM 'groups' WHERE tournament_id = %s AND stage_number = %s AND group_name = %s
            """
            cursor = conn.cursor()
            cursor.execute(query, (tournament_id, stage_number, group_name))
            result = cursor.fetchall()
            if result is None:
                return None
            return Group(*result)
        except mysql.connector.Error as err:
            conn.rollback()
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def get_all_groups_on_tournament(db: db, tournament_id: str) -> list[Group]:
        try:
            conn = db.get_connection()
            query = """
                SELECT * FROM 'groups' WHERE tournament_id = %s
            """
            cursor = conn.cursor()
            cursor.execute(query, (tournament_id,))
            results = cursor.fetchall()
            return [Group(*row) for row in results]
        except mysql.connector.Error as err:
            conn.rollback()
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def get_all_groups_on_stage(db: db, tournament_id: str, stage_number: int) -> list[Group]:
        try:
            conn = db.get_connection()
            query = """
                SELECT * FROM 'groups' WHERE tournament_id = %s AND stage_number = %s
            """
            cursor = conn.cursor()
            cursor.execute(query, (tournament_id, stage_number))
            results = cursor.fetchall()
            return [Group(*row) for row in results]
        except mysql.connector.Error as err:
            conn.rollback()
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def get_all_groups(db: db) -> list[Group]:
        try:
            conn = db.get_connection()
            query = """
                SELECT * FROM 'groups'
            """
            cursor = conn.cursor()
            cursor.execute(query)
            results = cursor.fetchall()
            
            return [Group(*row) for row in results]
        except mysql.connector.Error as err:
            conn.rollback()
        finally:
            cursor.close()
            conn.close()
    
    @staticmethod
    def update_group(db: db, group: Group) -> None:
        try:
            conn = db.get_connection()
            query = """
                UPDATE 'groups' SET
                    group_stage = %s,
                    count_team = %s
                WHERE tournament_id = %s AND stage_number = %s AND group_name = %s
            """
            cursor = conn.cursor()
            cursor.execute(query, (
                group.group_stage,
                group.count_team,
                group.tournament_id,
                group.stage_number,
                group.group_name
            ))
            conn.commit()
        except mysql.connector.Error as err:
            conn.rollback()
        finally:
            cursor.close()
            conn.close()
    
    @staticmethod
    def delete_group(db: db, tournament_id: str, stage_number: int, group_name:str) -> None:
        try:
            conn = db.get_connection()
            query = """
                DELETE FROM 'groups' WHERE tournament_id = %s AND stage_number = %s AND group_name = %s
            """
            cursor = conn.cursor()
            cursor.execute(query, (tournament_id, stage_number, group_name))
            conn.commit()
        except mysql.connector.Error as err:
            conn.rollback()
        finally:
            cursor.close()
            conn.close()
    

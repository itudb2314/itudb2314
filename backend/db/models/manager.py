from dataclasses import dataclass

import mysql.connector
from db.db import db


@dataclass
class Manager:
    manager_id: str
    family_name: str
    given_name: str
    female: bool
    country_name: str
    manager_wikipedia_link: str


class ManagerDAO():
    @staticmethod
    def insert_manager(db: db, manager: Manager) -> None:
        try:
            conn = db.get_connection()
            query = """
                INSERT INTO managers (
                    manager_id,
                    family_name,
                    given_name,
                    female,
                    country_name,
                    manager_wikipedia_link
                ) VALUES (%s, %s, %s, %s, %s, %s)
            """
            cursor = conn.cursor()
            cursor.execute(query, (
                manager.manager_id,
                manager.family_name,
                manager.given_name,
                manager.female,
                manager.country_name,
                manager.manager_wikipedia_link
            ))
            cursor.close()
            conn.commit()
        except mysql.connector.Error as err:
            conn.rollback()
        finally:
            cursor.close()
            conn.close()

    
    @staticmethod
    def get_manager(db: db, manager_id: str) -> Manager:
        try:
            conn = db.get_connection()
            query = """
                SELECT * FROM managers WHERE manager_id = %s
            """
            cursor = conn.cursor()
            cursor.execute(query, (manager_id))
            result = cursor.fetchall()
            cursor.close()
            if result is None:
                return None
            return Manager(*result)
        except mysql.connector.Error as err:
            conn.rollback()
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def get_all_managers(db: db) -> list:
        try:
            conn = db.get_connection()
            query = """
                SELECT * FROM managers
            """
            cursor = conn.cursor()
            cursor.execute(query)
            result = cursor.fetchall()
            return [Manager(*row) for row in result]
        except mysql.connector.Error as err:
            conn.rollback()
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def update_manager(db: db, manager: Manager) -> None:
        try:
            conn = db.get_connection()
            query = """
                UPDATE managers SET
                    family_name = %s,
                    given_name = %s,
                    female = %s,
                    country_name = %s,
                    manager_wikipedia_link = %s
                WHERE manager_id = %s
            """
            cursor = conn.cursor()
            cursor.execute(query, (
                manager.family_name,
                manager.given_name,
                manager.female,
                manager.country_name,
                manager.manager_wikipedia_link,
                manager.manager_id,
            ))
            conn.commit()
        except mysql.connector.Error as err:
            print("Mysql Error:", err)
            conn.rollback()
        finally:
            cursor.close()
            conn.close()
    
    @staticmethod
    def delete_manager(db: db, manager_id: str) -> None:
        try:
            conn = db.get_connection()
            query = """
                DELETE FROM managers WHERE manager_id = %s
            """
            cursor = conn.cursor()
            cursor.execute(query, (manager_id,))
            conn.commit()
        except mysql.connector.Error as err:
            conn.rollback()
        finally:
            cursor.close()
            conn.close()
    

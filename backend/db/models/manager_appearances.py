from dataclasses import dataclass

import mysql.connector
from db.db import db


@dataclass
class ManagerAppearances:
    tournament_id: str
    match_id: str
    team_id: str
    home_team: str
    away_team: str
    manager_id: str


class ManagerAppearancesDAO():
    @staticmethod
    def insert_manager_appearances(db: db, manager_appearances: ManagerAppearances) -> None:
        try:
            query="""
                INSERT INTO manager_appearances (
                    tournament_id,
                    match_id,
                    team_id,
                    home_team,
                    away_team,
                    manager_id
                    ) VALUES (%s,%s,%s,%s,%s,%s)
                    """
            cursor = db.conn.cursor()
            cursor.execute(query, (
                manager_appearances.tournament_id,
                manager_appearances.match_id,
                manager_appearances.team_id,
                manager_appearances.home_team,
                manager_appearances.away_team,
                manager_appearances.manager_id
                ))
            db.conn.commit()
            cursor.close()
        except mysql.connector.Error as err:
            print (f"Error: {err}")

    @staticmethod
    def get_manager_appearances(db: db, tournament_id: str, match_id: str, team_id: str, manger_id: str) -> list:
        try:
            query="""
                SELECT * FROM manager_appearances
                WHERE tournament_id=%s AND match_id=%s AND team_id=%s AND manager_id=%s
                """
            cursor = db.conn.cursor()
            cursor.execute(query, (
                tournament_id,
                match_id,
                team_id,
                manger_id
                ))
            result = cursor.fetchone()
            cursor.close()
            return result
        except mysql.connector.Error as err:
            print (f"Error: {err}")
        
    @staticmethod
    def get_all_manager_appearances(db: db) -> list:
        try:
            query="""
                SELECT * FROM manager_appearances
            """
            cursor = db.conn.cursor()
            cursor.execute(query)
            result = cursor.fetchall()
            cursor.close()
            return result
        except mysql.connector.Error as err:
            print (f"Error: {err}")
    
    @staticmethod
    def update_manager_appearances(db: db, manager_appearances: ManagerAppearances) -> None:
        try:
            query="""
                UPDATE manager_appearances 
                    SET home_team=%s,
                    away_team=%s,
                    WHERE tournament_id=%s AND match_id=%s AND team_id=%s AND manager_id=%s
                """
            cursor = db.conn.cursor()
            cursor.execute(query, (
                manager_appearances.home_team,
                manager_appearances.away_team,
                manager_appearances.tournament_id,
                manager_appearances.match_id,
                manager_appearances.team_id,
                manager_appearances.manager_id
                ))
            db.conn.commit()
            cursor.close()

        except mysql.connector.Error as err:
            print (f"Error: {err}")

    @staticmethod
    def delete_manager_appearances(db: db, tournament_id: str, match_id: str, team_id: str, manger_id: str) -> None:
        try:
            query="""
                DELETE FROM manager_appearances
                WHERE tournament_id=%s AND match_id=%s AND team_id=%s AND manager_id=%s
                """
            cursor = db.conn.cursor()
            cursor.execute(query, (
                tournament_id,
                match_id,
                team_id,
                manger_id
                ))
            db.conn.commit()
            cursor.close()
        except mysql.connector.Error as err:
            print (f"Error: {err}")
    
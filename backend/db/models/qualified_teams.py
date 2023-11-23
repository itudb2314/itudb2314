from dataclasses import dataclass
import mysql.connector
from mysql.connector import errorcode
from db.db import db

@dataclass
class QualifiedTeams:
    tournament_id: str
    team_id: str
    count_matches: int
    performance: str


class QualifiedTeamsDAO():
    @staticmethod
    def create_qualified_team(db:db, qt: QualifiedTeams) -> None:
        try:
            conn = db.get_connection()
            query = """INSERT INTO qualified_teams (
                    tournament_id, 
                    team_id,
                    count_matches,
                    performance
                ) VALUES (%s, %s, %s, %s)
            """
            cursor = conn.cursor()
            cursor.execute(query, (
                qt.tournament_id, 
                qt.team_id, 
                qt.count_matches, 
                qt.performance
            ))
            conn.commit()
            cursor.close()
            db.disconnect(conn)
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            db.disconnect(conn)
    
    @staticmethod
    def get_all_qualified_teams(db:db) -> list:
        try:
            conn = db.get_connection()
            query = """SELECT * FROM qualified_teams"""
            cursor = conn.cursor()
            cursor.execute(query)
            rows = cursor.fetchall()
            qualified_teams = []
            for row in rows:
                qualified_teams.append(QualifiedTeams(
                    row[0],
                    row[1],
                    row[2],
                    row[3]
                ))
            cursor.close()
            db.disconnect(conn)
            return qualified_teams
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            db.disconnect(conn)
    
    @staticmethod
    def get_all_qualified_teams_by_tournament(db:db, tournament_id:str) -> list:
        try:
            conn = db.get_connection()
            query = """SELECT * FROM qualified_teams WHERE tournament_id = %s"""
            cursor = conn.cursor()
            cursor.execute(query, (tournament_id,))
            rows = cursor.fetchall()
            qualified_teams = []
            for row in rows:
                qualified_teams.append(QualifiedTeams(
                    row[0],
                    row[1],
                    row[2],
                    row[3]
                ))
            cursor.close()
            db.disconnect(conn)
            return qualified_teams
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            db.disconnect(conn)
            
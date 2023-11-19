from dataclasses import dataclass
from db.db import db
import mysql.connector
from mysql.connector import errorcode


@dataclass
class Teams:
    team_id: str
    team_name: str
    team_code: str
    mens_team: bool
    womens_team: bool
    federation_name: str
    region_name: str
    confederation_id: str
    mens_team_wikipedia_link: str
    womens_team_wikipedia_link: str
    federation_wikipedia_link: str



class TeamsDAO():
    @staticmethod
    def create_team(db: db, team: Teams) -> None:
        try:
            conn = db.get_connection
            query = """INSERT INTO teams (
                        team_id,
                        team_name,
                        team_code,
                        mens_team,
                        womens_team,
                        federation_name,
                        region_name,
                        confederation_id,
                        mens_team_wikipedia_link,
                        womens_team_wikipedia_link,
                        federation_wikipedia_link
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor = conn.cursor()
            cursor.execute(query, (
                team.team_id,
                team.team_name,
                team.team_code,
                team.mens_team,
                team.womens_team,
                team.federation_name,
                team.region_name,
                team.confederation_id,
                team.mens_team_wikipedia_link,
                team.womens_team_wikipedia_link,
                team.federation_wikipedia_link
            ))
            cursor.close()
            conn.commit()
        except mysql.connector.Error as err:
            print(f"Error: {err}")
        finally:
            db.disconnect(conn)


    @staticmethod
    def get_team_by_id(db:db, team_id: str) -> Teams:
        try:
            conn  = db.get_connection()
            query = "SELECT * FROM teams WHERE team_id = %s"
            cursor = conn.cursor()
            cursor.execute(query, (team_id,))
            row = cursor.fetchone()
            cursor.close()
            if row is None:
                return None
            return Teams(*row)
        except mysql.connector.Error as err:
            print(f"Error: {err}")
        finally:
            db.disconnect(conn)


    @staticmethod
    def get_all_teams(db:db) -> list[Teams]:
        try:
            conn = db.get_connection()
            query = "SELECT * FROM teams"
            cursor = conn.cursor()
            cursor.execute(query)
            rows = cursor.fetchall()
            cursor.close()
            return [Teams(*row) for row in rows]
        except mysql.connector.Error as err:
            print(f"Error: {err}")
        finally:
            db.disconnect(conn)



    @staticmethod
    def update_team(db:db, team: Teams) -> None:
        try:
            conn = db.get_connection()
            query = """
                UPDATE teams SET
                    team_name = %s,
                    team_code = %s,
                    mens_team = %s,
                    womens_team = %s,
                    federation_name = %s,
                    region_name = %s,
                    confederation_id = %s,
                    mens_team_wikipedia_link = %s,
                    womens_team_wikipedia_link = %s,
                    federation_wikipedia_link = %s
                WHERE team_id = %s
            """
            cursor = conn.cursor()
            cursor.execute(query, (
                team.team_name,
                team.team_code,
                team.mens_team,
                team.womens_team,
                team.federation_name,
                team.region_name,
                team.confederation_id,
                team.mens_team_wikipedia_link,
                team.womens_team_wikipedia_link,
                team.federation_wikipedia_link,
                team.team_id
            ))
            cursor.close()
            conn.commit()
        except mysql.connector.Error as err:
            print(f"Error: {err}")
        finally:
            db.disconnect(conn)


    @staticmethod
    def delete_team(db:db, team_id: str) -> None:
        try:
            conn = db.get_connection()
            query = "DELETE FROM teams WHERE team_id = %s"
            cursor = conn.cursor()
            cursor.execute(query, (team_id,))
            cursor.close()
            conn.commit()
        except mysql.connector.Error as err:
            print(f"Error: {err}")
        finally:
            db.disconnect(conn)

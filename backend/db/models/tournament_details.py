from datetime import datetime
from dataclasses import asdict
from dataclasses import dataclass
from db.db import db
import mysql.connector
from mysql.connector import errorcode


class TournamentDetailsDAO:
    @staticmethod
    def get_tournament_details(db: db, tournament_id: str):
        try:
            conn = db.get_connection()
            query =
            """
                SELECT 
            """
            cursor = conn.cursor()
            cursor.execute(query, (tournament_id,))
            result = cursor.fetchall()
            return result
        except mysql.connector.Error as err:
            print(err)
        finally:
            cursor.close()
            conn.close()

from dataclasses import asdict
from dataclasses import dataclass
from db.db import db
import mysql.connector
from mysql.connector import errorcode


@dataclass
class Confederation:
    confederation_id: str
    confederation_name: str


class ConfederationDAO:
    @staticmethod
    def get_confederation_names(db: db):
        try:
            conn = db.get_connection()
            query = "SELECT confederation_id, confederation_name FROM confederations;"
            cursor = conn.cursor()
            cursor.execute(query)
            result = cursor.fetchall()
            return [Confederation(*row) for row in result]
        except mysql.connector.Error as err:
            print(f"Mysql Error: {err}")
        finally:
            cursor.close()
            conn.close()

# Description: This file contains the class for the database object

import mysql.connector
from db.models.squad import *

# Class: db
# Description: This class contains the database object
class db:
    def __init__(self, db_name):
        self.db_name = db_name
        self.db_username = "root"
        self.db_password = "root"
        self.conn = None

    def connect(self):
        try :
            self.conn = mysql.connector.connect(
                host="127.0.0.1",
                port="3306",
                user=self.db_username,
                password=self.db_password,
                database=self.db_name,
                auth_plugin='mysql_native_password'
            )
        except mysql.connector.Error as err:
            print(f"Error: {err}")

    def disconnect(self):
        if self.conn:
            self.conn.close()
            self.conn = None
        else:
            print("No active connection to close.")

    def get_squad(self, tournament_id):
        if self.conn:
            cursor = self.conn.cursor()
            cursor.execute(f"SELECT * FROM squads WHERE tournament_id = '{tournament_id}'")
            squads = []
            rows = cursor.fetchall()
            for row in rows:
                squad = Squad(
                    row[0],
                    row[1],
                    row[2],
                    row[3],
                    row[4],
                    row[5],
                )
                squads.append(squad)
            return squads

        else:
            print("No active connection to database.")

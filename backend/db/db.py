# Description: This file contains the class for the database object

import mysql.connector
from db.models.squads import *
from db.models.player_apperances import *
from db.models.players import *

# Class: db
# Description: This class contains the database object
class db:
    def __init__(self, db_name):
        self.db_name = db_name
        self.db_username = "root"
        self.db_password = "root"                           #different at my own computer was root
        self.conn = None

    def connect(self):
        try :
            self.conn = mysql.connector.connect(
                host="127.0.0.1",
                port="3306",                                #different at my own computer was 3306
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

    ###############################################  Squads CRUD starts here ###############################################

    # Function: create_squad
    def create_squad(self, tournament_id, team_id, player_id, shirt_number, position_name, position_code):
        if self.conn:
            cursor = self.conn.cursor()
            cursor.execute(f"INSERT INTO squads VALUES ('{tournament_id}', '{team_id}', '{player_id}', '{shirt_number}', '{position_name}', '{position_code}')")
            self.conn.commit()
            print("Squad created successfully.")
            return True
        else:
            print("No active connection to database.")

    # Function: get_all_squad
    def get_all_squad(self):
        if self.conn:
            cursor = self.conn.cursor()
            cursor.execute(f"SELECT * FROM squads")
            squads = []
            rows = cursor.fetchall()
            for row in rows:
                squad = Squads(
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

    # Function: get_specific_squad
    def get_specific_squad(self, tournament_id, team_id, player_id):
        if self.conn:
            cursor = self.conn.cursor()
            cursor.execute(f"SELECT * FROM squads WHERE tournament_id = '{tournament_id}' AND team_id = '{team_id}' AND player_id = '{player_id}'")
            fields = cursor.fetchall()
            for field in fields:
                squad = Squads(
                    field[0],
                    field[1],
                    field[2],
                    field[3],
                    field[4],
                    field[5],
                )
            return squad
        else:
            print("No active connection to database.")
            
    # Function: update_squad
    def update_squad(self, tournament_id, team_id, player_id, shirt_number, position_name, position_code):
        if self.conn:
            cursor = self.conn.cursor()
            cursor.execute(f"UPDATE squads SET shirt_number = '{shirt_number}', position_name = '{position_name}', position_code = '{position_code}' WHERE tournament_id = '{tournament_id}' AND team_id = '{team_id}' AND player_id = '{player_id}'")
            self.conn.commit()
            print("Squad updated successfully.")
            return True
        else:
            print("No active connection to database.")

    # Function: delete_squad
    def delete_squad(self, tournament_id, team_id, player_id):
        if self.conn:
            cursor = self.conn.cursor()
            cursor.execute(f"DELETE FROM squads WHERE tournament_id = '{tournament_id}' AND team_id = '{team_id}' AND player_id = '{player_id}'")
            self.conn.commit()
            print("Squad deleted successfully.")
            return True
        else:
            print("No active connection to database.")

    ###############################################  Squads CRUD ends here ###############################################
# Description: This file contains the class for the database object

import mysql.connector

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

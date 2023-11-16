# Description: This file contains the class for the database object

import mysql.connector

# Class: db
# Description: This class contains the database object
class db:
    def __init__(self, db_name):
        self.db_name = db_name
        self.db_username = "root"
        self.db_password = "root"                           #different at my own computer was root

    def get_connection(self):
        try:
            connection = mysql.connector.connect(
                host="127.0.0.1",
                port="3306",                                #different at my own computer was 3306
                user=self.db_username,
                password=self.db_password,
                database=self.db_name,
                auth_plugin='mysql_native_password'
            )
            return connection
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            return None

    @staticmethod
    def disconnect(connection):
        if connection:
            connection.close()

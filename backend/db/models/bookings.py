from db.db import db
from dataclasses import dataclass
import mysql.connector
from mysql.connector import errorcode
from typing import List

@dataclass
class Booking:
    booking_id: str
    tournament_id: str
    match_id: str
    team_id: str
    home_team: bool
    away_team: bool
    player_id: str
    shirt_number: int
    player_team_id: str
    minute_label: str
    minute_regulation: int
    minute_stoppage: int
    match_period: str
    yellow_card: bool
    red_card: bool
    second_yellow_card: bool
    sending_off: bool

class BookingsDOA:
    @staticmethod
    def get_match_bookings(db : db, match_id : str):
        try:
            connection = db.get_connection()
            query = """ SELECT * FROM bookings WHERE match_id = %s """
            cursor = connection.cursor()
            cursor.execute(query, (match_id,))
            results = cursor.fetchall()
            bookings = []
            for result in results:
                booking = Booking(result[0], result[1], result[2], result[3], result[4], result[5],
                                result[6], result[7], result[8], result[9], result[10], result[11], 
                                result[12], result[13], result[14], result[15], result[16])
                bookings.append(booking)
            return bookings
        except mysql.connector.Error as error:
            print(error)
            connection.rollback()
        finally:
            connection.close()
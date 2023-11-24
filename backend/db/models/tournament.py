from datetime import datetime
from dataclasses import asdict
from dataclasses import dataclass
from db.db import db
import mysql.connector
from mysql.connector import errorcode


@dataclass
class Tournament:
    tournament_id: str
    tournament_name: str
    year: int
    start_date: datetime.date
    end_date: datetime.date
    host_country: str
    winner: str
    host_won: bool
    count_teams: int
    group_stage: bool
    second_group_stage: bool
    final_round: bool
    round_of_16: bool
    quarter_finals: bool
    semi_finals: bool
    third_place_match: bool
    final: bool


class TournamentDAO():
    @staticmethod
    def create_tournament(db: db, tournament: Tournament) -> None:
        try:
            conn = db.get_connection()
            query = """INSERT INTO tournaments (
                        tournament_id,
                        tournament_name,
                        year,
                        start_date,
                        end_date,
                        host_country,
                        winner,
                        host_won,
                        count_teams,
                        group_stage,
                        second_group_stage,
                        final_round,
                        round_of_16,
                        quarter_finals,
                        semi_finals,
                        third_place_match,
                        final
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
            cursor = conn.cursor()
            cursor.execute(query, (
                tournament.tournament_id,
                tournament.tournament_name,
                tournament.year,
                tournament.start_date,
                tournament.end_date,
                tournament.host_country,
                tournament.winner,
                tournament.host_won,
                tournament.count_teams,
                tournament.group_stage,
                tournament.second_group_stage,
                tournament.final_round,
                tournament.round_of_16,
                tournament.quarter_finals,
                tournament.semi_finals,
                tournament.third_place_match,
                tournament.final
            ))
            cursor.close()
            conn.commit()
            db.disconnect(conn)
        except mysql.connector.Error as err:
            print(f"Error: {err}")

    @staticmethod
    def get_tournament_by_id(db: db, tournament_id: str) -> Tournament:
        try:
            conn = db.get_connection()
            query = "SELECT * FROM tournaments WHERE tournament_id = %s"
            cursor = conn.cursor()
            cursor.execute(query, (tournament_id,))
            rows = cursor.fetchone()
            cursor.close()
            conn.close()
            if rows is None:
                return None
            return Tournament(*rows)
        except mysql.connector.Error as err:
            print(f"Error: {err}")

    @staticmethod
    def get_all_tournaments(db) -> list[Tournament]:
        try:
            conn = db.get_connection()
            query = "SELECT * FROM tournaments"
            cursor = conn.cursor()
            cursor.execute(query)
            rows = cursor.fetchall()
            cursor.close()
            db.disconnect(conn)
            return [Tournament(*row) for row in rows]
        except mysql.connector.Error as err:
            print(f"Error: {err}")

    @staticmethod
    def update_tournament(db, tournament: Tournament) -> Tournament:
        try:
            conn = db.get_connection()
            query = """
                    UPDATE tournaments SET
                        tournament_name = %s,
                        year = %s,
                        start_date = %s,
                        end_date = %s,
                        host_country = %s,
                        winner = %s,
                        host_won = %s,
                        count_teams = %s,
                        group_stage = %s,
                        second_group_stage = %s,
                        final_round = %s,
                        round_of_16 = %s,
                        quarter_finals = %s,
                        semi_finals = %s,
                        third_place_match = %s,
                        final = %s
                    WHERE tournament_id = %s
                """
            cursor = conn.cursor()
            cursor.execute(query, (
                tournament.tournament_name,
                tournament.year,
                datetime.strptime(tournament.start_date, "%a, %d %b %Y %H:%M:%S %Z").strftime("%Y-%m-%d"),
                datetime.strptime(tournament.end_date, "%a, %d %b %Y %H:%M:%S %Z").strftime("%Y-%m-%d"),
                tournament.host_country,
                tournament.winner,
                tournament.host_won,
                tournament.count_teams,
                tournament.group_stage,
                tournament.second_group_stage,
                tournament.final_round,
                tournament.round_of_16,
                tournament.quarter_finals,
                tournament.semi_finals,
                tournament.third_place_match,
                tournament.final,
                tournament.tournament_id
            ))
            cursor.close()
            conn.commit()
            conn.close()
            return TournamentDAO.get_tournament_by_id(db, tournament.tournament_id)
        except mysql.connector.Error as err:
            print(f"Error: {err}")

    @staticmethod
    def delete_tournament(db, tournament_id: int) -> None:
        try:
            conn = db.get_connection()
            query = "DELETE FROM tournaments WHERE tournament_id = %s"
            cursor = conn.cursor()
            cursor.execute(query, (tournament_id,))
            cursor.close()
            conn.commit()
            conn.close()
        except mysql.connector.Error as err:
            print(f"Error: {err}")

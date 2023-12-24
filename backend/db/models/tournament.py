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


@dataclass 
class TournamentWithPlaces:
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
    second: str
    third: str
    fourth: str


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
            query = "SELECT * FROM tournaments WHERE tournament_id = %s LIMIT 1"
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
    def get_all_tournaments(db: db, sort: str, order: str, gender: str) -> list[TournamentWithPlaces]:
        try:
            conn = db.get_connection()
            query = f"""WITH second AS (SELECT tournament_id, team_name AS second from tournament_standings LEFT JOIN teams using(team_id) WHERE position = 2),
                        third AS (SELECT tournament_id, team_name AS third from tournament_standings LEFT JOIN teams using(team_id) WHERE position = 3),
                        fourth AS (SELECT tournament_id, team_name AS fourth from tournament_standings LEFT JOIN teams using(team_id) WHERE position = 4)
                        select * from tournaments
                            LEFT JOIN second using(tournament_id)
                            LEFT JOIN third using(tournament_id)
                            LEFT JOIN fourth using(tournament_id)
                        WHERE tournament_name 
                        LIKE %s
                        ORDER BY {sort} {order}
                    """
            cursor = conn.cursor()
            cursor.execute(query, (gender,))
            rows = cursor.fetchall()
            cursor.close()
            db.disconnect(conn)
            tournaments = [TournamentWithPlaces(*row) for row in rows]
            return tournaments
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            conn.rollback()
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def get_tournament_stages(db, tournament_id: str) -> dict:
        try:
            connection = db.get_connection()
            query = """
                    SELECT
                        CASE 
                            WHEN group_stage AND tournament_id NOT IN('WC-1950', 'WC-1974', 'WC-1978', 'WC-1982') 
                            THEN "group stage" 
                            WHEN group_stage AND tournament_id = 'WC-1950' 
                            THEN "first round"
                            WHEN group_stage AND tournament_id IN('WC-1974', 'WC-1978', 'WC-1982') 
                            THEN "first group stage" 
                            ELSE NULL 
                        END AS group_stage_2,
                        CASE 
                            WHEN second_group_stage 
                            THEN "second group stage" 
                            ELSE NULL 
                        END AS second_group_stage,
                        CASE 
                            WHEN final_round 
                            THEN "final round" ELSE NULL 
                        END AS final_round,
                        CASE 
                            WHEN round_of_16 
                            THEN "round of 16" ELSE NULL 
                        END AS round_of_16,
                        CASE 
                            WHEN quarter_finals 
                            THEN "quarter finals" ELSE NULL 
                        END AS quarter_finals,
                        CASE 
                            WHEN semi_finals 
                            THEN "semi finals" ELSE NULL 
                        END AS semi_finals,
                        CASE 
                            WHEN third_place_match 
                            THEN "third place match" ELSE NULL 
                        END AS third_place_match,
                        CASE 
                            WHEN final 
                            THEN "final" ELSE NULL 
                        END AS final
                    FROM tournaments
                    WHERE tournament_id = %s
                """
            cursor = connection.cursor()
            cursor.execute(query, (tournament_id,))
            result = cursor.fetchone()
            stages = []
            for result in result:
                if result is not None:
                    stages.append(result)
            cursor.close()
            connection.close()
            return stages

        except mysql.connector.Error as err:
            print(f"Error: {err}")
            connection.rollback()
        finally:
            cursor.close()
            connection.close()


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

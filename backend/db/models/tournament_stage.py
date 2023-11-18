from datetime import date
from dataclasses import dataclass

import mysql.connector
from mysql.connector import errorcode
from db.db import db


@dataclass
class TournamentStage:
    tournament_id: str
    stage_number: int
    stage_name: str
    group_stage: int
    knockout_stage: int 
    unbalanced_groups: int
    start_date: date
    end_date: date 
    count_matches: int   
    count_teams: int
    count_scheduled: int 
    count_replays: int
    count_playoffs: int
    count_walkovers: int

class TournamentStageDAO():
    @staticmethod
    def create_tournament_stage(db: db, tournament_stage: TournamentStage) -> None:
        try:
            query = """
                INSERT INTO tournament_stages (
                    tournament_id,
                    stage_number,
                    stage_name,
                    group_stage,
                    knockout_stage,
                    unbalanced_groups,
                    start_date,
                    end_date,
                    count_matches,
                    count_teams,
                    count_scheduled,
                    count_replays,
                    count_playoffs,
                    count_walkovers
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor = db.conn.cursor()
            cursor.execute(query, (
                tournament_stage.tournament_id,
                tournament_stage.stage_number,
                tournament_stage.stage_name,
                tournament_stage.group_stage,
                tournament_stage.knockout_stage,
                tournament_stage.unbalanced_groups,
                tournament_stage.start_date,
                tournament_stage.end_date,
                tournament_stage.count_matches,
                tournament_stage.count_teams,
                tournament_stage.count_scheduled,
                tournament_stage.count_replays,
                tournament_stage.count_playoffs,
                tournament_stage.count_walkovers
            ))
            cursor.close()
            db.conn.commit()
        except mysql.connector.Error as err:
            print(f"Error: {err}")

    @staticmethod
    def get_tournament_stage_by_id(db: db, tournament_id: str, stage_number: int) -> TournamentStage:
        try:
            conn = db.get_connection()
            query = "SELECT * FROM tournament_stages WHERE tournament_id = %s AND stage_number = %s"
            cursor = conn.cursor()
            cursor.execute(query, (tournament_id, stage_number))
            row = cursor.fetchone()
            cursor.close()
            conn.close()
            if row is None:
                return None
            return TournamentStage(*row)
        except mysql.connector.Error as err:
            print(f"Error: {err}")

    @staticmethod
    def get_all_stages(db: db, tournament_id: str) -> list[TournamentStage]:
        try:
            conn = db.get_connection()
            query = "SELECT * FROM tournament_stages WHERE tournament_id = %s"
            cursor = conn.cursor()
            cursor.execute(query, (tournament_id,))
            rows = cursor.fetchall()
            cursor.close()
            conn.close()
            if rows is None:
                return None
            return [TournamentStage(*row) for row in rows]
        except mysql.connector.Error as err:
            print(f"Error: {err}")

    @staticmethod
    def update_tournament_stage(db: db, tournament_stage: TournamentStage) -> None:
        try:
            query = """
                UPDATE tournament_stages SET
                    stage_name = %s,
                    group_stage = %s,
                    knockout_stage = %s,
                    unbalanced_groups = %s,
                    start_date = %s,
                    end_date = %s,
                    count_matches = %s,
                    count_teams = %s,
                    count_scheduled = %s,
                    count_replays = %s,
                    count_playoffs = %s,
                    count_walkovers = %s
                WHERE tournament_id = %s AND stage_number = %s
            """
            cursor = db.conn.cursor()
            cursor.execute(query, (
                tournament_stage.stage_name,
                tournament_stage.group_stage,
                tournament_stage.knockout_stage,
                tournament_stage.unbalanced_groups,
                tournament_stage.start_date,
                tournament_stage.end_date,
                tournament_stage.count_matches,
                tournament_stage.count_teams,
                tournament_stage.count_scheduled,
                tournament_stage.count_replays,
                tournament_stage.count_playoffs,
                tournament_stage.count_walkovers,
                tournament_stage.tournament_id,
                tournament_stage.stage_number
            ))
            cursor.close()
            db.conn.commit()
        except mysql.connector.Error as err:
            print(f"Error: {err}")

    @staticmethod
    def delete_tournament_stage(db: db, tournament_id: str, stage_number: int) -> None:
        try:
            query = "DELETE FROM tournament_stages WHERE tournament_id = %s AND stage_number = %s"
            cursor = db.conn.cursor()
            cursor.execute(query, (tournament_id, stage_number))
            cursor.close()
            db.conn.commit()
        except mysql.connector.Error as err:
            print(f"Error: {err}")
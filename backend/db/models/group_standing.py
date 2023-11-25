from dataclasses import dataclass

import mysql.connector
from db.db import db


@dataclass
class GroupStanding:
    tournament_id: str
    stage_number: int
    stage_name: str
    group_name: str
    position: str
    team_id: str
    played: int
    wins: int
    draws: int
    losses: int
    goals_for: int
    goals_against: int
    goal_difference: int
    points: int
    advanced: bool


@dataclass
class GroupStandings_of_Groups:
    group_name: str
    group_standings: list[GroupStanding]

@dataclass
class GroupStandings_of_Stages:
    stage_number: int
    stage_name: str
    grouplist: list[GroupStandings_of_Groups]

@dataclass
class Groups_of_Tournament:
    tournament_id: str
    stagedlist: list[GroupStandings_of_Stages]


class GroupStandingDAO():

    @staticmethod
    def insert_group_standing(db: db, group_standing: GroupStanding) -> None:
        try:
            conn = db.get_connection()
            query="""
                INSERT INTO group_standings (
                    tournament_id,
                    stage_number,
                    stage_name,
                    group_name,
                    position,
                    team_id,
                    played,
                    wins,
                    draws,
                    losses,
                    goals_for,
                    goals_against,
                    goal_difference,
                    points,
                    advanced
                ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"""
            
            cursor = conn.cursor()
            cursor.execute(query, (
                group_standing.tournament_id,
                group_standing.stage_number,
                group_standing.stage_name,
                group_standing.group_name,
                group_standing.position,
                group_standing.team_id,
                group_standing.played,
                group_standing.wins,
                group_standing.draws,
                group_standing.losses,
                group_standing.goals_for,
                group_standing.goals_against,
                group_standing.goal_difference,
                group_standing.points,
                group_standing.advanced
                ))
            conn.commit()

        except mysql.connector.Error as err:
            conn.rollback()
        finally:
            cursor.close()
            conn.close()
    
    @staticmethod
    def get_group_standing(db: db, tournament_id: str, stage_number: int, group_name: str, position: str) -> GroupStanding:

        try:
            conn = db.get_connection()
            query="""
                SELECT * FROM group_standings
                WHERE tournament_id=%s AND stage_number=%s AND group_name=%s AND position=%s
                """
            cursor = conn.cursor()
            cursor.execute(query, (
                tournament_id,
                stage_number,
                group_name,
                position
                ))
            result = cursor.fetchone()
            if result is None:
                return None
            return GroupStanding(*result)
        except mysql.connector.Error as err:
            conn.rollback()
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def get_all_group_standings_on_group(db: db, tournament_id: str, stage_number: int, group_name: str) -> list[GroupStanding]:
        try:
            conn = db.get_connection()
            query="""
                SELECT * FROM group_standings
                WHERE tournament_id=%s AND stage_number=%s AND group_name=%s
                """
            cursor = conn.cursor()
            cursor.execute(query, (
                tournament_id,
                stage_number,
                group_name
                ))
            result = cursor.fetchall()
            return [GroupStanding(*row) for row in result]
        except mysql.connector.Error as err:
            conn.rollback()
        finally:
            cursor.close()
            conn.close()
    
    @staticmethod
    def get_all_group_standings_on_stage(db: db, tournament_id: str, stage_number: int) -> list[GroupStanding]:
        try:
            conn = db.get_connection()
            query="""
                SELECT * FROM group_standings
                WHERE tournament_id=%s AND stage_number=%s
                """
            cursor = conn.cursor()
            cursor.execute(query, (
                tournament_id,
                stage_number
                ))
            result = cursor.fetchall()
            return [GroupStanding(*row) for row in result]
        except mysql.connector.Error as err:
            conn.rollback()
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def get_all_group_standings(db: db) -> list:
        try:
            conn = db.get_connection()
            query="""
                   SELECT * FROM group_standings
            """
            cursor = conn.cursor()
            cursor.execute(query)
            results = cursor.fetchall()

            tournament_list = {}
            staged_list = {}
            grouped_list = {}


            for result in results:
                tournament_id,stage_number,stage_name,group_name,position,team_id,played,wins,draws,losses,goals_for,goals_against,goal_difference,points,advanced = result
                key1 = (tournament_id)
                key2 = (tournament_id,stage_number)
                key3 = (tournament_id,stage_number,group_name)
                key4 = (tournament_id,stage_number,group_name,position)

                if key1 not in tournament_list:
                    tournament_list[key1] = Groups_of_Tournament(tournament_id=tournament_id,stagedlist=[])
                if key2 not in staged_list:
                    staged_list[key2] = GroupStandings_of_Stages(stage_number=stage_number,stage_name=stage_name,grouplist=[])
                    tournament_list[key1].stagedlist.append(staged_list[key2])
                if key3 not in grouped_list:
                    grouped_list[key3] = GroupStandings_of_Groups(group_name=group_name,group_standings=[])
                    staged_list[key2].grouplist.append(grouped_list[key3])

                grouped_list[key3].group_standings.append(GroupStanding(*result))

            return list(tournament_list.values())
        except mysql.connector.Error as err:
            conn.rollback()
        finally:
            cursor.close()
            conn.close()
    
    @staticmethod
    def update_group_standing(db: db, group_standing: GroupStanding) -> None:
        try:
            conn = db.get_connection()
            query="""
                UPDATE group_standings SET
                    played=%s,
                    wins=%s,
                    draws=%s,
                    losses=%s,
                    goals_for=%s,
                    goals_against=%s,
                    goal_difference=%s,
                    points=%s,
                    advanced=%s
                    WHERE tournament_id=%s AND stage_number=%s AND group_name=%s AND position=%s
                    """
            cursor = conn.cursor()
            cursor.execute(query, (
                group_standing.played,
                group_standing.wins,
                group_standing.draws,
                group_standing.losses,
                group_standing.goals_for,
                group_standing.goals_against,
                group_standing.goal_difference,
                group_standing.points,
                group_standing.advanced,
                group_standing.tournament_id,
                group_standing.stage_number,
                group_standing.group_name,
                group_standing.position
                ))
            conn.commit()
            print("Group_standing updated")
        except mysql.connector.Error as err:
            conn.rollback()
        finally:
            cursor.close()
            conn.close()
    
    @staticmethod
    def delete_group_standing(db: db, tournament_id: str, stage_number: int, group_name: str, position: str) -> None:
        try:
            conn = db.get_connection()
            query="""
                DELETE FROM group_standings
                WHERE tournament_id=%s AND stage_number=%s AND group_name=%s AND position=%s
                """
            cursor = conn.cursor()
            cursor.execute(query, (
                tournament_id,
                stage_number,
                group_name,
                position
                ))
            conn.commit()
            print("Group_standing deleted")
        except mysql.connector.Error as err:
            conn.rollback()
        finally:
            cursor.close()
            conn.close()
    
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


@dataclass
class joined_GroupStanding:
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
    team_name: str


@dataclass
class joined_GroupStandings_of_Groups:
    group_name: str
    group_standings: list[joined_GroupStanding]

@dataclass
class joined_GroupStandings_of_Stages:
    stage_number: int
    stage_name: str
    grouplist: list[joined_GroupStandings_of_Groups]

@dataclass
class joined_Groups_of_Tournament:
    tournament_id: str
    stagedlist: list[joined_GroupStandings_of_Stages]


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
                ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,1)"""
            
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
                group_standing.points
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
    def get_all_standings(db:db) -> list[GroupStanding]:
        try:
            conn = db.get_connection()
            query="""
                SELECT * FROM group_standings ORDER BY tournament_id DESC, stage_number ASC, group_name ASC, position ASC
                """
            cursor = conn.cursor()
            cursor.execute(query)
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
                   SELECT * FROM group_standings ORDER BY tournament_id DESC, stage_number ASC, group_name ASC, position ASC
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
    def get_all_group_names(db: db, tournament_id: str, stage_name: str) -> list[str]:
        try:
            conn = db.get_connection()
            query="""
                SELECT DISTINCT group_name 
                FROM group_standings 
                WHERE tournament_id=%s AND stage_name=%s
                """
            cursor = conn.cursor()
            cursor.execute(query, (tournament_id, stage_name))
            results = cursor.fetchall()
            groupnames = []
            for result in results:
                groupnames.append(result[0])
            cursor.close()
            conn.close()
            return groupnames
        except mysql.connector.Error as err:
            print(f"Error: {err}")
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
                    team_id=%s,
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
                group_standing.team_id,
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
                group_standing.position,
                
                ))
            conn.commit()
        except mysql.connector.Error as err:
            print(f"Error: {err}")
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
        except mysql.connector.Error as err:
            conn.rollback()
        finally:
            cursor.close()
            conn.close()
                
    @staticmethod
    def get_all_group_standings_joined(db: db) -> list:
        try:
            conn = db.get_connection()
            query = """
                SELECT gs.*, t.team_name
                FROM group_standings gs
                JOIN teams t ON gs.team_id = t.team_id
                ORDER BY gs.tournament_id DESC, gs.stage_number ASC, gs.group_name ASC, gs.position ASC
            """
            cursor = conn.cursor()
            cursor.execute(query)
            results = cursor.fetchall()

            tournament_list = {}
            staged_list = {}
            grouped_list = {}

            for result in results:
                (
                    tournament_id, stage_number, stage_name, group_name, position, team_id,
                    played, wins, draws, losses, goals_for, goals_against, goal_difference,
                    points, advanced, team_name
                ) = result

                key1 = (tournament_id)
                key2 = (tournament_id, stage_number)
                key3 = (tournament_id, stage_number, group_name)

                if key1 not in tournament_list:
                    tournament_list[key1] = joined_Groups_of_Tournament(tournament_id=tournament_id, stagedlist=[])

                if key2 not in staged_list:
                    staged_list[key2] = joined_GroupStandings_of_Stages(stage_number=stage_number, stage_name=stage_name, grouplist=[])
                    tournament_list[key1].stagedlist.append(staged_list[key2])

                if key3 not in grouped_list:
                    grouped_list[key3] = joined_GroupStandings_of_Groups(group_name=group_name, group_standings=[])
                    staged_list[key2].grouplist.append(grouped_list[key3])

                grouped_list[key3].group_standings.append(
                    joined_GroupStanding(
                        tournament_id=tournament_id, stage_number=stage_number, stage_name=stage_name,
                        group_name=group_name, position=position, team_id=team_id, played=played,
                        wins=wins, draws=draws, losses=losses, goals_for=goals_for, goals_against=goals_against,
                        goal_difference=goal_difference, points=points, advanced=advanced, team_name=team_name
                    )
                )

            return list(tournament_list.values())
        except mysql.connector.Error as err:
            conn.rollback()
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def get_all_group_standings_on_tournament_joined(db: db, tournament_id):
        try:
            conn = db.get_connection()
            query = """
                SELECT gs.*, t.team_name
                FROM group_standings gs
                JOIN teams t ON gs.team_id = t.team_id
                WHERE tournament_id=%s
                ORDER BY gs.stage_number ASC, gs.group_name ASC, gs.position ASC
            """
            cursor = conn.cursor()
            cursor.execute(query, (tournament_id,))
            results = cursor.fetchall()


            tournament_list = {}
            staged_list = {}
            grouped_list = {}

            for result in results:
                (
                    tournament_id, stage_number, stage_name, group_name, position, team_id,
                    played, wins, draws, losses, goals_for, goals_against, goal_difference,
                    points, advanced, team_name
                ) = result

                key1 = (tournament_id)
                key2 = (tournament_id, stage_number)
                key3 = (tournament_id, stage_number, group_name)

                if key1 not in tournament_list:
                    tournament_list[key1] = joined_Groups_of_Tournament(tournament_id=tournament_id, stagedlist=[])

                if key2 not in staged_list:
                    staged_list[key2] = joined_GroupStandings_of_Stages(stage_number=stage_number, stage_name=stage_name, grouplist=[])
                    tournament_list[key1].stagedlist.append(staged_list[key2])

                if key3 not in grouped_list:
                    grouped_list[key3] = joined_GroupStandings_of_Groups(group_name=group_name, group_standings=[])
                    staged_list[key2].grouplist.append(grouped_list[key3])

                grouped_list[key3].group_standings.append(
                    joined_GroupStanding(
                        tournament_id=tournament_id, stage_number=stage_number, stage_name=stage_name,
                        group_name=group_name, position=position, team_id=team_id, played=played,
                        wins=wins, draws=draws, losses=losses, goals_for=goals_for, goals_against=goals_against,
                        goal_difference=goal_difference, points=points, advanced=advanced, team_name=team_name
                    )
                )

            return list(tournament_list.values())
        except mysql.connector.Error as err:
            conn.rollback()
        finally:
            cursor.close()
            conn.close()


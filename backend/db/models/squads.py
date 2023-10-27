class Squads:
    def __init__(self,tournament_id, team_id, player_id, shirt_number, position_name, position_code):
        self.tournament_id = tournament_id
        self.team_id = team_id
        self.player_id = player_id
        self.shirt_number = shirt_number
        self.position_name = position_name
        self.position_code = position_code

    def print_squad(self):
        print(f"tournament_id: {self.tournament_id}")
        print(f"team_id: {self.team_id}")
        print(f"player_id: {self.player_id}")
        print(f"shirt_number: {self.shirt_number}")
        print(f"position_name: {self.position_name}")
        print(f"position_code: {self.position_code}")
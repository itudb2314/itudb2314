-- Create view for number of awards
create view team_award_count as
select count(aw.team_id) as award_count, teams.team_id, teams.team_name, tournament_id
from teams
         left join fifa.award_winners aw on teams.team_id = aw.team_id
group by teams.team_id, tournament_id;

-- Create view for number of goals
create view number_of_goals as
select count(g.team_id) as number_of_goals, teams.team_id, teams.team_name, tournament_id
from teams
         left join fifa.goals g on teams.team_id = g.team_id
group by teams.team_id, tournament_id;

-- Create view for number of wins
create view number_of_wins as
select count(m.away_team_win) as number_of_wins, teams.team_id, teams.team_name, tournament_id
from teams
         left join fifa.matches m on case when m.away_team_win = 1 then m.away_team_id = teams.team_id
                                          when m.home_team_win = 1 then m.home_team_id = teams.team_id
    end
group by teams.team_id, tournament_id;

-- Create view for number of draws
create view number_of_draws as
select count(m.draw) as number_of_draws, teams.team_id, teams.team_name, tournament_id
from teams
         left join fifa.matches m on case when m.draw = 1 then m.home_team_id = teams.team_id
    end
group by teams.team_id, tournament_id;

-- Create view for number of losses
create view number_of_losses as
select count(m.home_team_win) as number_of_losses, teams.team_id, teams.team_name, tournament_id
from teams
         left join fifa.matches m on case when m.home_team_win = 1 then m.away_team_id = teams.team_id
                                          when m.away_team_win = 1 then m.home_team_id = teams.team_id
    end
group by teams.team_id, tournament_id;
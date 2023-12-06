-- GetKnockoutMatches procedure for getting matches of knockout stage for a tournament
DELIMITER //

CREATE PROCEDURE GetKnockoutMatches(IN p_tournament_id VARCHAR(255))
BEGIN
SELECT
    match_id,
    TRIM(SUBSTRING_INDEX(match_name, 'vs', 1)) as team1,
    TRIM(SUBSTRING_INDEX(match_name, 'vs', -1)) as team2,
    home_team_win,
    home_team_score,
    away_team_score,
    stage_name
FROM matches
WHERE knockout_stage = '1' AND tournament_id = p_tournament_id;
END //

DELIMITER ;

-- GetKnockoutMatches procedure for getting matches of knockout stage for a tournament
DELIMITER //

CREATE PROCEDURE GetKnockoutMatches(IN p_tournament_id VARCHAR(255))
BEGIN
SELECT
    match_id,
    TRIM(SUBSTRING_INDEX(match_name, 'vs', 1)) as team1,
    TRIM(SUBSTRING_INDEX(match_name, 'vs', -1)) as team2,
    CASE(
        WHEN result = 'home team win' THEN 1
        WHEN result = 'away team win' THEN 2
        WHEN result = 'draw' THEN 3
    END) as winner,
    home_team_score,
    away_team_score,
    stage_name
FROM matches
WHERE knockout_stage = '1' AND tournament_id = p_tournament_id;
END //

DELIMITER ;

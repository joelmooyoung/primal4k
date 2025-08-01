-- Clear and reset station 2 schedule to show "Primal Replay"
DELETE FROM schedule WHERE station_id = 'primal-radio-2';

-- Insert "Primal Replay" schedule for station 2 (7 days a week, 24 hours)
INSERT INTO schedule (station_id, day_of_week, start_time, end_time, show_name, host_name) VALUES
-- Sunday (0)
('primal-radio-2', 0, '00:00:00', '23:59:59', 'Primal Replay', 'Primal 4k'),
-- Monday (1) 
('primal-radio-2', 1, '00:00:00', '23:59:59', 'Primal Replay', 'Primal 4k'),
-- Tuesday (2)
('primal-radio-2', 2, '00:00:00', '23:59:59', 'Primal Replay', 'Primal 4k'),
-- Wednesday (3)
('primal-radio-2', 3, '00:00:00', '23:59:59', 'Primal Replay', 'Primal 4k'),
-- Thursday (4)
('primal-radio-2', 4, '00:00:00', '23:59:59', 'Primal Replay', 'Primal 4k'),
-- Friday (5)
('primal-radio-2', 5, '00:00:00', '23:59:59', 'Primal Replay', 'Primal 4k'),
-- Saturday (6)
('primal-radio-2', 6, '00:00:00', '23:59:59', 'Primal Replay', 'Primal 4k');
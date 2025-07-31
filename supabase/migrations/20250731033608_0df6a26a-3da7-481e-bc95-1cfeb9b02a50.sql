-- Add station_id column to schedule table
ALTER TABLE public.schedule 
ADD COLUMN station_id text NOT NULL DEFAULT 'primal-radio';

-- Update existing records to be associated with primal-radio (Radio 1)
UPDATE public.schedule 
SET station_id = 'primal-radio';

-- Add some sample schedule data for primal-radio-2 (Radio 2)
INSERT INTO public.schedule (day_of_week, start_time, end_time, show_name, host_name, station_id) VALUES
(0, '06:00:00', '12:00:00', 'Sunday Morning Vibes', 'DJ Smooth Daddy', 'primal-radio-2'),
(0, '12:00:00', '18:00:00', 'Reggae Sunday', 'DJ Keu', 'primal-radio-2'),
(0, '18:00:00', '00:00:00', 'Sunday Night Sessions', 'DJ Craig', 'primal-radio-2'),

(1, '06:00:00', '10:00:00', 'Monday Morning Energy', 'DJ Jermaine', 'primal-radio-2'),
(1, '10:00:00', '14:00:00', 'Midday Mix', 'DJ DeDe', 'primal-radio-2'),
(1, '14:00:00', '18:00:00', 'Afternoon Vibes', 'DJ Tony G', 'primal-radio-2'),
(1, '18:00:00', '22:00:00', 'Evening Groove', 'DJ 77', 'primal-radio-2'),
(1, '22:00:00', '02:00:00', 'Late Night Sessions', 'DJ Gadaffi', 'primal-radio-2'),

(2, '06:00:00', '10:00:00', 'Tuesday Morning Mix', 'DJ Craig', 'primal-radio-2'),
(2, '10:00:00', '14:00:00', 'Midday Madness', 'DJ Smooth Daddy', 'primal-radio-2'),
(2, '14:00:00', '18:00:00', 'Afternoon Sessions', 'DJ Keu', 'primal-radio-2'),
(2, '18:00:00', '22:00:00', 'Evening Energy', 'DJ DeDe', 'primal-radio-2'),
(2, '22:00:00', '02:00:00', 'Night Vibes', 'DJ Tony G', 'primal-radio-2'),

(3, '06:00:00', '10:00:00', 'Wednesday Wake Up', 'DJ Jermaine', 'primal-radio-2'),
(3, '10:00:00', '14:00:00', 'Midweek Mix', 'DJ 77', 'primal-radio-2'),
(3, '14:00:00', '18:00:00', 'Afternoon Beats', 'DJ Gadaffi', 'primal-radio-2'),
(3, '18:00:00', '22:00:00', 'Evening Sessions', 'DJ Craig', 'primal-radio-2'),
(3, '22:00:00', '02:00:00', 'Late Night Groove', 'DJ Smooth Daddy', 'primal-radio-2'),

(4, '06:00:00', '10:00:00', 'Thursday Morning', 'DJ Keu', 'primal-radio-2'),
(4, '10:00:00', '14:00:00', 'Midday Sessions', 'DJ DeDe', 'primal-radio-2'),
(4, '14:00:00', '18:00:00', 'Afternoon Mix', 'DJ Tony G', 'primal-radio-2'),
(4, '18:00:00', '22:00:00', 'Evening Vibes', 'DJ Jermaine', 'primal-radio-2'),
(4, '22:00:00', '02:00:00', 'Night Sessions', 'DJ 77', 'primal-radio-2'),

(5, '06:00:00', '10:00:00', 'Friday Morning Energy', 'DJ Gadaffi', 'primal-radio-2'),
(5, '10:00:00', '14:00:00', 'Midday Madness', 'DJ Craig', 'primal-radio-2'),
(5, '14:00:00', '18:00:00', 'Friday Afternoon', 'DJ Smooth Daddy', 'primal-radio-2'),
(5, '18:00:00', '22:00:00', 'Friday Night Prep', 'DJ Keu', 'primal-radio-2'),
(5, '22:00:00', '04:00:00', 'Friday Night Party', 'DJ DeDe', 'primal-radio-2'),

(6, '06:00:00', '12:00:00', 'Saturday Morning', 'DJ Tony G', 'primal-radio-2'),
(6, '12:00:00', '18:00:00', 'Saturday Sessions', 'DJ Jermaine', 'primal-radio-2'),
(6, '18:00:00', '00:00:00', 'Saturday Night Live', 'DJ 77', 'primal-radio-2');
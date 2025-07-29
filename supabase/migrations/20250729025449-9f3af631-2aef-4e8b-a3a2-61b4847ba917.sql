-- Clear the placeholder schedule data
DELETE FROM public.schedule;

-- Insert the actual detailed schedule
INSERT INTO public.schedule (day_of_week, show_name, host_name, start_time, end_time) VALUES
-- Monday shows
(1, 'The Community Buzz', 'Imaara', '16:00:00', '18:00:00'),
(1, 'Primally Poetic', 'Neiima & Poets', '20:30:00', '21:30:00'),

-- Tuesday shows  
(2, 'Open', 'Open', '18:00:00', '19:00:00'),
(2, 'Level Up', 'Jean Marie', '19:00:00', '20:00:00'),
(2, 'Soul2Soul', 'DJ 77 & DJ Gadaffi', '20:00:00', '22:00:00'),
(2, 'MetaMorphosis', 'Doc Iman Blak', '22:00:00', '00:00:00'),

-- Wednesday shows
(3, 'Hold a Reasoning', 'Singing Melody', '13:00:00', '15:00:00'),
(3, 'Urban Honeys', 'DJ 77', '18:00:00', '19:00:00'),
(3, 'Linen & Lace - A Straight Jazz Odyssey', 'DJ 77', '19:00:00', '20:00:00'),
(3, 'The Wednesday Workout', 'DJ DeDe', '20:00:00', '22:00:00'),
(3, 'The Tony G Show', 'DJ Tony G', '22:00:00', '00:00:00'),

-- Thursday shows
(4, 'Lioncore', 'Daddy Lion Chandell', '15:00:00', '17:00:00'),
(4, 'The Matrix', 'Neiima & DeDe', '18:00:00', '19:00:00'),
(4, 'Hype Thursdays', 'DJ Jermaine Hard Drive', '19:00:00', '21:00:00'),
(4, 'The Heart of Soul', 'DLC', '21:00:00', '23:00:00'),

-- Friday shows
(5, 'Afternoon Delight', 'DLC', '11:00:00', '15:00:00'),
(5, 'The Heart of Soul', 'DLC', '15:00:00', '18:00:00'),
(5, 'The Traffic Jam Mix', 'DJ Teachdem', '18:00:00', '20:00:00'),
(5, 'Screech At Night', 'DJ Screech', '20:00:00', '22:00:00'),
(5, 'Deja Vu', 'DJ Migrane', '22:00:00', '00:00:00'),

-- Saturday shows
(6, 'The Roots Dynamic Experience', 'DLC', '10:00:00', '13:00:00'),
(6, 'The Skaturday Bang', 'DLC', '13:00:00', '16:00:00'),
(6, 'Primal Sports', 'Dale, Kane, Froggy & The Controversial Boss', '16:00:00', '17:30:00'),
(6, 'Amapiano & more', 'DJ Teachdem', '17:30:00', '19:30:00'),
(6, 'Di Drive', 'DJ Keu', '19:30:00', '21:30:00'),
(6, 'Outside We Deh', 'DJ Badbin', '21:30:00', '00:00:00'),

-- Sunday shows
(0, 'Answers from The Word', 'Alopex/Dr Dawkins', '09:00:00', '10:00:00'),
(0, 'Sunday Serenade', 'DJ DeDe', '10:00:00', '12:00:00'),
(0, 'Level Up', 'Jean Marie', '12:00:00', '13:00:00'),
(0, 'Grown Folks Music', 'DJ Keu', '13:00:00', '15:00:00'),
(0, 'The Kool Runnings Show', 'Professor X', '15:00:00', '18:00:00'),
(0, 'The Cookie Jar', 'DJ Migrane', '18:00:00', '21:00:00'),
(0, 'The Quiet Storm Show', 'DJ Smooth Daddy', '21:00:00', '23:00:00');
-- Create schedule table to replace hardcoded PROGRAM_SCHEDULE
CREATE TABLE public.schedule (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
  show_name TEXT NOT NULL,
  host_name TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (making it public since it's schedule info)
ALTER TABLE public.schedule ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to schedule
CREATE POLICY "Schedule is publicly readable" 
ON public.schedule 
FOR SELECT 
USING (true);

-- Create policy to allow authenticated users to manage schedule (for admin purposes)
CREATE POLICY "Authenticated users can manage schedule" 
ON public.schedule 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create index for efficient day lookups
CREATE INDEX idx_schedule_day_time ON public.schedule (day_of_week, start_time);

-- Insert the current schedule data
INSERT INTO public.schedule (day_of_week, show_name, host_name, start_time, end_time) VALUES
(0, 'Sunday Smooth', 'DJ Smooth Daddy', '00:00', '23:59'),
(1, 'Monday Mix', 'DJ Craig', '00:00', '23:59'),
(2, 'Tuesday Takeover', 'DJ Dede', '00:00', '23:59'),
(3, 'Wednesday Wonders', 'DJ Gadaffi', '00:00', '23:59'),
(4, 'Thursday Throwback', 'DJ Jermaine', '00:00', '23:59'),
(5, 'Friday Frenzy', 'DJ Keu', '00:00', '23:59'),
(6, 'Saturday Sessions', 'DJ TeachDem', '00:00', '23:59');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_schedule_updated_at
BEFORE UPDATE ON public.schedule
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
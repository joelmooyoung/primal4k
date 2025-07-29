-- Recreate the trigger for the schedule table since it was dropped with CASCADE
CREATE TRIGGER update_schedule_updated_at
BEFORE UPDATE ON public.schedule
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
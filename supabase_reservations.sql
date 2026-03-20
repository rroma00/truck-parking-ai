-- ==============================================================================
-- ParkAI - Reservations Table Definition
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public."Reservations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz DEFAULT now(),
  "lot_id" uuid NOT NULL REFERENCES public."Lots"("id") ON DELETE CASCADE,
  "spot_id" bigint NOT NULL REFERENCES public."Spots"("id") ON DELETE CASCADE,
  "phone_number" text,
  "customer_name" text,
  "vehicle_type" text,
  "status" text NOT NULL CHECK (status IN ('pending', 'confirmed', 'checked_in', 'completed', 'cancelled')),
  "source" text NOT NULL CHECK (source IN ('ai_voice', 'sms', 'manual_dashboard', 'admin', 'system')),
  "start_time" timestamptz,
  "end_time" timestamptz,
  "price" numeric(10,2),
  "notes" text
);

-- ==============================================================================
-- Indexes for performance
-- ==============================================================================
CREATE INDEX IF NOT EXISTS "ix_reservations_lot_id" ON public."Reservations"("lot_id");
CREATE INDEX IF NOT EXISTS "ix_reservations_spot_id" ON public."Reservations"("spot_id");
CREATE INDEX IF NOT EXISTS "ix_reservations_status" ON public."Reservations"("status");

-- ==============================================================================
-- Updated At Trigger (Optional but standard for updated_at)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS "set_reservations_updated_at" ON public."Reservations";
CREATE TRIGGER "set_reservations_updated_at"
BEFORE UPDATE ON public."Reservations"
FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- ==============================================================================
-- RLS (Row Level Security) Configuration
-- State: OFF (as requested)
-- ==============================================================================
ALTER TABLE public."Reservations" DISABLE ROW LEVEL SECURITY;

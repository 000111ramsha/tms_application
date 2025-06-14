-- TMS Application Complete Database Setup
-- Run these commands in Supabase SQL Editor to create all tables from scratch

-- Drop existing tables if they exist (be careful with this in production!)
DROP TABLE IF EXISTS pre_cert_med_list_form CASCADE;
DROP TABLE IF EXISTS med_history_form CASCADE;
DROP TABLE IF EXISTS phq9_form CASCADE;
DROP TABLE IF EXISTS bdi_form CASCADE;
DROP TABLE IF EXISTS patient_sessions CASCADE;
DROP TABLE IF EXISTS patients CASCADE;

-- Create patients table with all required fields
CREATE TABLE patients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    -- Basic Information
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    age INTEGER NOT NULL,
    ssn TEXT,
    date DATE NOT NULL,
    city_state_zip TEXT NOT NULL,
    -- Emergency Contact
    emergency_contact_name TEXT NOT NULL,
    emergency_contact_phone TEXT NOT NULL,
    emergency_contact_relationship TEXT NOT NULL,
    -- Spouse Information
    spouse_name TEXT,
    spouse_age INTEGER,
    spouse_date_of_birth DATE,
    spouse_ssn TEXT,
    spouse_employer TEXT,
    -- Military Information
    active_duty_service_member TEXT NOT NULL,
    dod_benefit TEXT,
    -- Employment Information
    current_employer TEXT,
    -- Healthcare Information
    referring_provider TEXT,
    primary_health_insurance TEXT,
    policy_number TEXT,
    group_number TEXT,
    -- Medical Information
    known_medical_conditions TEXT,
    drug_allergies TEXT,
    current_medications TEXT
);

-- Create patient_sessions table
CREATE TABLE patient_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    temporary_id TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    patient_id UUID REFERENCES patients(id),
    is_converted BOOLEAN DEFAULT FALSE
);

-- Create bdi_form table
CREATE TABLE bdi_form (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id),
    patient_session_id UUID REFERENCES patient_sessions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    total_score INTEGER NOT NULL,
    responses JSONB NOT NULL,
    severity_level TEXT,
    assessment_date DATE NOT NULL
);

-- Create phq9_form table
CREATE TABLE phq9_form (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id),
    patient_session_id UUID REFERENCES patient_sessions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    total_score INTEGER NOT NULL,
    responses JSONB NOT NULL,
    severity_level TEXT,
    assessment_date DATE NOT NULL
);

-- Create med_history_form table
CREATE TABLE med_history_form (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id),
    patient_session_id UUID REFERENCES patient_sessions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    conditions JSONB NOT NULL,
    other_conditions TEXT,
    allergies TEXT[] NOT NULL,
    other_allergies TEXT,
    current_medications JSONB NOT NULL,
    other_medications TEXT,
    past_medications JSONB,
    family_history JSONB NOT NULL,
    other_family_history TEXT,
    assessment_date DATE NOT NULL
);

-- Remove medications columns from med_history_form table
ALTER TABLE med_history_form
    DROP COLUMN IF EXISTS current_medications,
    DROP COLUMN IF EXISTS past_medications;

-- Verify the changes
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'med_history_form';

-- Create pre_cert_med_list_form table
CREATE TABLE pre_cert_med_list_form (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id),
    patient_session_id UUID REFERENCES patient_sessions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    medications JSONB NOT NULL,
    other_medications TEXT,
    medication_details JSONB,
    assessment_date DATE NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_patient_sessions_temp_id ON patient_sessions(temporary_id);
CREATE INDEX idx_patient_sessions_patient_id ON patient_sessions(patient_id);
CREATE INDEX idx_bdi_form_patient_id ON bdi_form(patient_id);
CREATE INDEX idx_bdi_form_session_id ON bdi_form(patient_session_id);
CREATE INDEX idx_phq9_form_patient_id ON phq9_form(patient_id);
CREATE INDEX idx_phq9_form_session_id ON phq9_form(patient_session_id);
CREATE INDEX idx_med_history_form_patient_id ON med_history_form(patient_id);
CREATE INDEX idx_med_history_form_session_id ON med_history_form(patient_session_id);
CREATE INDEX idx_pre_cert_med_list_form_patient_id ON pre_cert_med_list_form(patient_id);
CREATE INDEX idx_pre_cert_med_list_form_session_id ON pre_cert_med_list_form(patient_session_id);

-- Create function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bdi_form_updated_at
    BEFORE UPDATE ON bdi_form
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_phq9_form_updated_at
    BEFORE UPDATE ON phq9_form
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_med_history_form_updated_at
    BEFORE UPDATE ON med_history_form
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pre_cert_med_list_form_updated_at
    BEFORE UPDATE ON pre_cert_med_list_form
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

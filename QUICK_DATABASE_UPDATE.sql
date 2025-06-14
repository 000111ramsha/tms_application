-- Quick Database Update Script
-- Run this in Supabase SQL Editor to update your database schema

-- STEP 1: Backup existing data (if any)
-- Note: This will create backup tables with current data
CREATE TABLE IF NOT EXISTS backup_med_history_form AS SELECT * FROM med_history_form;
CREATE TABLE IF NOT EXISTS backup_pre_cert_med_list_form AS SELECT * FROM pre_cert_med_list_form;

-- STEP 2: Drop and recreate the problematic tables
DROP TABLE IF EXISTS med_history_form;
DROP TABLE IF EXISTS pre_cert_med_list_form;

-- STEP 3: Create corrected med_history_form table
CREATE TABLE med_history_form (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES patient_intake_form(id),
    patient_session_id UUID REFERENCES patient_sessions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Medical Conditions Section (individual columns for each condition)
    asthma BOOLEAN DEFAULT FALSE,
    headache BOOLEAN DEFAULT FALSE,
    heart_disease BOOLEAN DEFAULT FALSE,
    appetite_problems BOOLEAN DEFAULT FALSE,
    weight_loss_gain BOOLEAN DEFAULT FALSE,
    sleep_difficulty BOOLEAN DEFAULT FALSE,
    anxiety BOOLEAN DEFAULT FALSE,
    stomach_trouble BOOLEAN DEFAULT FALSE,
    constipation BOOLEAN DEFAULT FALSE,
    glaucoma BOOLEAN DEFAULT FALSE,
    aids_hiv BOOLEAN DEFAULT FALSE,
    hepatitis BOOLEAN DEFAULT FALSE,
    thyroid_disease BOOLEAN DEFAULT FALSE,
    syphilis BOOLEAN DEFAULT FALSE,
    seizures BOOLEAN DEFAULT FALSE,
    gonorrhea BOOLEAN DEFAULT FALSE,
    tb BOOLEAN DEFAULT FALSE,
    high_blood_pressure BOOLEAN DEFAULT FALSE,
    diabetes BOOLEAN DEFAULT FALSE,
    drinking_problems BOOLEAN DEFAULT FALSE,
    substance_abuse BOOLEAN DEFAULT FALSE,
    fatigue BOOLEAN DEFAULT FALSE,
    loss_of_concentration BOOLEAN DEFAULT FALSE,
    recurrent_thoughts BOOLEAN DEFAULT FALSE,
    sexual_problems BOOLEAN DEFAULT FALSE,
    
    -- Suicidal History Section
    suicidal_thoughts TEXT,
    attempts TEXT,
    suicidal_explanation TEXT,
    
    -- Psychiatric History Section
    previous_psychiatrist TEXT,
    psychiatric_hospitalizations TEXT,
    
    -- Other Section
    legal_charges TEXT,
    legal_explanation TEXT,
    
    -- Allergies Section
    allergies TEXT,
    
    -- Authorization Section
    signature TEXT,
    
    assessment_date DATE DEFAULT CURRENT_DATE,
    
    -- Add family_history column
    family_history TEXT,

    -- Add medical_conditions column
    medical_conditions JSONB NOT NULL DEFAULT '{}'
);

-- STEP 4: Create corrected pre_cert_med_list_form table (first part - SSRI and SNRI)
CREATE TABLE pre_cert_med_list_form (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES patient_intake_form(id),
    patient_session_id UUID REFERENCES patient_sessions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Personal Information Section
    name TEXT,
    date_of_birth DATE,
    
    -- SSRI Medications
    sertraline_zoloft BOOLEAN DEFAULT FALSE,
    sertraline_dose TEXT,
    sertraline_start_date DATE,
    sertraline_end_date DATE,
    sertraline_reason_discontinuing TEXT,
    
    fluoxetine_prozac BOOLEAN DEFAULT FALSE,
    fluoxetine_dose TEXT,
    fluoxetine_start_date DATE,
    fluoxetine_end_date DATE,
    fluoxetine_reason_discontinuing TEXT,
    
    citalopram_celexa BOOLEAN DEFAULT FALSE,
    citalopram_dose TEXT,
    citalopram_start_date DATE,
    citalopram_end_date DATE,
    citalopram_reason_discontinuing TEXT,
    
    fluvoxamine_luvox BOOLEAN DEFAULT FALSE,
    fluvoxamine_dose TEXT,
    fluvoxamine_start_date DATE,
    fluvoxamine_end_date DATE,
    fluvoxamine_reason_discontinuing TEXT,
    
    paroxetine_paxil BOOLEAN DEFAULT FALSE,
    paroxetine_dose TEXT,
    paroxetine_start_date DATE,
    paroxetine_end_date DATE,
    paroxetine_reason_discontinuing TEXT,
    
    paroxetine_cr_paxil_cr BOOLEAN DEFAULT FALSE,
    paroxetine_cr_dose TEXT,
    paroxetine_cr_start_date DATE,
    paroxetine_cr_end_date DATE,
    paroxetine_cr_reason_discontinuing TEXT,
    
    escitalopram_lexapro BOOLEAN DEFAULT FALSE,
    escitalopram_dose TEXT,
    escitalopram_start_date DATE,
    escitalopram_end_date DATE,
    escitalopram_reason_discontinuing TEXT,
    
    vilazodone_viibryd BOOLEAN DEFAULT FALSE,
    vilazodone_dose TEXT,
    vilazodone_start_date DATE,
    vilazodone_end_date DATE,
    vilazodone_reason_discontinuing TEXT,
    
    vortioxetine_brintellix BOOLEAN DEFAULT FALSE,
    vortioxetine_dose TEXT,
    vortioxetine_start_date DATE,
    vortioxetine_end_date DATE,
    vortioxetine_reason_discontinuing TEXT,
    
    -- SNRI Medications
    venlafaxine_effexor BOOLEAN DEFAULT FALSE,
    venlafaxine_dose TEXT,
    venlafaxine_start_date DATE,
    venlafaxine_end_date DATE,
    venlafaxine_reason_discontinuing TEXT,
    
    duloxetine_cymbalta BOOLEAN DEFAULT FALSE,
    duloxetine_dose TEXT,
    duloxetine_start_date DATE,
    duloxetine_end_date DATE,
    duloxetine_reason_discontinuing TEXT,
    
    desvenlafaxine_pristiq BOOLEAN DEFAULT FALSE,
    desvenlafaxine_dose TEXT,
    desvenlafaxine_start_date DATE,
    desvenlafaxine_end_date DATE,
    desvenlafaxine_reason_discontinuing TEXT,
    
    levomilnacipran_fetzima BOOLEAN DEFAULT FALSE,
    levomilnacipran_dose TEXT,
    levomilnacipran_start_date DATE,
    levomilnacipran_end_date DATE,
    levomilnacipran_reason_discontinuing TEXT,
    
    milnacipran_savella BOOLEAN DEFAULT FALSE,
    milnacipran_dose TEXT,
    milnacipran_start_date DATE,
    milnacipran_end_date DATE,
    milnacipran_reason_discontinuing TEXT,
    
    assessment_date DATE DEFAULT CURRENT_DATE
);

-- STEP 5: Add remaining medication columns (TRICYCLIC, MAOI, ATYPICAL, AUGMENTING AGENT)
-- Note: Due to length limits, run the complete COMPLETE_DATABASE_SETUP.sql for all medications

-- STEP 6: Recreate indexes
CREATE INDEX idx_med_history_form_patient_id ON med_history_form(patient_id);
CREATE INDEX idx_med_history_form_session_id ON med_history_form(patient_session_id);
CREATE INDEX idx_med_history_form_assessment_date ON med_history_form(assessment_date);
CREATE INDEX idx_pre_cert_med_list_form_patient_id ON pre_cert_med_list_form(patient_id);
CREATE INDEX idx_pre_cert_med_list_form_session_id ON pre_cert_med_list_form(patient_session_id);
CREATE INDEX idx_pre_cert_med_list_form_assessment_date ON pre_cert_med_list_form(assessment_date);

-- STEP 7: Recreate triggers
CREATE TRIGGER update_med_history_form_updated_at 
    BEFORE UPDATE ON med_history_form 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pre_cert_med_list_form_updated_at 
    BEFORE UPDATE ON pre_cert_med_list_form 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- STEP 8: Verify the changes
SELECT 'med_history_form columns:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'med_history_form' 
ORDER BY ordinal_position;

SELECT 'pre_cert_med_list_form columns:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'pre_cert_med_list_form' 
ORDER BY ordinal_position;

-- IMPORTANT: For complete medication tracking, run the full COMPLETE_DATABASE_SETUP.sql script
-- This quick script only includes SSRI and SNRI medications due to length constraints

-- Make important fields required in med_history_form table
ALTER TABLE med_history_form
ALTER COLUMN signature SET NOT NULL,
ALTER COLUMN suicidal_thoughts SET NOT NULL,
ALTER COLUMN attempts SET NOT NULL,
ALTER COLUMN allergies SET NOT NULL,
ALTER COLUMN current_medications SET NOT NULL,
ALTER COLUMN family_history SET NOT NULL,
ALTER COLUMN past_medications SET NOT NULL;

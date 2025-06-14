-- TMS Application Complete Database Setup - Single Table Approach
-- This uses individual columns for each medication with dose, start date, end date, and reason

-- Drop existing tables if they exist
DROP TABLE IF EXISTS pre_cert_med_list_form;
DROP TABLE IF EXISTS med_history_form;
DROP TABLE IF EXISTS phq9_form;
DROP TABLE IF EXISTS bdi_form;
DROP TABLE IF EXISTS patient_sessions;
DROP TABLE IF EXISTS patient_intake_form;

-- Create patient_intake_form table (matching Patient Demographic Sheet form order)
CREATE TABLE patient_intake_form (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Personal Information Section
    full_legal_name TEXT NOT NULL,
    date DATE NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    address TEXT NOT NULL,
    city_state_zip TEXT NOT NULL,
    age INTEGER NOT NULL,
    date_of_birth DATE NOT NULL,
    ssn TEXT,
    gender TEXT NOT NULL,
    
    -- Military Information Section
    active_duty_service_member TEXT NOT NULL,
    dod_benefit TEXT,
    current_employer TEXT,
    
    -- Spouse Information Section
    spouse_name TEXT,
    spouse_age INTEGER,
    spouse_date_of_birth DATE,
    spouse_ssn TEXT,
    spouse_employer TEXT,
    
    -- Healthcare Information Section
    referring_provider TEXT,
    primary_health_insurance TEXT,
    policy TEXT,
    group_number TEXT,
    
    -- Medical Information Section
    known_medical_conditions TEXT,
    drug_allergies TEXT,
    current_medications TEXT,
    
    -- Emergency Contact Section
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    emergency_contact_relationship TEXT
);

-- Create patient_sessions table
CREATE TABLE patient_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    temporary_id TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    patient_id UUID REFERENCES patient_intake_form(id),
    is_converted BOOLEAN DEFAULT FALSE
);

-- Create bdi_form table (matching BDI form order)
CREATE TABLE bdi_form (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES patient_intake_form(id),
    patient_session_id UUID REFERENCES patient_sessions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    total_score INTEGER NOT NULL,
    -- Individual question responses in order
    sadness_response TEXT NOT NULL,
    pessimism_response TEXT NOT NULL,
    past_failure_response TEXT NOT NULL,
    loss_of_pleasure_response TEXT NOT NULL,
    guilty_feelings_response TEXT NOT NULL,
    punishment_feelings_response TEXT NOT NULL,
    self_dislike_response TEXT NOT NULL,
    self_criticalness_response TEXT NOT NULL,
    suicidal_thoughts_response TEXT NOT NULL,
    crying_response TEXT NOT NULL,
    agitation_response TEXT NOT NULL,
    loss_of_interest_response TEXT NOT NULL,
    indecisiveness_response TEXT NOT NULL,
    worthlessness_response TEXT NOT NULL,
    loss_of_energy_response TEXT NOT NULL,
    sleep_changes_response TEXT NOT NULL,
    irritability_response TEXT NOT NULL,
    appetite_changes_response TEXT NOT NULL,
    concentration_difficulty_response TEXT NOT NULL,
    tiredness_response TEXT NOT NULL,
    loss_of_interest_sex_response TEXT NOT NULL,
    assessment_date DATE NOT NULL
);

-- Create phq9_form table (matching PHQ-9 form order)
CREATE TABLE phq9_form (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES patient_intake_form(id),
    patient_session_id UUID REFERENCES patient_sessions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    total_score INTEGER NOT NULL,
    -- Individual question responses in order
    interest_pleasure_response TEXT NOT NULL,
    feeling_down_response TEXT NOT NULL,
    sleep_problems_response TEXT NOT NULL,
    tired_energy_response TEXT NOT NULL,
    appetite_problems_response TEXT NOT NULL,
    self_worth_response TEXT NOT NULL,
    concentration_problems_response TEXT NOT NULL,
    movement_problems_response TEXT NOT NULL,
    suicidal_thoughts_response TEXT NOT NULL,
    assessment_date DATE NOT NULL
);

-- Create med_history_form table (matching Medical History form order)
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

    -- Family History Section
    family_history TEXT,
    
    -- Authorization Section
    signature TEXT,
    
    assessment_date DATE DEFAULT CURRENT_DATE
);

-- Note: This file continues with pre_cert_med_list_form table
-- Run ORIGINAL_PRE_CERT_SCHEMA.sql for the complete pre-cert medication table

-- TMS Application Complete Database Setup
-- Copy and paste these commands into Supabase SQL Editor

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
    total_score INTEGER NOT NULL CHECK (total_score >= 0),
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
    assessment_date DATE NOT NULL DEFAULT CURRENT_DATE CHECK (assessment_date <= CURRENT_DATE)
);

-- Create phq9_form table (matching PHQ-9 form order)
CREATE TABLE phq9_form (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES patient_intake_form(id),
    patient_session_id UUID REFERENCES patient_sessions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    total_score INTEGER NOT NULL CHECK (total_score >= 0),
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
    assessment_date DATE NOT NULL DEFAULT CURRENT_DATE CHECK (assessment_date <= CURRENT_DATE)
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
    signature TEXT NOT NULL,

    assessment_date DATE NOT NULL DEFAULT CURRENT_DATE CHECK (assessment_date <= CURRENT_DATE)
);

-- Create pre_cert_med_list_form table (matching Pre-Cert Medication List form order)
CREATE TABLE pre_cert_med_list_form (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES patient_intake_form(id),
    patient_session_id UUID REFERENCES patient_sessions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Personal Information Section
    name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    assessment_date DATE NOT NULL DEFAULT CURRENT_DATE CHECK (assessment_date <= CURRENT_DATE),
    
    -- SSRI Medications
    sertraline_zoloft JSONB DEFAULT NULL,
    fluoxetine_prozac JSONB DEFAULT NULL,
    citalopram_celexa JSONB DEFAULT NULL,
    fluvoxamine_luvox JSONB DEFAULT NULL,
    paroxetine_paxil JSONB DEFAULT NULL,
    paroxetine_cr_paxil_cr JSONB DEFAULT NULL,
    escitalopram_lexapro JSONB DEFAULT NULL,
    vilazodone_viibryd JSONB DEFAULT NULL,
    vortioxetine_brintellix_trintellix JSONB DEFAULT NULL,
    
    -- SNRI Medications
    venlafaxine_effexor_ir_xr JSONB DEFAULT NULL,
    duloxetine_cymbalta JSONB DEFAULT NULL,
    desvenlafaxine_pristiq JSONB DEFAULT NULL,
    levomilnacipran_fetzima JSONB DEFAULT NULL,
    milnacipran_savella JSONB DEFAULT NULL,
    
    -- TRICYCLIC Medications
    amitriptyline_elavil JSONB DEFAULT NULL,
    imipramine_tofranil JSONB DEFAULT NULL,
    desipramine_norpramin_pertofrane JSONB DEFAULT NULL,
    trimipramine_surmontil JSONB DEFAULT NULL,
    clomipramine_anafranil JSONB DEFAULT NULL,
    maprotiline_ludiomil JSONB DEFAULT NULL,
    doxepin_sinequan JSONB DEFAULT NULL,
    nomifensine_merital JSONB DEFAULT NULL,
    nortriptyline_pamelor_aventyl JSONB DEFAULT NULL,
    protriptyline_vivactil JSONB DEFAULT NULL,
    amoxapine_asendin JSONB DEFAULT NULL,
    
    -- MAOI Medications
    phenelzine_nardil JSONB DEFAULT NULL,
    selegiline_emsam_eldepryl JSONB DEFAULT NULL,
    selegiline_patch_emsam JSONB DEFAULT NULL,
    isocarboxazid_marplan JSONB DEFAULT NULL,
    tranylcypromine_parnate JSONB DEFAULT NULL,
    
    -- Atypical Medications
    bupropion_wellbutrin_sr_xl JSONB DEFAULT NULL,
    mirtazapine_remeron JSONB DEFAULT NULL,
    trazodone_desyrel JSONB DEFAULT NULL,
    nefazodone_serzone JSONB DEFAULT NULL,
    agomelatine_valdoxan JSONB DEFAULT NULL,
    
    -- Mood Stabilizers
    lithium_eskalith_lithobid_lithonate JSONB DEFAULT NULL,
    gabapentin_neurontin JSONB DEFAULT NULL,
    lamotrigine_lamictal JSONB DEFAULT NULL,
    topiramate_topamax JSONB DEFAULT NULL,
    
    -- Antipsychotic Medications
    aripiprazole_abilify JSONB DEFAULT NULL,
    brexpiprazole_rexulti JSONB DEFAULT NULL,
    cariprazine_vraylar JSONB DEFAULT NULL,
    lurasidone_latuda JSONB DEFAULT NULL,
    quetiapine_seroquel JSONB DEFAULT NULL,
    olanzapine_zyprexa JSONB DEFAULT NULL,
    risperidone_risperdal JSONB DEFAULT NULL,
    ziprasidone_geodon JSONB DEFAULT NULL,
    asenapine_saphris JSONB DEFAULT NULL,
    iloperidone_fanapt JSONB DEFAULT NULL,
    clozapine_clozaril JSONB DEFAULT NULL,
    paliperidone_invega JSONB DEFAULT NULL,
    pimavanserin_nuplazid JSONB DEFAULT NULL,
    lumateperone_caplyta JSONB DEFAULT NULL,
    pimozide_orap JSONB DEFAULT NULL,
    molindone_moban JSONB DEFAULT NULL,
    thiothixene_navane JSONB DEFAULT NULL,
    trifluoperazine_stelazine JSONB DEFAULT NULL,
    fluphenazine_prolixin JSONB DEFAULT NULL,
    haloperidol_haldol JSONB DEFAULT NULL,
    chlorpromazine_thorazine JSONB DEFAULT NULL,
    perphenazine_trilafon JSONB DEFAULT NULL,
    thioridazine_mellaril JSONB DEFAULT NULL,
    mesoridazine_serentil JSONB DEFAULT NULL,
    promazine_sparine JSONB DEFAULT NULL,
    triflupromazine_vesprin JSONB DEFAULT NULL,
    levomepromazine_nozinan JSONB DEFAULT NULL,
    periciazine_neuleptil JSONB DEFAULT NULL,
    zuclopenthixol_clopixol JSONB DEFAULT NULL,
    flupentixol_fluanxol JSONB DEFAULT NULL,
    chlorprothixene_taractan JSONB DEFAULT NULL,
    penfluridol_semap JSONB DEFAULT NULL,
    fluspirilene_imap JSONB DEFAULT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_patient_sessions_temp_id ON patient_sessions(temporary_id);
CREATE INDEX idx_patient_sessions_patient_id ON patient_sessions(patient_id);
CREATE INDEX idx_patient_intake_form_email ON patient_intake_form(email);
CREATE INDEX idx_patient_intake_form_phone ON patient_intake_form(phone);
CREATE INDEX idx_bdi_form_patient_id ON bdi_form(patient_id);
CREATE INDEX idx_bdi_form_session_id ON bdi_form(patient_session_id);
CREATE INDEX idx_bdi_form_assessment_date ON bdi_form(assessment_date);
CREATE INDEX idx_phq9_form_patient_id ON phq9_form(patient_id);
CREATE INDEX idx_phq9_form_session_id ON phq9_form(patient_session_id);
CREATE INDEX idx_phq9_form_assessment_date ON phq9_form(assessment_date);
CREATE INDEX idx_med_history_form_patient_id ON med_history_form(patient_id);
CREATE INDEX idx_med_history_form_session_id ON med_history_form(patient_session_id);
CREATE INDEX idx_med_history_form_assessment_date ON med_history_form(assessment_date);
CREATE INDEX idx_pre_cert_med_list_form_patient_id ON pre_cert_med_list_form(patient_id);
CREATE INDEX idx_pre_cert_med_list_form_session_id ON pre_cert_med_list_form(patient_session_id);
CREATE INDEX idx_pre_cert_med_list_form_assessment_date ON pre_cert_med_list_form(assessment_date);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_patient_intake_form_updated_at
    BEFORE UPDATE ON patient_intake_form
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

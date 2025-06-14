-- Original Pre-Cert Med List Form Schema with Individual Columns
-- This approach has separate columns for each medication with their details

-- Create pre_cert_med_list_form table (matching Pre-Cert Medication List form order)
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
    
    -- TRICYCLIC Medications
    amitriptyline_elavil BOOLEAN DEFAULT FALSE,
    amitriptyline_dose TEXT,
    amitriptyline_start_date DATE,
    amitriptyline_end_date DATE,
    amitriptyline_reason_discontinuing TEXT,
    
    imipramine_tofranil BOOLEAN DEFAULT FALSE,
    imipramine_dose TEXT,
    imipramine_start_date DATE,
    imipramine_end_date DATE,
    imipramine_reason_discontinuing TEXT,
    
    desipramine_norpramin BOOLEAN DEFAULT FALSE,
    desipramine_dose TEXT,
    desipramine_start_date DATE,
    desipramine_end_date DATE,
    desipramine_reason_discontinuing TEXT,
    
    trimipramine_surmontil BOOLEAN DEFAULT FALSE,
    trimipramine_dose TEXT,
    trimipramine_start_date DATE,
    trimipramine_end_date DATE,
    trimipramine_reason_discontinuing TEXT,
    
    clomipramine_anafranil BOOLEAN DEFAULT FALSE,
    clomipramine_dose TEXT,
    clomipramine_start_date DATE,
    clomipramine_end_date DATE,
    clomipramine_reason_discontinuing TEXT,
    
    maprotiline_ludiomil BOOLEAN DEFAULT FALSE,
    maprotiline_dose TEXT,
    maprotiline_start_date DATE,
    maprotiline_end_date DATE,
    maprotiline_reason_discontinuing TEXT,
    
    doxepin_sinequan BOOLEAN DEFAULT FALSE,
    doxepin_dose TEXT,
    doxepin_start_date DATE,
    doxepin_end_date DATE,
    doxepin_reason_discontinuing TEXT,
    
    nomifensine_merital BOOLEAN DEFAULT FALSE,
    nomifensine_dose TEXT,
    nomifensine_start_date DATE,
    nomifensine_end_date DATE,
    nomifensine_reason_discontinuing TEXT,
    
    nortriptyline_pamelor BOOLEAN DEFAULT FALSE,
    nortriptyline_dose TEXT,
    nortriptyline_start_date DATE,
    nortriptyline_end_date DATE,
    nortriptyline_reason_discontinuing TEXT,
    
    protriptyline_vivactil BOOLEAN DEFAULT FALSE,
    protriptyline_dose TEXT,
    protriptyline_start_date DATE,
    protriptyline_end_date DATE,
    protriptyline_reason_discontinuing TEXT,
    
    amoxapine_asendin BOOLEAN DEFAULT FALSE,
    amoxapine_dose TEXT,
    amoxapine_start_date DATE,
    amoxapine_end_date DATE,
    amoxapine_reason_discontinuing TEXT,
    
    -- MAOI Medications
    phenelzine_nardil BOOLEAN DEFAULT FALSE,
    phenelzine_dose TEXT,
    phenelzine_start_date DATE,
    phenelzine_end_date DATE,
    phenelzine_reason_discontinuing TEXT,
    
    selegiline_emsam BOOLEAN DEFAULT FALSE,
    selegiline_dose TEXT,
    selegiline_start_date DATE,
    selegiline_end_date DATE,
    selegiline_reason_discontinuing TEXT,
    
    selegiline_patch_emsam BOOLEAN DEFAULT FALSE,
    selegiline_patch_dose TEXT,
    selegiline_patch_start_date DATE,
    selegiline_patch_end_date DATE,
    selegiline_patch_reason_discontinuing TEXT,
    
    isocarboxazid_marplan BOOLEAN DEFAULT FALSE,
    isocarboxazid_dose TEXT,
    isocarboxazid_start_date DATE,
    isocarboxazid_end_date DATE,
    isocarboxazid_reason_discontinuing TEXT,
    
    tranylcypromine_parnate BOOLEAN DEFAULT FALSE,
    tranylcypromine_dose TEXT,
    tranylcypromine_start_date DATE,
    tranylcypromine_end_date DATE,
    tranylcypromine_reason_discontinuing TEXT,
    
    -- ATYPICAL Medications
    bupropion_wellbutrin BOOLEAN DEFAULT FALSE,
    bupropion_dose TEXT,
    bupropion_start_date DATE,
    bupropion_end_date DATE,
    bupropion_reason_discontinuing TEXT,
    
    nefazodone_serzone BOOLEAN DEFAULT FALSE,
    nefazodone_dose TEXT,
    nefazodone_start_date DATE,
    nefazodone_end_date DATE,
    nefazodone_reason_discontinuing TEXT,
    
    trazodone_desyrel BOOLEAN DEFAULT FALSE,
    trazodone_dose TEXT,
    trazodone_start_date DATE,
    trazodone_end_date DATE,
    trazodone_reason_discontinuing TEXT,
    
    mirtazapine_remeron BOOLEAN DEFAULT FALSE,
    mirtazapine_dose TEXT,
    mirtazapine_start_date DATE,
    mirtazapine_end_date DATE,
    mirtazapine_reason_discontinuing TEXT,

    -- AUGMENTING AGENT Medications
    aripiprazole_abilify BOOLEAN DEFAULT FALSE,
    aripiprazole_dose TEXT,
    aripiprazole_start_date DATE,
    aripiprazole_end_date DATE,
    aripiprazole_reason_discontinuing TEXT,

    ziprasidone_geodon BOOLEAN DEFAULT FALSE,
    ziprasidone_dose TEXT,
    ziprasidone_start_date DATE,
    ziprasidone_end_date DATE,
    ziprasidone_reason_discontinuing TEXT,

    risperidone_risperdal BOOLEAN DEFAULT FALSE,
    risperidone_dose TEXT,
    risperidone_start_date DATE,
    risperidone_end_date DATE,
    risperidone_reason_discontinuing TEXT,

    quetiapine_seroquel BOOLEAN DEFAULT FALSE,
    quetiapine_dose TEXT,
    quetiapine_start_date DATE,
    quetiapine_end_date DATE,
    quetiapine_reason_discontinuing TEXT,

    olanzapine_zyprexa BOOLEAN DEFAULT FALSE,
    olanzapine_dose TEXT,
    olanzapine_start_date DATE,
    olanzapine_end_date DATE,
    olanzapine_reason_discontinuing TEXT,

    asenapine_saphris BOOLEAN DEFAULT FALSE,
    asenapine_dose TEXT,
    asenapine_start_date DATE,
    asenapine_end_date DATE,
    asenapine_reason_discontinuing TEXT,

    cariprazine_vraylar BOOLEAN DEFAULT FALSE,
    cariprazine_dose TEXT,
    cariprazine_start_date DATE,
    cariprazine_end_date DATE,
    cariprazine_reason_discontinuing TEXT,

    lurasidone_latuda BOOLEAN DEFAULT FALSE,
    lurasidone_dose TEXT,
    lurasidone_start_date DATE,
    lurasidone_end_date DATE,
    lurasidone_reason_discontinuing TEXT,

    clozapine_clozaril BOOLEAN DEFAULT FALSE,
    clozapine_dose TEXT,
    clozapine_start_date DATE,
    clozapine_end_date DATE,
    clozapine_reason_discontinuing TEXT,

    paliperidone_invega BOOLEAN DEFAULT FALSE,
    paliperidone_dose TEXT,
    paliperidone_start_date DATE,
    paliperidone_end_date DATE,
    paliperidone_reason_discontinuing TEXT,

    brexpiprazole_rexulti BOOLEAN DEFAULT FALSE,
    brexpiprazole_dose TEXT,
    brexpiprazole_start_date DATE,
    brexpiprazole_end_date DATE,
    brexpiprazole_reason_discontinuing TEXT,

    lithium_eskalith BOOLEAN DEFAULT FALSE,
    lithium_dose TEXT,
    lithium_start_date DATE,
    lithium_end_date DATE,
    lithium_reason_discontinuing TEXT,

    gabapentin_neurontin BOOLEAN DEFAULT FALSE,
    gabapentin_dose TEXT,
    gabapentin_start_date DATE,
    gabapentin_end_date DATE,
    gabapentin_reason_discontinuing TEXT,

    lamotrigine_lamictal BOOLEAN DEFAULT FALSE,
    lamotrigine_dose TEXT,
    lamotrigine_start_date DATE,
    lamotrigine_end_date DATE,
    lamotrigine_reason_discontinuing TEXT,

    topiramate_topamax BOOLEAN DEFAULT FALSE,
    topiramate_dose TEXT,
    topiramate_start_date DATE,
    topiramate_end_date DATE,
    topiramate_reason_discontinuing TEXT,

    assessment_date DATE DEFAULT CURRENT_DATE
);

-- Create indexes for better performance
CREATE INDEX idx_pre_cert_med_list_form_patient_id ON pre_cert_med_list_form(patient_id);
CREATE INDEX idx_pre_cert_med_list_form_session_id ON pre_cert_med_list_form(patient_session_id);
CREATE INDEX idx_pre_cert_med_list_form_assessment_date ON pre_cert_med_list_form(assessment_date);

-- Create trigger for updated_at
CREATE TRIGGER update_pre_cert_med_list_form_updated_at
    BEFORE UPDATE ON pre_cert_med_list_form
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

# TMS Application Database Schema Analysis & Corrections

## Overview

This document provides a detailed analysis of the TMS application forms and the corrected database schema to ensure each form field has its own dedicated database column with proper sequencing.

## Form Analysis Summary

### ✅ Patient Demographic Sheet (patient_intake_form table)

**Status**: Already correct - each field has its own column in proper sequence

**Fields in order**:

1. Full Legal Name → `full_legal_name`
2. Date → `date`
3. Phone → `phone`
4. Email → `email`
5. Address → `address`
6. City, State ZIP → `city_state_zip`
7. Age → `age`
8. Date of Birth → `date_of_birth`
9. Social Security Number → `ssn`
10. Gender → `gender`
11. Active Duty Service Member → `active_duty_service_member`
12. DOD Benefit → `dod_benefit`
13. Current Employer → `current_employer`
14. Spouse Name → `spouse_name`
15. Spouse Age → `spouse_age`
16. Spouse DOB → `spouse_date_of_birth`
17. Spouse SSN → `spouse_ssn`
18. Spouse Employer → `spouse_employer`
19. Referring Provider → `referring_provider`
20. Primary Health Insurance → `primary_health_insurance`
21. Policy → `policy`
22. Group → `group_number`
23. Known Medical Conditions → `known_medical_conditions`
24. Drug Allergies → `drug_allergies`
25. Current Medications → `current_medications`
26. Emergency Contact Name → `emergency_contact_name`
27. Emergency Contact Phone → `emergency_contact_phone`
28. Emergency Contact Relationship → `emergency_contact_relationship`

### ✅ BDI Form (bdi_form)

**Status**: Already correct - each question has its own column

**Fields in order**:

1. Total Score → `total_score`
2. Sadness → `sadness_response`
3. Pessimism → `pessimism_response`
4. Past Failure → `past_failure_response`
5. Loss of Pleasure → `loss_of_pleasure_response`
6. Guilty Feelings → `guilty_feelings_response`
7. Punishment Feelings → `punishment_feelings_response`
8. Self-Dislike → `self_dislike_response`
9. Self-Criticalness → `self_criticalness_response`
10. Suicidal Thoughts → `suicidal_thoughts_response`
11. Crying → `crying_response`
12. Agitation → `agitation_response`
13. Loss of Interest → `loss_of_interest_response`
14. Indecisiveness → `indecisiveness_response`
15. Worthlessness → `worthlessness_response`
16. Loss of Energy → `loss_of_energy_response`
17. Sleep Changes → `sleep_changes_response`
18. Irritability → `irritability_response`
19. Appetite Changes → `appetite_changes_response`
20. Concentration Difficulty → `concentration_difficulty_response`
21. Tiredness → `tiredness_response`
22. Loss of Interest in Sex → `loss_of_interest_sex_response`
23. Assessment Date → `assessment_date`

### ✅ PHQ-9 Form (phq9_form)

**Status**: Already correct - each question has its own column

**Fields in order**:

1. Total Score → `total_score`
2. Interest/Pleasure → `interest_pleasure_response`
3. Feeling Down → `feeling_down_response`
4. Sleep Problems → `sleep_problems_response`
5. Tired/Energy → `tired_energy_response`
6. Appetite Problems → `appetite_problems_response`
7. Self-Worth → `self_worth_response`
8. Concentration Problems → `concentration_problems_response`
9. Movement Problems → `movement_problems_response`
10. Suicidal Thoughts → `suicidal_thoughts_response`
11. Assessment Date → `assessment_date`

### ❌ Medical History Form (med_history_form)

**Status**: CORRECTED - Changed from JSONB to individual columns

**Previous Issues**:

- Used JSONB for medical conditions instead of individual boolean columns
- Missing individual fields for suicidal history, legal history, etc.

**Corrected Fields in order**:

1. Medical Conditions (25 individual boolean columns):

   - `asthma`, `headache`, `heart_disease`, `appetite_problems`, `weight_loss_gain`
   - `sleep_difficulty`, `anxiety`, `stomach_trouble`, `constipation`, `glaucoma`
   - `aids_hiv`, `hepatitis`, `thyroid_disease`, `syphilis`, `seizures`
   - `gonorrhea`, `tb`, `high_blood_pressure`, `diabetes`, `drinking_problems`
   - `substance_abuse`, `fatigue`, `loss_of_concentration`, `recurrent_thoughts`, `sexual_problems`

2. Suicidal History Section:

   - `suicidal_thoughts` (TEXT)
   - `attempts` (TEXT)
   - `suicidal_explanation` (TEXT)

3. Psychiatric History Section:

   - `previous_psychiatrist` (TEXT)
   - `psychiatric_hospitalizations` (TEXT)

4. Other Section:

   - `legal_charges` (TEXT)
   - `legal_explanation` (TEXT)

5. Allergies Section:

   - `allergies` (TEXT)

6. Authorization Section:

   - `signature` (TEXT)

7. Assessment Date:
   - `assessment_date` (DATE)

### ❌ Pre-Cert Med List Form (pre_cert_med_list_form)

**Status**: CORRECTED - Changed from JSONB to individual columns for each medication

**Previous Issues**:

- Used JSONB for medications instead of individual columns
- Missing individual tracking for each medication's dose, dates, and discontinuation reason

**Corrected Fields in order**:

1. Personal Information:

   - `name` (TEXT)
   - `date_of_birth` (DATE)

2. SSRI Medications (9 medications × 5 fields each = 45 columns):

   - Each medication has: `[medication]_[brand]` (BOOLEAN), `[medication]_dose` (TEXT), `[medication]_start_date` (DATE), `[medication]_end_date` (DATE), `[medication]_reason_discontinuing` (TEXT)

3. SNRI Medications (5 medications × 5 fields each = 25 columns)

4. TRICYCLIC Medications (11 medications × 5 fields each = 55 columns)

5. MAOI Medications (5 medications × 5 fields each = 25 columns)

6. ATYPICAL Medications (4 medications × 5 fields each = 20 columns)

7. AUGMENTING AGENT Medications (16 medications × 5 fields each = 80 columns)

8. Assessment Date:
   - `assessment_date` (DATE)

**Total**: 252 individual columns for complete medication tracking

## Key Improvements Made

1. **Eliminated JSONB Storage**: Replaced all JSONB fields with individual columns for better data integrity and querying
2. **Proper Field Sequencing**: Ensured database column order matches form field display order
3. **Complete Field Coverage**: Every form field now has its own dedicated database column
4. **No Combined Field Storage**: Each piece of data is stored in its own column
5. **Enhanced Indexing**: Added proper indexes for better query performance
6. **Data Type Consistency**: Used appropriate data types for each field

## Database Commands to Run

Execute the complete SQL script in `COMPLETE_DATABASE_SETUP.sql` in your Supabase SQL Editor. This will:

1. Drop existing tables (if any)
2. Create new tables with corrected schema
3. Add proper indexes
4. Set up triggers for automatic timestamp updates

## Benefits of This Schema

1. **Better Data Integrity**: Individual columns prevent data corruption
2. **Easier Querying**: Can query specific fields without JSON parsing
3. **Better Performance**: Proper indexing and no JSON overhead
4. **Form Validation**: Each field can have its own validation rules
5. **Reporting**: Easier to generate reports on specific conditions or medications
6. **Data Analysis**: Better support for analytics and statistical analysis

## Table Name Changes

**Important**: The `patients` table has been renamed to `patient_intake_form` to clearly indicate that it contains data from the Patient Intake Form.

### Updated Table Names:

- `patient_intake_form` - Contains Patient Demographic Sheet data
- `bdi_form` - Contains BDI assessment data
- `phq9_form` - Contains PHQ-9 screening data
- `med_history_form` - Contains Medical History data
- `pre_cert_med_list_form` - Contains Pre-Certification Medication List data
- `patient_sessions` - Contains session tracking data

All foreign key references have been updated accordingly.

## Next Steps

1. Run the SQL commands in Supabase
2. Update application code to work with new schema and table names
3. Test form submissions with new database structure
4. Verify data integrity and performance

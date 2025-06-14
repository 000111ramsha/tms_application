# TMS Application Database Schema

## Updated Table Names (Matching Form Names)

### Form Tables
1. **`patients`** - Serves as "Patient Intake Form" data
2. **`bdi_form`** - BDI assessment responses (renamed from `bdi_responses`)
3. **`phq9_form`** - PHQ-9 screening responses (renamed from `phq9_responses`)
4. **`med_history_form`** - Medical history data (renamed from `medical_history`)
5. **`pre_cert_med_list_form`** - Pre-certification medication list (renamed from `pre_cert_medications`)

### Session Management Table
6. **`patient_sessions`** - Manages temporary patient IDs and session tracking

## Table Structure

### `patients` (Patient Intake Form)
```sql
- id (UUID, Primary Key)
- first_name (TEXT)
- last_name (TEXT)
- date_of_birth (DATE)
- gender (TEXT)
- email (TEXT)
- phone (TEXT)
- address (TEXT)
- city (TEXT)
- state (TEXT)
- zip_code (TEXT)
- emergency_contact_name (TEXT)
- emergency_contact_phone (TEXT)
- emergency_contact_relationship (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### `patient_sessions` (Session Management)
```sql
- id (UUID, Primary Key)
- temporary_id (TEXT, Unique) - e.g., "TMP_1703123456_ABC123"
- patient_id (UUID, Foreign Key to patients)
- is_converted (BOOLEAN) - Whether session was converted to patient
- created_at (TIMESTAMP)
```

### `bdi_form` (BDI Assessment)
```sql
- id (UUID, Primary Key)
- patient_id (UUID, Foreign Key to patients, Nullable)
- patient_session_id (UUID, Foreign Key to patient_sessions)
- total_score (INTEGER)
- responses (JSONB) - All BDI question responses
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### `phq9_form` (PHQ-9 Screening)
```sql
- id (UUID, Primary Key)
- patient_id (UUID, Foreign Key to patients, Nullable)
- patient_session_id (UUID, Foreign Key to patient_sessions)
- total_score (INTEGER)
- responses (JSONB) - All PHQ-9 question responses
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### `med_history_form` (Medical History)
```sql
- id (UUID, Primary Key)
- patient_id (UUID, Foreign Key to patients, Nullable)
- patient_session_id (UUID, Foreign Key to patient_sessions)
- conditions (JSONB) - Medical conditions checklist
- allergies (TEXT[]) - List of allergies
- current_medications (JSONB) - Current medications
- past_medications (JSONB) - Past medications
- family_history (JSONB) - Family medical history
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### `pre_cert_med_list_form` (Pre-Certification Medication List)
```sql
- id (UUID, Primary Key)
- patient_id (UUID, Foreign Key to patients, Nullable)
- patient_session_id (UUID, Foreign Key to patient_sessions)
- medications (JSONB) - Selected medications with details
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Patient Workflow

1. **User starts filling any form** → Gets assigned temporary ID (e.g., `TMP_1703123456_ABC123`)
2. **Forms are submitted** → Associated with temporary session in `patient_sessions`
3. **User fills Patient Intake Form** → Session converts to named patient in `patients` table
4. **All previous form data** → Automatically linked to the new patient record
5. **Subsequent form submissions** → Update existing data instead of creating duplicates

## Key Features

- **Temporary ID System**: Users get unique session IDs before providing personal info
- **Data Replacement**: Forms update existing data on resubmission (no duplicates)
- **Session Conversion**: Anonymous sessions become named patients when intake form is filled
- **Comprehensive Tracking**: Admin dashboard shows all patients and sessions with completion status
- **Form Name Matching**: Table names directly correspond to form names for clarity

## Admin Dashboard Access

- Navigate to `/admin-dashboard` in the app
- View all patients and their form completion status
- Track anonymous sessions waiting for conversion
- Real-time data with refresh capability

## Database Migration Commands

Run the commands in `database_migration.sql` to:
1. Create the `patient_sessions` table
2. Rename existing tables to match form names
3. Add session tracking columns
4. Set up proper indexes and triggers
5. Enable automatic timestamp updates

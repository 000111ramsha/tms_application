import { supabase } from '../lib/supabase';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

class PDFEmailService {
  static async generateAndSendPDF(formType, formData) {
    try {
      // Generate PDF content based on form type
      const pdfContent = await this.generatePDFContent(formType, formData);
      
      // Generate PDF file
      const { uri } = await Print.printToFileAsync({
        html: pdfContent,
        width: 612, // US Letter width in points
        height: 792, // US Letter height in points
      });

      // Prepare email content
      const adminEmail = "jasonmiller.dev87@gmail.com";
      const senderName = "TMS of Emerald Coast";
      const senderEmail = "onboarding@resend.dev";
      const resendApiKey = "re_a6sV9E4m_7z2rZVBbLQpkxbuqdLCam3DR";

      // Read the PDF file
      const pdfBase64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Send email with PDF attachment
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `"${senderName}" <${senderEmail}>`,
          to: [adminEmail],
          subject: `New ${formType} Submission`,
          html: `<p>A new ${formType} has been submitted. Please find the details in the attached PDF.</p>`,
          attachments: [
            {
              filename: `${formType.toLowerCase().replace(/\s+/g, '_')}.pdf`,
              content: pdfBase64
            }
          ]
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to send email");
      }

      // Clean up the temporary PDF file
      await FileSystem.deleteAsync(uri);

      return { success: true };
    } catch (error) {
      console.error('Error in generateAndSendPDF:', error);
      return { success: false, error: error.message };
    }
  }

  static async generatePDFContent(formType, formData) {
    // Generate HTML content based on form type
    let htmlContent = `
      <html>
        <head>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
              padding: 0;
              margin: 0;
            }

            .container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              box-shadow: 0 0 20px rgba(0,0,0,0.1);
              min-height: 100vh;
            }

            .header {
              background: linear-gradient(135deg, #2c5264 0%, #10a39b 100%);
              color: white;
              padding: 40px 30px;
              text-align: center;
              position: relative;
              overflow: hidden;
            }

            .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
              opacity: 0.3;
            }

            .header h1 {
              font-size: 32px;
              font-weight: bold;
              margin-bottom: 10px;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
              position: relative;
              z-index: 1;
            }

            .header .subtitle {
              font-size: 16px;
              opacity: 0.9;
              position: relative;
              z-index: 1;
            }

            .header .date {
              font-size: 14px;
              opacity: 0.8;
              margin-top: 15px;
              padding: 8px 16px;
              background: rgba(255,255,255,0.2);
              border-radius: 20px;
              display: inline-block;
              position: relative;
              z-index: 1;
            }

            .content {
              padding: 30px;
            }

            .section {
              margin-bottom: 35px;
              background: #f8f9fa;
              border-radius: 12px;
              padding: 25px;
              border-left: 5px solid #2c5264;
              box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            }

            .section h2 {
              color: #2c5264;
              font-size: 22px;
              font-weight: bold;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 2px solid #10a39b;
              display: flex;
              align-items: center;
            }

            .section h2::before {
              content: '●';
              color: #10a39b;
              margin-right: 10px;
              font-size: 16px;
            }

            .section h3 {
              color: #2c5264;
              font-size: 18px;
              font-weight: 600;
              margin: 20px 0 15px 0;
              padding-left: 15px;
              border-left: 3px solid #10a39b;
            }

            .section h4 {
              color: #2c5264;
              font-size: 16px;
              font-weight: 600;
              margin: 15px 0 10px 0;
              background: #e9ecef;
              padding: 10px 15px;
              border-radius: 6px;
              border-left: 3px solid #10a39b;
            }

            .field {
              margin-bottom: 15px;
              padding: 12px;
              background: white;
              border-radius: 8px;
              border: 1px solid #e9ecef;
              transition: all 0.3s ease;
            }

            .field:hover {
              border-color: #10a39b;
              box-shadow: 0 2px 8px rgba(16,163,155,0.1);
            }

            .label {
              font-weight: 600;
              color: #2c5264;
              font-size: 14px;
              display: block;
              margin-bottom: 5px;
            }

            .value {
              color: #333;
              font-size: 14px;
              line-height: 1.5;
              padding-left: 0;
            }

            .value strong {
              color: #2c5264;
              font-weight: 600;
            }

            .checkbox-list {
              margin: 10px 0;
              padding: 15px;
              background: white;
              border-radius: 8px;
              border: 1px solid #e9ecef;
            }

            .checkbox-item {
              margin-bottom: 8px;
              padding: 8px 12px;
              border-radius: 6px;
              display: flex;
              align-items: center;
            }

            .checkbox-selected {
              background: #e8f5e8;
              color: #2c5264;
              font-weight: 500;
              border-left: 3px solid #52c41a;
            }

            .checkbox-selected::before {
              content: '✓';
              color: #52c41a;
              font-weight: bold;
              margin-right: 8px;
            }

            .checkbox-unselected {
              color: #999;
              font-style: italic;
            }

            .footer {
              background: #2c5264;
              color: white;
              text-align: center;
              padding: 25px;
              font-size: 12px;
              margin-top: 40px;
            }

            .footer .company {
              font-size: 16px;
              font-weight: 600;
              margin-bottom: 5px;
            }

            .footer .tagline {
              opacity: 0.8;
              font-style: italic;
            }

            .score-highlight {
              background: linear-gradient(135deg, #2c5264 0%, #10a39b 100%);
              color: white;
              padding: 15px 20px;
              border-radius: 10px;
              text-align: center;
              font-size: 18px;
              font-weight: bold;
              margin: 20px 0;
              box-shadow: 0 4px 15px rgba(44,82,100,0.3);
            }

            .medication-details {
              background: #f8f9fa;
              padding: 15px;
              border-radius: 8px;
              border-left: 4px solid #10a39b;
              margin-top: 10px;
            }

            .medication-details div {
              margin-bottom: 8px;
              padding: 5px 0;
              border-bottom: 1px solid #e9ecef;
            }

            .medication-details div:last-child {
              border-bottom: none;
              margin-bottom: 0;
            }

            .response-item {
              background: white;
              padding: 15px;
              margin-bottom: 10px;
              border-radius: 8px;
              border-left: 4px solid #10a39b;
              box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            }

            .response-item .question {
              font-weight: 600;
              color: #2c5264;
              margin-bottom: 8px;
            }

            .response-item .answer {
              color: #333;
              font-size: 14px;
              padding: 8px 12px;
              background: #f8f9fa;
              border-radius: 6px;
              border-left: 3px solid #10a39b;
            }

            @media print {
              .container {
                box-shadow: none;
              }

              .section {
                break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${formType}</h1>
              <div class="subtitle">TMS of Emerald Coast</div>
              <div class="date">Submitted: ${new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</div>
            </div>
            <div class="content">
    `;

    // Add form-specific content
    switch (formType) {
      case 'Patient Demographics':
        htmlContent += this.generatePatientDemographicsContent(formData);
        break;
      case 'Medical History':
        htmlContent += this.generateMedicalHistoryContent(formData);
        break;
      case 'Pre-Certification Medication List':
        htmlContent += this.generatePreCertMedListContent(formData);
        break;
      case 'BDI':
        htmlContent += this.generateBDIContent(formData);
        break;
      case 'PHQ-9':
        htmlContent += this.generatePHQ9Content(formData);
        break;
    }

    htmlContent += `
            </div>
            <div class="footer">
              <div class="company">TMS of Emerald Coast</div>
              <div class="tagline">Transcranial Magnetic Stimulation Therapy</div>
              <div style="margin-top: 10px; font-size: 11px;">
                Generated on ${new Date().toLocaleString('en-US', {
                  timeZone: 'America/Chicago',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })} CST
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    return htmlContent;
  }

  static generatePatientDemographicsContent(formData) {
    return `
      <div class="section">
        <h2>Personal Information</h2>
        <div class="field">
          <span class="label">Full Legal Name</span>
          <span class="value">${formData.fullLegalName || 'Not provided'}</span>
        </div>
        <div class="field">
          <span class="label">Date</span>
          <span class="value">${formData.date ? new Date(formData.date).toLocaleDateString() : 'Not provided'}</span>
        </div>
        <div class="field">
          <span class="label">Date of Birth</span>
          <span class="value">${formData.dob ? new Date(formData.dob).toLocaleDateString() : 'Not provided'}</span>
        </div>
        <div class="field">
          <span class="label">Age</span>
          <span class="value">${formData.age || 'Not provided'}</span>
        </div>
        <div class="field">
          <span class="label">Phone Number</span>
          <span class="value">${formData.phone || 'Not provided'}</span>
        </div>
        <div class="field">
          <span class="label">Email Address</span>
          <span class="value">${formData.email || 'Not provided'}</span>
        </div>
        <div class="field">
          <span class="label">Address</span>
          <span class="value">${formData.address || 'Not provided'}</span>
        </div>
        <div class="field">
          <span class="label">City, State, ZIP</span>
          <span class="value">${formData.cityStateZip || 'Not provided'}</span>
        </div>
        <div class="field">
          <span class="label">Social Security Number</span>
          <span class="value">${formData.ssn || 'Not provided'}</span>
        </div>
        <div class="field">
          <span class="label">Gender</span>
          <span class="value">${formData.gender || 'Not provided'}</span>
        </div>
        <div class="field">
          <span class="label">Active Duty Service Member</span>
          <span class="value">${formData.activeDutyServiceMember || 'Not provided'}</span>
        </div>
        <div class="field">
          <span class="label">DOD Benefit</span>
          <span class="value">${formData.dodBenefit || 'Not provided'}</span>
        </div>
        <div class="field">
          <span class="label">Current Employer</span>
          <span class="value">${formData.currentEmployer || 'Not provided'}</span>
        </div>
      </div>

      <div class="section">
        <h2>Spouse Information</h2>
        <div class="field">
          <span class="label">Spouse Name</span>
          <span class="value">${formData.spouseName || 'Not provided'}</span>
        </div>
        <div class="field">
          <span class="label">Spouse Age</span>
          <span class="value">${formData.spouseAge || 'Not provided'}</span>
        </div>
        <div class="field">
          <span class="label">Spouse Date of Birth</span>
          <span class="value">${formData.spouseDob ? new Date(formData.spouseDob).toLocaleDateString() : 'Not provided'}</span>
        </div>
        <div class="field">
          <span class="label">Spouse SSN</span>
          <span class="value">${formData.spouseSsn || 'Not provided'}</span>
        </div>
        <div class="field">
          <span class="label">Spouse Employer</span>
          <span class="value">${formData.spouseEmployer || 'Not provided'}</span>
        </div>
      </div>

      <div class="section">
        <h2>Medical & Insurance Information</h2>
        <div class="field">
          <span class="label">Referring Provider</span>
          <span class="value">${formData.referringProvider || 'Not provided'}</span>
        </div>
        <div class="field">
          <span class="label">Primary Health Insurance</span>
          <span class="value">${formData.primaryHealthInsurance || 'Not provided'}</span>
        </div>
        <div class="field">
          <span class="label">Policy Number</span>
          <span class="value">${formData.policy || 'Not provided'}</span>
        </div>
        <div class="field">
          <span class="label">Group Number</span>
          <span class="value">${formData.group || 'Not provided'}</span>
        </div>
        <div class="field">
          <span class="label">Known Medical Conditions</span>
          <span class="value">${formData.knownMedicalConditions || 'Not provided'}</span>
        </div>
        <div class="field">
          <span class="label">Drug Allergies</span>
          <span class="value">${formData.drugAllergies || 'Not provided'}</span>
        </div>
        <div class="field">
          <span class="label">Current Medications</span>
          <span class="value">${formData.currentMedications || 'Not provided'}</span>
        </div>
      </div>

      <div class="section">
        <h2>Emergency Contact</h2>
        <div class="field">
          <span class="label">Emergency Contact Name</span>
          <span class="value">${formData.emergencyContactName || 'Not provided'}</span>
        </div>
        <div class="field">
          <span class="label">Emergency Contact Phone</span>
          <span class="value">${formData.emergencyContactPhone || 'Not provided'}</span>
        </div>
        <div class="field">
          <span class="label">Emergency Contact Relationship</span>
          <span class="value">${formData.emergencyContactRelationship || 'Not provided'}</span>
        </div>
      </div>
    `;
  }

  static generateMedicalHistoryContent(formData) {
    const selectedConditions = Object.entries(formData.medicalConditions || {})
      .filter(([_, value]) => value)
      .map(([key]) => key);

    return `
      <div class="section">
        <h2>Medical Conditions</h2>
        <div class="checkbox-list">
          ${selectedConditions.length > 0
            ? selectedConditions.map(condition => `
                <div class="checkbox-item checkbox-selected">${condition}</div>
              `).join('')
            : '<div class="checkbox-item checkbox-unselected">No medical conditions selected</div>'
          }
        </div>
      </div>

      <div class="section">
        <h2>Suicidal History</h2>
        <div class="field">
          <span class="label">Suicidal Thoughts</span>
          <span class="value">${formData.suicidalThoughts || 'Not provided'}</span>
        </div>
        <div class="field">
          <span class="label">Suicide Attempts</span>
          <span class="value">${formData.attempts || 'Not provided'}</span>
        </div>
        ${formData.suicidalExplanation ? `
        <div class="field">
          <span class="label">Explanation</span>
          <span class="value">${formData.suicidalExplanation}</span>
        </div>
        ` : ''}
      </div>

      <div class="section">
        <h2>Psychiatric History</h2>
        <div class="field">
          <span class="label">Previous Psychiatrist/Therapist</span>
          <span class="value">${formData.previousPsychiatrist || 'Not provided'}</span>
        </div>
        <div class="field">
          <span class="label">Psychiatric Hospitalizations</span>
          <span class="value">${formData.psychiatricHospitalizations || 'Not provided'}</span>
        </div>
      </div>

      <div class="section">
        <h2>Legal History</h2>
        <div class="field">
          <span class="label">Legal Charges</span>
          <span class="value">${formData.legalCharges || 'Not provided'}</span>
        </div>
        ${formData.legalExplanation ? `
        <div class="field">
          <span class="label">Legal Explanation</span>
          <span class="value">${formData.legalExplanation}</span>
        </div>
        ` : ''}
      </div>

      <div class="section">
        <h2>Additional Information</h2>
        <div class="field">
          <span class="label">Allergies</span>
          <span class="value">${formData.allergies || 'Not provided'}</span>
        </div>
        <div class="field">
          <span class="label">Family History</span>
          <span class="value">${formData.familyHistory || 'Not provided'}</span>
        </div>
        <div class="field">
          <span class="label">Patient Signature</span>
          <span class="value">${formData.signature || 'Not provided'}</span>
        </div>
      </div>
    `;
  }

  static generatePreCertMedListContent(formData) {
    return `
      <div class="section">
        <h2>Patient Information</h2>
        <div class="field">
          <span class="label">Patient Name</span>
          <span class="value">${formData.name || 'Not provided'}</span>
        </div>
        <div class="field">
          <span class="label">Date of Birth</span>
          <span class="value">${formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : 'Not provided'}</span>
        </div>
      </div>

      <div class="section">
        <h2>Medication History</h2>
        ${(() => {
          const medications = formData.medications || {};
          const hasAnyMedications = Object.keys(medications).length > 0;

          if (!hasAnyMedications) {
            return '<div class="field"><span class="value">No medications selected</span></div>';
          }

          const categoryContent = Object.entries(medications).map(([category, medications]) => {
            const selectedMeds = Object.entries(medications)
              .filter(([_, details]) => details && details.selected)
              .map(([medName, details]) => {
                return `
                  <div class="field">
                    <span class="label">${medName}</span>
                    <div class="medication-details">
                      <div><strong>Dosage:</strong> ${details.dosage || 'Not specified'}</div>
                      <div><strong>Start Date:</strong> ${details.startDate ? new Date(details.startDate).toLocaleDateString() : 'Not specified'}</div>
                      <div><strong>End Date:</strong> ${details.endDate ? new Date(details.endDate).toLocaleDateString() : 'Not specified'}</div>
                      <div><strong>Reason for Discontinuing:</strong> ${details.reasonForDiscontinuing || 'Not specified'}</div>
                    </div>
                  </div>
                `;
              }).join('');

            return selectedMeds ? `
              <h3>${category}</h3>
              ${selectedMeds}
            ` : '';
          }).join('');

          return categoryContent || '<div class="field"><span class="value">No medications selected</span></div>';
        })()}
      </div>
    `;
  }

  static generateBDIContent(formData) {
    const responses = formData.responses || {};
    const totalScore = formData.totalScore || Object.values(responses).reduce((sum, value) => {
      // Handle special cases for sleep and appetite questions
      if (typeof value === 'string' && value.includes('a')) {
        return sum + parseInt(value.replace(/[a-z]/g, ''));
      }
      return sum + parseInt(value || 0);
    }, 0);

    // BDI response options for displaying actual text
    const bdiOptions = {
      0: [ // Sadness
        { label: "0. I do not feel sad.", value: "0" },
        { label: "1. I feel sad much of the time.", value: "1" },
        { label: "2. I am sad all the time.", value: "2" },
        { label: "3. I am so sad or unhappy that I can't stand it.", value: "3" }
      ],
      1: [ // Pessimism
        { label: "0. I am not discouraged about my future.", value: "0" },
        { label: "1. I feel more discouraged about my future than I used to.", value: "1" },
        { label: "2. I do not expect things to work out for me.", value: "2" },
        { label: "3. I feel my future is hopeless and will only get worse.", value: "3" }
      ],
      2: [ // Past Failure
        { label: "0. I do not feel like a failure.", value: "0" },
        { label: "1. I have failed more than I should have.", value: "1" },
        { label: "2. As I look back, I see a lot of failures.", value: "2" },
        { label: "3. I feel I am a total failure as a person.", value: "3" }
      ],
      3: [ // Loss of Pleasure
        { label: "0. I get as much pleasure as I ever did from the things I enjoy.", value: "0" },
        { label: "1. I don't enjoy things as much as I used to.", value: "1" },
        { label: "2. I get very little pleasure from the things I used to enjoy.", value: "2" },
        { label: "3. I can't get any pleasure from the things I used to enjoy.", value: "3" }
      ],
      4: [ // Guilty Feelings
        { label: "0. I don't feel particularly guilty.", value: "0" },
        { label: "1. I feel guilty over many things I have done or should have done.", value: "1" },
        { label: "2. I feel quite guilty most of the time.", value: "2" },
        { label: "3. I feel guilty all of the time.", value: "3" }
      ],
      5: [ // Punishment Feelings
        { label: "0. I don't feel I am being punished.", value: "0" },
        { label: "1. I feel I may be punished.", value: "1" },
        { label: "2. I expect to be punished.", value: "2" },
        { label: "3. I feel I am being punished.", value: "3" }
      ],
      6: [ // Self-Dislike
        { label: "0. I feel the same about myself as ever.", value: "0" },
        { label: "1. I have lost confidence in myself.", value: "1" },
        { label: "2. I am disappointed in myself.", value: "2" },
        { label: "3. I dislike myself.", value: "3" }
      ],
      7: [ // Self-Criticalness
        { label: "0. I don't criticize or blame myself more than usual.", value: "0" },
        { label: "1. I am more critical of myself than I used to be.", value: "1" },
        { label: "2. I criticize myself for all of my faults.", value: "2" },
        { label: "3. I blame myself for everything bad that happens.", value: "3" }
      ],
      8: [ // Suicidal Thoughts or Wishes
        { label: "0. I don't have any thoughts of killing myself.", value: "0" },
        { label: "1. I have thoughts of killing myself, but I would not carry them out.", value: "1" },
        { label: "2. I would like to kill myself.", value: "2" },
        { label: "3. I would kill myself if I had the chance.", value: "3" }
      ],
      9: [ // Crying
        { label: "0. I don't cry anymore than I used to.", value: "0" },
        { label: "1. I cry more than I used to.", value: "1" },
        { label: "2. I cry over every little thing.", value: "2" },
        { label: "3. I feel like crying, but I can't.", value: "3" }
      ],
      10: [ // Agitation
        { label: "0. I am no more restless or wound up than usual.", value: "0" },
        { label: "1. I feel more restless or wound up than usual.", value: "1" },
        { label: "2. I am so restless or agitated, it's hard to stay still.", value: "2" },
        { label: "3. I am so restless or agitated that I have to keep moving or doing something.", value: "3" }
      ],
      11: [ // Loss of Interest
        { label: "0. I have not lost interest in other people or activities.", value: "0" },
        { label: "1. I am less interested in other people or things than before.", value: "1" },
        { label: "2. I have lost most of my interest in other people or things.", value: "2" },
        { label: "3. It's hard to get interested in anything.", value: "3" }
      ],
      12: [ // Indecisiveness
        { label: "0. I make decisions about as well as ever.", value: "0" },
        { label: "1. I find it more difficult to make decisions than usual.", value: "1" },
        { label: "2. I have much greater difficulty in making decisions than I used to.", value: "2" },
        { label: "3. I have trouble making any decisions.", value: "3" }
      ],
      13: [ // Worthlessness
        { label: "0. I do not feel I am worthless.", value: "0" },
        { label: "1. I don't consider myself as worthwhile and useful as I used to.", value: "1" },
        { label: "2. I feel more worthless as compared to others.", value: "2" },
        { label: "3. I feel utterly worthless.", value: "3" }
      ],
      14: [ // Loss of Energy
        { label: "0. I have as much energy as ever.", value: "0" },
        { label: "1. I have less energy than I used to have.", value: "1" },
        { label: "2. I don't have enough energy to do very much.", value: "2" },
        { label: "3. I don't have enough energy to do anything.", value: "3" }
      ],
      15: [ // Changes in Sleeping Pattern
        { label: "0. I have not experienced any change in my sleeping.", value: "0" },
        { label: "1a. I sleep somewhat more than usual.", value: "1a" },
        { label: "1b. I sleep somewhat less than usual.", value: "1b" },
        { label: "2a. I sleep a lot more than usual.", value: "2a" },
        { label: "2b. I sleep a lot less than usual.", value: "2b" },
        { label: "3a. I sleep most of the day.", value: "3a" },
        { label: "3b. I wake up 1-2 hours early and can't get back to sleep.", value: "3b" }
      ],
      16: [ // Irritability
        { label: "0. I am not more irritable than usual.", value: "0" },
        { label: "1. I am more irritable than usual.", value: "1" },
        { label: "2. I am much more irritable than usual.", value: "2" },
        { label: "3. I am irritable all the time.", value: "3" }
      ],
      17: [ // Changes in Appetite
        { label: "0. I have not experienced any change in my appetite.", value: "0" },
        { label: "1a. My appetite is somewhat less than usual.", value: "1a" },
        { label: "1b. My appetite is somewhat greater than usual.", value: "1b" },
        { label: "2a. My appetite is much less than before.", value: "2a" },
        { label: "2b. My appetite is much greater than usual.", value: "2b" },
        { label: "3a. I have no appetite at all.", value: "3a" },
        { label: "3b. I crave food all the time.", value: "3b" }
      ],
      18: [ // Concentration Difficulty
        { label: "0. I can concentrate as well as ever.", value: "0" },
        { label: "1. I can't concentrate as well as usual.", value: "1" },
        { label: "2. It's hard to keep my mind on anything for very long.", value: "2" },
        { label: "3. I find I can't concentrate on anything.", value: "3" }
      ],
      19: [ // Tiredness or Fatigue
        { label: "0. I am no more tired or fatigued than usual.", value: "0" },
        { label: "1. I get more tired or fatigued more easily than usual.", value: "1" },
        { label: "2. I am too tired or fatigued to do a lot of the things I used to do.", value: "2" },
        { label: "3. I am too tired or fatigued to do most of the things I used to do", value: "3" }
      ],
      20: [ // Loss of Interest in Sex
        { label: "0. I have not noticed any recent change in my interest in sex.", value: "0" },
        { label: "1. I am less interested in sex than I used to be.", value: "1" },
        { label: "2. I am much less interested in sex now.", value: "2" },
        { label: "3. I have lost interest in sex completely.", value: "3" }
      ]
    };

    return `
      <div class="section">
        <h2>Beck Depression Inventory (BDI-II)</h2>
        <div class="score-highlight">
          Total Score: ${totalScore} / 63
        </div>
        <h3>Assessment Responses</h3>
        ${Object.entries(responses).map(([questionIndex, response]) => {
          const questionNumber = parseInt(questionIndex) + 1;
          const questionText = bdiQuestions[questionIndex];
          const options = bdiOptions[questionIndex] || [];
          const selectedOption = options.find(opt => opt.value === response);
          const responseText = selectedOption ? selectedOption.label : `${response || 'N/A'}`;

          return `
            <div class="response-item">
              <div class="question">Question ${questionNumber}: ${questionText}</div>
              <div class="answer">${responseText}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  static generatePHQ9Content(formData) {
    const responses = formData.responses || {};
    const totalScore = formData.totalScore || Object.values(responses).reduce((sum, value) => sum + parseInt(value || 0), 0);

    // PHQ-9 response options for displaying actual text
    const phq9Options = [
      "0. Not at all",
      "1. Several days",
      "2. More than half the days",
      "3. Nearly every day"
    ];

    return `
      <div class="section">
        <h2>Patient Health Questionnaire (PHQ-9)</h2>
        <div class="score-highlight">
          Total Score: ${totalScore} / 27
        </div>
        <h3>Assessment Responses</h3>
        ${Object.entries(responses).map(([questionIndex, response]) => {
          const questionNumber = parseInt(questionIndex) + 1;
          const questionText = phq9Questions[questionIndex];
          const responseValue = parseInt(response || 0);
          const responseText = phq9Options[responseValue] || `${response || 'N/A'}`;

          return `
            <div class="response-item">
              <div class="question">Question ${questionNumber}: ${questionText}</div>
              <div class="answer">${responseText}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
}

// Add question arrays for BDI and PHQ-9
const bdiQuestions = [
  "Sadness", "Pessimism", "Past Failure", "Loss of Pleasure", "Guilty Feelings",
  "Punishment Feelings", "Self-Dislike", "Self-Criticalness", "Suicidal Thoughts or Wishes",
  "Crying", "Agitation", "Loss of Interest", "Indecisiveness", "Worthlessness",
  "Loss of Energy", "Changes in Sleeping Pattern", "Irritability", "Changes in Appetite",
  "Concentration Difficulty", "Tiredness or Fatigue", "Loss of Interest in Sex"
];

const phq9Questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself",
  "Trouble concentrating on things",
  "Moving or speaking so slowly that other people could have noticed",
  "Thoughts that you would be better off dead or of hurting yourself"
];

export default PDFEmailService; 
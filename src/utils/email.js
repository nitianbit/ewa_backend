import axios from "axios";

export const sendOtp=async(email,otp)=>{
  return await sendEmail({
    to:[email],
    textBody:`Your one time password is ${otp}`,
    subject:"EWA Healthcare"
  })
}

function formatTime(timeStr) {
  const hours = parseInt(timeStr.slice(0, 2), 10);
  const minutes = parseInt(timeStr.slice(2), 10);
  const date = new Date();
  date.setHours(hours, minutes);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate(dateNum) {
  const str = dateNum.toString(); // Convert number like 20250616 to "20250616"
  const year = str.slice(0, 4);
  const month = str.slice(4, 6);
  const day = str.slice(6, 8);
  const dateObj = new Date(`${year}-${month}-${day}`);
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}


export const sendNotification=async(email,data)=>{
  const TextBody = `📅 New Appointment Scheduled 📅

👤 Employee Name: ${data.patient_name}
📞 Contact Number: ${data.patient_phone}
🏢 Company Name: ${data.company_name}
🗓️ Date: ${formatDate(data.appointmentDate)}
⏰ Slot: ${formatTime(data.timeSlot.start)} - ${formatTime(data.timeSlot.end)}
`;
  return await sendEmail({
    to:email,
    textBody:TextBody,
    subject:"EWA Healthcare New Appointment "
  })
}

/**
 * Sends an email using SMTP2Go API.
 * @param {string[]} to - Array of recipient email addresses.
 * @param {string} subject - Email subject.
 * @param {string} textBody - Plain text body of the email.
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const sendEmail=async ({ to, subject, textBody })=> {
  try {
      const response = await axios({
          url: 'https://api.smtp2go.com/v3/email/send',
          method: 'POST',
          data: {
              sender: 'support@myewacare.com',
              to,
              subject,
              text_body: textBody
          },
          headers: {
              'Content-Type': 'application/json',
              'X-Smtp2go-Api-Key': 'api-9C79FEDB46044E7589CDE92367F53FDC',
              'accept': 'application/json'
          }
      })
      console.log(response?.data)

    if (response.data?.data?.succeeded) {
      return { success: true, message: 'Email sent successfully.' };
    } else {
      return {
        success: false,
        message: response.data?.data?.failures?.[0]?.error || 'Failed to send email.'
      };
    }
  } catch (error) {
    console.log( error.response?.data || error.message || 'Unknown error occurred.')
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Unknown error occurred.'
    };
  }
}

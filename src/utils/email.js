import axios from "axios";

export const sendOtp=async(email,otp)=>{
  return await sendEmail({
    to:[email],
    textBody:`Your one time password is ${otp}`,
    subject:"EWA Healthcare"
  })
}

export const sendNotification=async(email,data)=>{
  return await sendEmail({
    to:email,
    textBody:`New Appointment  \n Employee Name : ${data.patient_name} \n contact number :${data.patient_phone} \nCompany Name : ${data.company_name} \n Date : {data.appointmentDate} \n Slot : ${data.timeSlot.start} - $${data.timeSlot.start}`,
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

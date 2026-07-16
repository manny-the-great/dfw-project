require('dotenv').config();
const twilio = require('twilio');


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

async function sendOtp(countryCode, phoneNumber, otp) {
    try {
        const fullPhoneNumber = `${countryCode.startsWith('+') ? '' : '+'}${countryCode}${phoneNumber}`;
        const message = `Your DFWerrands account verification code is ${otp}. Please do not share it with anyone.`;


        const result = await client.messages.create({
            body: message,
            from: twilioNumber,
            to: fullPhoneNumber,
        });
        console.log("////////////////", result)
        return result.sid;
    } catch (error) {
        console.log('Twilio OTP Error:', error.message);
        throw error;
    }
}

module.exports = sendOtp;



import Redis from "ioredis";
import twilio from "twilio";
import redis from "./redisServices";

const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID ,
    process.env.TWILIO_AUTH_TOKEN
)

const OTP_EXPIRY_SECONDS = parseInt(process.env.OTP_EXPIRY_SECONDS || "300");

//genreate otp 

export const generateOTP = (length: number = 4): string => {
  const digits = '0123456789';
  return Array.from({ length }, () => digits[Math.floor(Math.random() * digits.length)]).join('');
};

//save otp to redis 

export const saveOTP = async (phoneNumber: string, otp: string): Promise<void> => {
    const key = `otp:${phoneNumber}`;
    await redis.set(key, otp, "EX", OTP_EXPIRY_SECONDS);
    //
    console.log(`OTP ${otp} saved for ${phoneNumber} with expiry of ${OTP_EXPIRY_SECONDS} seconds`);
}

//send otp to user via sms
export const sendOTP = async (phoneNumber: string, otp: string): Promise<void> => {
    try {
        await twilioClient.messages.create({
            body: `Your OTP is ${otp}. It is valid for ${OTP_EXPIRY_SECONDS / 60} minutes.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });
        console.log(`OTP sent to ${phoneNumber}`);
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw new Error('Failed to send OTP');
    }
};

//verify otp
export const verifyOTP = async (phoneNumber: string, otp: string): Promise<boolean> => {
    const key = `otp:${phoneNumber}`;
    const storedOTP = await redis.get(key);
    
    if(!storedOTP || storedOTP !== otp) {
        console.log(`OTP verification failed for ${phoneNumber}. Expected: ${storedOTP}, Received: ${otp}`);
        return false;
    }
    await redis.del(key);
    return true;
}
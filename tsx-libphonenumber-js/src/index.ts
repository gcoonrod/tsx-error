import { parsePhoneNumberWithError, type PhoneNumber } from "libphonenumber-js/max";

const testNumber = "8005555555";

let parsedNumber: PhoneNumber | null = null
try {
    parsedNumber = parsePhoneNumberWithError(testNumber, "US");
    console.log(`Parsed number: ${parsedNumber.formatNational()}`)
} catch (error) {
    console.error(error);
}
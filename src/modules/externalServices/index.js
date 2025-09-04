import { VENDORS } from "./constants.js";
import heathianService from "./healthians/index.js"

class Service {

    constructor() { }

    getPackages = async (vendor = VENDORS.HEALTHIANS) => {
        try {
            //TODO fetch packages according to the vendor currently fetching only for single vendor
            return await heathianService.getPackages();
            // const promises = await Promise.allSettled([
            //     heathianService.getPackages()
            // ])
        } catch (error) {

        }
    }

    getSlots = async (vendor = VENDORS.HEALTHIANS, date, latitude, longitude, zipCode) => {
        //TODO fetch slots according to the vendor currently fetching only for single vendor
        return await heathianService.getSlots(date, latitude, longitude, zipCode)

    }

    createBooking = async ({
        appointmentData,
        user
    }) => { 
            const { vendor } = appointmentData;

            if (vendor === 'healthians') {
                const userData = {
                    "_id": user?._id,
                    "name": user?.name,
                    "phone": user?.phone,
                    "age": user?.age,
                    "countryCode": user?.countryCode,
                    "gender": user?.gender,
                    "balance": user?.balance,
                    "address": appointmentData?.address,
                    "disabled": false,
                    "isVerified": true,
                    "__v": 0
                }
                const { stm_id, location, city, zipcode } = appointmentData;
        
                await heathianService.createBooking({
                        user: userData,
                        packages: appointmentData?.packages,
                        slot_id: stm_id,
                        latitude: location?.latitude,
                        longitude: location?.longitude,
                        city,
                        zipcode
                    }) 
            }
            return true; 
    }

    rescheduleBooking = async () => {
        try {

        } catch (error) {

        }
    }
}

const externalServices = new Service();
export default externalServices;
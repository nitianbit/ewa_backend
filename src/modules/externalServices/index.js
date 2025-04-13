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

    getSlots = async (vendor = VENDORS.HEALTHIANS, date) => {
        try {
            //TODO fetch slots according to the vendor currently fetching only for single vendor
            return await heathianService.getSlots(date)
        } catch (error) {
            console.log(error);
            return null
        }
    }

    createBooking = async ({
        vendor = VENDORS.HEALTHIANS,
        packages,//array of selected packages
        user
    }) => {
        try {
            const user = {
                "_id": "678407b99a4b885a2077f14b",
                "name": "Shubham Goyal",
                "phone": 3671516670,
                "age": 23,
                "countryCode": 91,
                "gender": "Male",
                "balance": 0,
                "address": "Shop no. 171,Goyal Traders",
                "company": "67715ab1f98e0c2296c5c4ad",
                "disabled": false,
                "isVerified": true,
                "__v": 0
            }
            const promises = await Promise.allSettled([
                heathianService.createBooking({
                    user,
                    packages: ["profile_1", "profile_2"]
                })
            ])
            console.log(promises);
        } catch (error) {

        }
    }

    rescheduleBooking = async () => {
        try {

        } catch (error) {

        }
    }
}

const externalServices = new Service();
export default externalServices;
import crypto from 'crypto';
import moment from 'moment';
import { api } from '../../api/index.js';
import { getGenderSalutation } from '../../../utils/helper.js';

class Service {
    credentials = {
        userName: "ugvfNAIzyXW3MKOYNWP7lFrOYAbKKTWJ5swF81hmCeNWzA72ltSu84aOA40flTZu",
        password: "wPi9DKaWyXsR3HFGQ2SDd41EqRTpvjHK",
        checksumKey: "u4HXede3HFyHOhL9Bqrajsl4",
        partnerName: "ewahealthcare",
        baseURL: "https://t25crm.healthians.co.in/api",
        zone_id: 53,
        //custom our data
        accessToken: "",//update it on expire
        accessTokenExpiry: null
    };
    endPoints = {
        accessToken: (partnerName) => `/${partnerName}/getAccessToken`,
        getPackages: (partnerName) => `/${partnerName}/getPartnerProducts`,
        createBooking: (partnerName) => `/${partnerName}/createBooking_v3`,
        getSlotsByLocation: (partnerName) => `/${partnerName}/getSlotsByLocation`,
        getZone: (partnerName) => `/${partnerName}/checkServiceabilityByLocation_v2`,
    }


    constructor() { }

    getURL = (url) => `${this.credentials.baseURL}${url}`


    getHeaders = async (checksum = null) => {
        await this.getAccessToken();
        const { accessToken } = this.credentials;
        return {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            ...(checksum && { 'X-Checksum': checksum })
        };

    }

    createAccessToken = async () => {
        const { userName, password } = this.credentials
        const response = await api({
            url: this.getURL(this.endPoints.accessToken(this.credentials.partnerName)),
            method: 'GET',
            headers: {
                'Authorization': `Basic ${btoa(`${userName}:${password}`)}`
            }
        })
        if (response.code == 200) {
            this.credentials.accessToken = response.access_token;
            this.credentials.accessTokenExpiry = moment().add(15, 'minutes').unix();
        }
        return response.access_token;
    }

    getAccessToken = async () => {
        const { accessToken, accessTokenExpiry } = this.credentials;
        if (!accessToken || !accessTokenExpiry || (accessTokenExpiry < moment().unix())) {
            return await this.createAccessToken();
        }
        return accessToken;
    }

    createChecksum = (data) => {
        const hmac = crypto.createHmac('sha256', this.credentials.checksumKey);
        hmac.update(JSON.stringify(data));
        return hmac.digest('hex');
    }

    getPackages = async () => {
        const headers = await this.getHeaders();

        const response = await api({
            url: this.getURL(this.endPoints.getPackages(this.credentials.partnerName)),
            method: 'POST',
            data: {
                "zipcode": "122006",
                "product_type": "profile",
                "product_type_id": "",
                "start": "0",
                "limit": "40",
                "test_type": "pathology"
            },
            headers
        })
        if (response.code == 200) {
            return response?.data?.map((product) => ({
                ...product,
                name: product?.test_name
            }))
        }
        return [];

    }

    createBooking = async ({
        user,
        packages, //array
    }) => {
        const payload = {
            customer: [
                {
                    customer_id: user?._id,
                    customer_name: user?.name,
                    relation: 'self',
                    gender: getGenderSalutation(user?.gender),
                    contact_number: user?.phone,
                    age: user?.age
                }
            ],
            slot: {
                slot_id: "123"
            },
            package: [{ deal_id: packages }],
            customer_calling_number: user?.phone,
            billing_cust_name: user?.name,
            gender: getGenderSalutation(user?.gender),
            mobile: user?.phone,
            zone_id: this.credentials.zone_id,
            latitude: "28.512195944534703",
            longitude: "77.08483249142313",
            address: user?.address,
            sub_locality: "Gurgaon",
            zipcode: 122016,
            vendor_billing_user_id: user?._id
        }
        const checksum = this.createChecksum(payload);
        const headers = await this.getHeaders(checksum);

        const response = await api({
            url: this.getURL(this.endPoints.createBooking(this.credentials.partnerName)),
            method: 'POST',
            data: payload,
            headers
        })
        if (response.code == 200) {
            return response
        }
        return response
    }

    getZone = async (latitude, longitude, zipCode) => {
        const headers = await this.getHeaders();
        const response = await api({
            url: this.getURL(this.endPoints.getZone(this.credentials.partnerName)),
            method: 'POST',
            data: {
                "zipcode": zipCode,
                "lat": latitude,
                "long": longitude
            },
            headers
        })
        
        if (response.code == 200 && response?.status) {
            return response.data?.zone_id
        }
        throw new Error(response?.message)
    }
    // {
    //     "status": true,
    //     "message": "This Lat Long is serviceable.",
    //     "data": {
    //       "zone_id": "86"
    //     },
    //     "resCode": "RES0001",
    //     "code": 200
    //   }

    getSlots = async (date, latitude, longitude, zipCode) => { //date YYYYMMDD
        const headers = await this.getHeaders();
        const zone = await this.getZone(latitude, longitude, zipCode);

        const response = await api({
            url: this.getURL(this.endPoints.getSlotsByLocation(this.credentials.partnerName)),
            method: 'POST',
            data: {
                "slot_date": moment(date, 'YYYYMMDD').format('YYYY-MM-DD'),
                "zone_id": zone,
                "lat": latitude,
                "long": longitude
            },
            headers
        })
        if (response.code == 200) {
            return response.data
        }
        return []
    }

    rescheduleBooking = async () => {

    }
}

const heathianService = new Service();
export default heathianService;


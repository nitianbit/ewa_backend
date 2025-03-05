import { MODULES } from "../default/utils/helper.js";

export const getDefaultOTP = (module) => {
    switch (module) {
        case MODULES.ADMIN:
            return 7825
         case MODULES.SUPERVISOR:
            return 5278
        case MODULES.DOCTOR:
            return 1011;
        case MODULES.HOSPITAL:
            return 9086;
        case MODULES.LABORATORY:
            return 6411; 
        case MODULES.PATIENTS:
            return 7877;
        case MODULES.HR:
            return 2580 
        default:
            break;
    }
};

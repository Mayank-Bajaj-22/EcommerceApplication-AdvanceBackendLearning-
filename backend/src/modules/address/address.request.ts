import { createAddressDTO, updateAddressDTO } from "./address.schema.js";

export const cleanCreateAddressData = (
    data: createAddressDTO,
) : createAddressDTO => {
    return {
        addressType: data.addressType,
        addressLine1: data.addressLine1.toLowerCase(),
        addressLine2: data.addressLine2?.toLowerCase(),
        city: data.city.toLowerCase(),
        state: data.state.toLowerCase(),
        pincode: data.pincode.toLowerCase(),
        country: data.country.toLowerCase(),
    };
};

export const cleanUpdateAddressData = (
    data: updateAddressDTO,
) : updateAddressDTO => {
    return {
        addressType: data.addressType,
        addressLine1: data.addressLine1?.toLowerCase(),
        addressLine2: data.addressLine2?.toLowerCase(),
        city: data.city?.toLowerCase(),
        state: data.state?.toLowerCase(),
        pincode: data.pincode?.toLowerCase(),
        country: data.country?.toLowerCase(),
    };
};
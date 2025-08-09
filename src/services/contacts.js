import Contact from '../models/Contact.js';

export const getAllContacts = async (skip, limit, countOnly = false, filter = {}, sortBy = 'name', order = 1) => {
    if (countOnly) {
        return Contact.countDocuments(filter);
    }

    return Contact.find(filter)
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit);
};

export const getContactById = async (id) => await Contact.findById(id);

export const createNewContact = async (data) => await Contact.create(data);

export const updateContactById = async (id, data) =>
    await Contact.findByIdAndUpdate(id, data, { new: true });

export const patchContactById = async (id, data) =>
    await Contact.findByIdAndUpdate(id, data, { new: true });

export const deleteContactById = async (id) =>
    await Contact.findByIdAndDelete(id);


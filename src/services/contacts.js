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

export const getContactById = async (id, ownerId) =>
    await Contact.findOne({ _id: id, owner: ownerId });

export const createNewContact = async (data) =>
    await Contact.create(data);

export const updateContactById = async (id, data, ownerId) =>
    await Contact.findOneAndUpdate(
        { _id: id, owner: ownerId },
        data,
        { new: true }
    );

export const patchContactById = async (id, data, ownerId) =>
    await Contact.findOneAndUpdate(
        { _id: id, owner: ownerId },
        data,
        { new: true }
    );

export const deleteContactById = async (id, ownerId) =>
    await Contact.findOneAndDelete({ _id: id, owner: ownerId });
import Contact from '../models/Contact.js';

export const getAllContacts = async (
    skip,
    limit,
    countOnly = false,
    filter = {},
    sortBy = 'name',
    order = 1,
    userId
) => {
    const query = { ...filter, userId };

    if (countOnly) {
        return Contact.countDocuments(query);
    }

    return Contact.find(query)
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit);
};

export const getContactById = async (id, userId) =>
    await Contact.findOne({ _id: id, userId });

export const createNewContact = async (data, userId) =>
    await Contact.create({ ...data, userId });

export const updateContactById = async (id, data, userId) =>
    await Contact.findOneAndUpdate({ _id: id, userId }, data, { new: true });

export const patchContactById = async (id, data, userId) =>
    await Contact.findOneAndUpdate({ _id: id, userId }, data, { new: true });

export const deleteContactById = async (id, userId) =>
    await Contact.findOneAndDelete({ _id: id, userId });

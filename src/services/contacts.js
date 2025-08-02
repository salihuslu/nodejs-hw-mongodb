import Contact from '../models/Contact.js';

export const getAllContacts = async () => await Contact.find();

export const getContactById = async (id) => await Contact.findById(id);

export const createNewContact = async (data) => await Contact.create(data);

export const updateContactById = async (id, data) =>
    await Contact.findByIdAndUpdate(id, data, { new: true });

export const deleteContactById = async (id) =>
    await Contact.findByIdAndDelete(id);

export const patchContactById = async (id, data) =>
    await Contact.findByIdAndUpdate(id, data, { new: true });

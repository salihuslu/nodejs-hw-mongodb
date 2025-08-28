import createError from "http-errors";
import fs from "fs/promises";
import { uploadToCloudinary } from "../services/cloudinary.js";
import {
    getAllContacts,
    getContactById,
    createNewContact,
    updateContactById,
    deleteContactById,
    patchContactById,
} from "../services/contacts.js";

export const getContacts = async (req, res) => {
    let {
        page = 1,
        perPage = 10,
        sortBy = "name",
        sortOrder = "asc",
        type,
        isFavourite,
    } = req.query;

    const limit = parseInt(perPage);
    const skip = (parseInt(page) - 1) * limit;
    const order = sortOrder === "desc" ? -1 : 1;

    const filter = { userId: req.user.id };

    if (type) {
        filter.contactType = type;
    }
    if (isFavourite !== undefined) {
        filter.isFavourite = isFavourite === "true";
    }

    const [contacts, totalItems] = await Promise.all([
        getAllContacts(skip, limit, false, filter, sortBy, order),
        getAllContacts(0, 0, true, filter),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
        status: 200,
        message: "Successfully found contacts!",
        data: {
            data: contacts,
            page: parseInt(page),
            perPage: limit,
            totalItems,
            totalPages,
            hasPreviousPage: parseInt(page) > 1,
            hasNextPage: parseInt(page) < totalPages,
        },
    });
};

export const getContact = async (req, res) => {
    const { id } = req.params;
    const contact = await getContactById(id, req.user.id);
    if (!contact) throw createError(404, "Contact not found");
    res.json(contact);
};

export const createContact = async (req, res, next) => {
    try {
        let photoUrl = null;

        if (req.file) {
            photoUrl = await uploadToCloudinary(req.file.path);
            await fs.unlink(req.file.path); // tmp dosyayı sil
        }

        const newContact = await createNewContact(
            { ...req.body, photo: photoUrl },
            req.user.id
        );

        res.status(201).json({
            status: 201,
            message: "Successfully created a contact!",
            data: newContact,
        });
    } catch (error) {
        next(error);
    }
};

export const updateContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        let photoUrl = null;

        if (req.file) {
            photoUrl = await uploadToCloudinary(req.file.path);
            await fs.unlink(req.file.path);
        }

        const updated = await updateContactById(
            id,
            { ...req.body, ...(photoUrl && { photo: photoUrl }) },
            req.user.id
        );

        if (!updated) throw createError(404, "Contact not found");
        res.json(updated);
    } catch (error) {
        next(error);
    }
};

export const patchContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        let photoUrl = null;

        if (req.file) {
            photoUrl = await uploadToCloudinary(req.file.path);
            await fs.unlink(req.file.path);
        }

        const updated = await patchContactById(
            id,
            { ...req.body, ...(photoUrl && { photo: photoUrl }) },
            req.user.id
        );

        if (!updated) throw createError(404, "Contact not found");

        res.status(200).json({
            status: 200,
            message: "Successfully patched a contact!",
            data: updated,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteContact = async (req, res) => {
    const { id } = req.params;
    const deleted = await deleteContactById(id, req.user.id);
    if (!deleted) throw createError(404, "Contact not found");
    res.status(204).send();
};

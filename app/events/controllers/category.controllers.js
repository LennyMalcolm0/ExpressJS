const { Category } = require("../event.models");
const mongoose = require("mongoose");

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).lean();
    
        res.status(200).send(categories);
    } catch (error) {
        res.status(400).send(error);
    }
}

const createCategory = async (req, res) => {
    const payload = req.body;
    if (!payload) {
        return res.status(401).send({ error: "No payload sent" });
    }

    const category = await Category.findOne({ name: payload.name });
    if (category) {
        return res.status(401).send({ error: "Category name already exists" });
    }

    try {
        const newCategory = await Category.create({ ...payload });

        res.status(200).send(newCategory);
    } catch (error) {
        res.status(400).send(error);
    }
}

const updateCategory = async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(401).send({ error: "Invalid category id" });
    }
    if (!payload) {
        return res.status(401).send({ error: "No payload sent" });
    }

    const category = await Category.findOne({ 
        name: payload.name,
        _id: { $ne: id },
    });
    if (category) {
        return res.status(401).send({ error: "Category name already exists" });
    }

    try {
        const category = await Category
            .findByIdAndUpdate(
                id,
                { ...payload },
                { new: true, lean: true }
            );
    
        if (!category) {
            return res.status(404).send({ error: "Category not found" });
        }
    
        res.status(200).send(category);
    } catch (error) {
        res.status(400).send(error);
    }
}

const deleteCategory = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(401).send({ error: "Invalid category id" });
    }

    try {
        await Category.findByIdAndDelete(id);
        res.status(200).send("Success");
    } catch (error) {
        res.status(400).send(error);
    }
}

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
}
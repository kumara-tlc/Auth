const express = require('express');
const item = express.Router();
const itemCollection = require('../../models/item');
const projectCollection = require('../../models/project');
const { GetUnixTimestamp, GenerateUniqueId } = require('../../core/common');
const authMiddleware = require('../../core/auth');

/* create item */
item.post('/', authMiddleware, async (req, res) => {
    try {
        let requestData = req.body;

        const projectData = await projectCollection.findOne({ _id: requestData.project_id, "additional_attributes.is_deleted" : false, "additional_attributes.created_by" : req.user._id });

        if(!projectData){
            return res.status(400).send({ success: false, message: "Project Data Not Found" });
        }

        const timeStamp = GetUnixTimestamp();

        const result = await itemCollection.create({
            ...requestData,
            _id: GenerateUniqueId(),
            additional_attributes: {
                created_by: req.user._id,
                created_at: timeStamp,
                updated_by: req.user._id,
                updated_at: timeStamp
            }
        });
        if (!!!result) {
            return res.status(400).send({success: false, message: "Failed to Create Item"});
        }

        return res.status(200).send({success: true, message: "success"});

    } catch(error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: error.message,
        });
    }
});

/* get item details */
item.get('/:id', authMiddleware, async (req, res) => {
    try {
        let { id } = req.params;
        const result = await itemCollection.findOne({_id : id, "additional_attributes.is_deleted" : false, "additional_attributes.created_by" : req.user._id});
        if (!!!result) {
            return res.status(400).send({success: false, message: "Failed to Get Item"});
        }
        return res.status(200).send({success: true, message: "success", data: result});
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: error.message,
        });
    }
});

/* get item list */
item.get('/', authMiddleware, async (req, res) => {
    try {
        const result = await itemCollection.find({ "additional_attributes.is_deleted" : false, "additional_attributes.created_by" : req.user._id });
        if (!!!result) {
            return res.status(400).send({success: false, message: "Failed to Get Item"});
        }
        return res.status(200).send({success: true, message: "success", data: result});
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: error.message,
        });
    }
});

/* update item */
item.put('/:id', authMiddleware, async (req, res) => {
    try {
        let { id } = req.params;
        let existingData = await itemCollection.findOne({_id: id, "additional_attributes.is_deleted" : false, "additional_attributes.created_by" : req.user._id});

        if (!!!existingData) {
            return res.status(400).send({success: false, message: "Failed to Get Item"});
        }

        const requestData = req.body;

        const projectData = await projectCollection.findOne({ _id: requestData.project_id, "additional_attributes.is_deleted" : false, "additional_attributes.created_by" : req.user._id });

        if(!projectData){
            return res.status(400).send({success: false, message: "Project Data Not Found"});
        }

        Object.entries(requestData).map((val) => {
            existingData[val[0]] = val[1];
        })

        existingData["additional_attributes"]["updated_by"] = req.user._id;
        existingData["additional_attributes"]["updated_at"] = GetUnixTimestamp();

        const result = await itemCollection.updateOne({_id: id, "additional_attributes.is_deleted" : false, "additional_attributes.created_by" : req.user._id}, existingData);
        if (!!!result) {
            return res.status(400).send({success: false, message: "Failed to Update Item"});
        }

        return res.status(200).send({success: true, message: "success"});

    } catch(error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: error.message,
        });
    }
});


/* delete item */
item.delete('/:id', authMiddleware, async (req, res) => {
    try {
        let { id } = req.params;
        let existingData = await itemCollection.findOne({_id: id, "additional_attributes.is_deleted" : false, "additional_attributes.created_by" : req.user._id});

        if (!!!existingData) {
            return res.status(400).send({success: false, message: "Failed to Get Item"});
        }

        existingData["additional_attributes"]["is_deleted"] = true;
        existingData.save();

        if (!!!existingData) {
            return res.status(400).send({success: false, message: "Failed to Delete Item"});
        }

        return res.status(200).send({success: true, message: "success"});

    } catch(error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: error.message,
        });
    }
});

module.exports = item;

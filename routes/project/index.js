const express = require('express');
const project = express.Router();
const projectCollection = require('../../models/project');
const { GetUnixTimestamp } = require('../../core/common');
const mongoose = require("mongoose");
const authMiddleware = require('../../core/auth');

/* create project */
project.post('/', authMiddleware, async (req, res) => {
    try {
        let requestData = req.body;
        const result = await projectCollection.create({
            ...requestData,
            additional_attributes: {
                created_by: req.user._id,
                updated_by: req.user._id
            }
        });
        if (!!!result) {
            return res.status(400).send({success: false, message: "Failed to Create Project"});
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

/* get project details */
project.get('/:id', authMiddleware, async (req, res) => {
    try {
        let { id } = req.params;
        const result = await projectCollection.findOne({_id : id, "additional_attributes.is_deleted" : false, "additional_attributes.created_by" : req.user._id});
        if (!!!result) {
            return res.status(400).send({success: false, message: "Failed to Get Project"});
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

/* get project list */
project.get('/', authMiddleware, async (req, res) => {
    try {
        const result = await projectCollection.find({ "additional_attributes.is_deleted" : false, "additional_attributes.created_by" : req.user._id });
        if (!!!result) {
            return res.status(400).send({success: false, message: "Failed to Get Project"});
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

/* update project */
project.put('/:id', authMiddleware, async (req, res) => {
    try {
        let { id } = req.params;
        let existingData = await projectCollection.findOne({_id: id, "additional_attributes.is_deleted" : false, "additional_attributes.created_by" : req.user._id});

        if (!!!existingData) {
            return res.status(400).send({success: false, message: "Failed to Get Project"});
        }

        const requestData = req.body;

        Object.entries(requestData).map((val) => {
            existingData[val[0]] = val[1];
        })

        existingData["additional_attributes"]["updated_by"] = req.user._id;
        existingData["additional_attributes"]["updated_at"] = GetUnixTimestamp();

        const result = await projectCollection.updateOne({_id: id, "additional_attributes.is_deleted" : false}, existingData);
        if (!!!result) {
            return res.status(400).send({success: false, message: "Failed to Update Project"});
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


/* delete project */
project.delete('/:id', authMiddleware, async (req, res) => {
    try {
        let { id } = req.params;
        let existingData = await projectCollection.findOne({_id: id, "additional_attributes.is_deleted" : false});

        if (!!!existingData) {
            return res.status(400).send({success: false, message: "Failed to Get Project"});
        }

        existingData["additional_attributes"]["is_deleted"] = true;
        existingData.save();

        if (!!!existingData) {
            return res.status(400).send({success: false, message: "Failed to Delete Project"});
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

module.exports = project;

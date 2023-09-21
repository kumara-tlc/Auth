const express = require('express');
const user = express.Router();
const userCollection = require('../../models/user');
const credCollection = require('../../models/credential');
const settingsCollection = require('../../models/settings');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { GetUnixTimestamp, GenerateUniqueId } = require('../../core/common');
const mongoose = require("mongoose");
const authMiddleware = require('../../core/auth');

/* sign up user */
user.post('/signup', (req, res) => {

    let {password, hint, ...requestData} = req.body;

    // check if email and password are provided
    if (!!!requestData.email || !!!password) {
        return res.status(400).json({success: false, message: 'Email and password are required.' });
    }

    userCollection.findOne({email: requestData.email, "additional_attributes.is_deleted" : false}).then(async (existingUser) => {
        if (!!existingUser){
            return res.status(409).send({
               success: false,
               message: "User already exists with this email."
            });
        }

        const session = await mongoose.startSession();
        const uniqueId = GenerateUniqueId();
        try {
            session.startTransaction();
            requestData._id = uniqueId;
            const timeStamp = GetUnixTimestamp();
            requestData.additional_attributes = {
                created_at: timeStamp,
                updated_at: timeStamp
            };
            let result = await userCollection.create([requestData], {session});
            if (!!!result || result.length === 0) {
                await session.abortTransaction();
                res.status(400).send({success: false, message: "Failed to Create User"});
            } else {
                // hash password and create user
                const hashedPassword = await bcrypt.hash(password, 10);
                const userId = result.pop()._id;
                const credResult = await credCollection.create([{_id: uniqueId, userId: userId, password: hashedPassword, hint: hint,
                                                                 additional_attributes: {
                                                                     created_at: timeStamp,
                                                                     updated_at: timeStamp
                                                                 }
                                                                }], {session});
                const settingsResult = await settingsCollection.create([{_id: uniqueId, userId: userId,
                                                                         additional_attributes: {
                                                                             created_at: timeStamp,
                                                                             updated_at: timeStamp
                                                                         }}], {session})
                
                if (!!!credResult || credResult.length === 0 || !!!settingsResult || settingsResult.length === 0) {
                    await session.abortTransaction();
                    res.status(400).send({success: false, message: "Failed to Create Credential or System Settings Request"});
                } else {
                    await session.commitTransaction();
                    res.status(200).send({success: true, message: "success"});
                }
            }
        }
        catch (error) {
            console.log(error);
            await session.abortTransaction();
            res.status(400).send({
                success: false,
                message: error.message,
            });
        }
        finally {
            await session.endSession();
        }
    });
});

/* login user */
user.post('/login', (req, res) => {
    let { email, password } = req.body;

    // check if email and password are provided
    if (!!!email || !!!password) {
        return res.status(400).json({success: false, message: 'Email and password are required.' });
    }

    try{
        userCollection.findOne({email: email, "additional_attributes.is_deleted" : false}).then(async (user) => {

            if (!!!user) {
                return res.status(401).json({success: false, message: 'Invalid email or password.' });
            }

            credCollection.findOne({ userId: user["_id"] }).then(async (credRes) => {
                if (!!!credRes) {
                    return res.status(401).json({success: false, message: 'Invalid email or password.' });
                }
                // compare hashed password
                let match = await bcrypt.compare(password, credRes.password);
                if (!match) {
                    return res.status(401).json({success: false, message: 'Invalid email or password.' });
                }

                // create JWT token
                let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET ?? "lkjbhvgcfdtcftgywe6t76tyuy", { expiresIn: '16h' });
                
                return res.status(200).send({success: true, message: "success", data: {token: token}});
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({success: false, message: "Internal Server Error. Please Try Again."});
    }
});

/* reset user password */
user.post('/reset/password', (req, res) => {

    let { email, oldHint, password, newHint } = req.body;

    userCollection.findOne({email : email, "additional_attributes.is_deleted" : false}).then(async (doc) => {
        if (!!!doc){
            return res.status(404).send({success: false, message: "Data not found."});
        }
        else{
            try{
                // hash password and create user
                let hashedPassword = await bcrypt.hash(password, 10);

                credCollection.findOneAndUpdate({userId: doc._id, hint: oldHint}, 
                    { password: hashedPassword, hint: newHint,  additional_attributes: { updated_at: GetUnixTimestamp() }}, 
                    { useFindAndModify: false, upsert: false }).then((credResult) => {
                        if (!!!credResult) {
                            return res.status(500).send({success: false, message: "Internal Server Error. Please Try Again."});
                        }
                        res.status(200).send({success: true, message: "success"});
                    });
            }
            catch(err){
                console.log(err);
                return res.status(404).send({success: false, message: "Data not found."});
            }
        }
    });
});


/* get user details */
user.get('/details', authMiddleware, (req, res) => {
    res.status(200).send({success: true, data: req.user});
});


/* update user details */
user.put('/details', authMiddleware, async (req, res) => {
    try{
        let existingData = await userCollection.findOne({ _id: req.user._id, "additional_attributes.is_deleted" : false });

        if(!existingData){
            return res.status(400).send({ success: false, message: "User Data Not Found" });
        }

        const requestData = req.body;

        Object.entries(requestData).map((val) => {
            existingData[val[0]] = val[1];
        })

        existingData["additional_attributes"]["updated_by"] = req.user._id;
        existingData["additional_attributes"]["updated_at"] = GetUnixTimestamp();

        const result = await userCollection.updateOne({_id: req.user._id, "additional_attributes.is_deleted" : false}, existingData);
        if (!!!result) {
            return res.status(400).send({success: false, message: "Failed to Update User Details"});
        }

        return res.status(200).send({success: true, message: "success"});

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: error.message,
        });
    }
});

/* get user system settings */
user.get('/system/settings', authMiddleware, async (req, res) => {
    try{
        const settingsData = await settingsCollection.findOne({ userId: req.user._id, "additional_attributes.is_deleted" : false });
        return res.status(200).send({success: true, data: settingsData});
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: error.message,
        });
    }
});

/* update user system settings */
user.put('/system/settings', authMiddleware, async (req, res) => {
    try{
        let existingData = await settingsCollection.findOne({ userId: req.user._id, "additional_attributes.is_deleted" : false });

        if(!existingData){
            return res.status(400).send({ success: false, message: "Settings Data Not Found" });
        }

        const requestData = req.body;

        Object.entries(requestData).map((val) => {
            existingData[val[0]] = val[1];
        })

        existingData["additional_attributes"]["updated_by"] = req.user._id;
        existingData["additional_attributes"]["updated_at"] = GetUnixTimestamp();

        const result = await settingsCollection.updateOne({userId: req.user._id, "additional_attributes.is_deleted" : false}, existingData);
        if (!!!result) {
            return res.status(400).send({success: false, message: "Failed to Update Settings"});
        }

        return res.status(200).send({success: true, message: "success"});

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: error.message,
        });
    }
});


module.exports = user;

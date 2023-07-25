"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/users.ts
const express_1 = require("express");
const user_1 = require("../models/user");
const router = (0, express_1.Router)();
router.get("/:id", async (req, res) => {
    const user = await user_1.User.findByPk(req.params.id);
    if (user) {
        res.json(user);
    }
    else {
        res.status(404).json({ error: "User not found" });
    }
});
exports.default = router;

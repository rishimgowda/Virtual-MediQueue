import { Router } from "express";
import { submitContact, listContacts } from "../controllers/contact.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { schemas } from "../validators/schemas.js";

const router = Router();

router.post("/", validate(schemas.contactUs), submitContact);
router.get("/", requireAuth, requireRole("admin"), listContacts);

export default router;

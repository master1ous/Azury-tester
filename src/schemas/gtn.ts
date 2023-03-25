import { Schema, model } from "mongoose";
import { GtnMod } from "../types";

const GtnMd = new Schema<GtnMod>({
	Numbers: {required: true, type: String},
    HasEnded: {required:false, type: String}
})

const Gtn = model("GtnMdl", GtnMd)

export default Gtn
import { Schema, model } from "mongoose";
import { GtwMod } from "../types";

const GtwMd = new Schema<GtwMod>({
	Word: {required: true, type: String},
    HasEnded: {required:false, type: String}
})

const Gtw = model("GtwMdl", GtwMd)

export default Gtw
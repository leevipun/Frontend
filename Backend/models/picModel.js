const mongoose = require("mongoose");

const picSchema = mongoose.Schema({
  pic: {
    type: Buffer,
    required: true,
  },
  id: {
    type: String,
  },
});

picSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Pic = mongoose.model("Pic", picSchema);

module.exports = Pic;

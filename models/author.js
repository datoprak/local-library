const { DateTime } = require("luxon");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const authorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

authorSchema.virtual("name").get(function () {
  let fullName = "";
  if (this.first_name && this.family_name)
    fullName = `${this.first_name} ${this.family_name}`;
  return fullName;
});

authorSchema.virtual("url").get(function () {
  return `/catalog/author/${this._id}`;
});

authorSchema.virtual("lifespan").get(function () {
  let lifespan = "";
  if (this.date_of_birth && this.date_of_death) {
    lifespan = `(${DateTime.fromJSDate(this.date_of_birth).toLocaleString(
      DateTime.DATE_MED
    )} - ${DateTime.fromJSDate(this.date_of_death).toLocaleString(
      DateTime.DATE_MED
    )})`;
  } else if (this.date_of_birth) {
    lifespan = `(${DateTime.fromJSDate(this.date_of_birth).toLocaleString(
      DateTime.DATE_MED
    )})`
  }
  return lifespan;
});

module.exports = mongoose.model("Author", authorSchema);

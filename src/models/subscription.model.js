import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema({}, {timestamps : true});


export const Subscription = mongoose.Model("Subscription", subscriptionSchema);
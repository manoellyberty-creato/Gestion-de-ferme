import Campaign from "../models/Campaign.js";
import User from "../models/User.js";
import Category from "../models/Category.js";

// export async function createCampaign(data, userId) {
//     const 
// }

export async function getCampaigns(userId) {
  return Campaign.find({ managerId: userId });
}
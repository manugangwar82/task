const User = require("../models/User");

const buildReferralTree = async (userId) => {
  const user = await User.findById(userId).select("username vipLevel referredUsers")
    .populate("referredUsers");

  if (!user) return null;

  const referrals = await Promise.all(
    user.referredUsers.map(refUser => buildReferralTree(refUser._id))
  );

  return {
    _id: user._id,
    username: user.username,
    vipLevel: user.vipLevel,
    referrals: referrals.filter(Boolean)
  };
};

exports.getReferralTree = async (req, res) => {
  try {
    const { id } = req.params;
    const tree = await buildReferralTree(id);

    res.json(tree);
  } catch (error) {
    console.error("Error building referral tree:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

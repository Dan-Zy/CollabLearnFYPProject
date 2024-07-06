import Community from "../../models/communityModel.js";
import fs from "fs";

const updateCommunity = async (req, res) => {

    try {
        const { communityId } = req.params;
        const {communityName, communityDescription, privacy, communityGenre, members} = req.body;
        const userId = req.userId;
        const image = req.file ? req.file.path : "";

        if(!communityId){
            return res.status(400).json({
                success: false,
                message: "Community ID is Required"
            });
        }

        // Fetch the community to be updated
        const community = await Community.findById(communityId);
        if (!community) {
            console.log("COMMUNITY NOT FOUND");
            return res.status(404).json({
                success: false,
                message: "Community not found"
            });
        }

        // Check if the requester is the admin of the community
        if (community.adminId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to update this community"
            });
        }

        // Prepare the update object
        let updateFields = {};

        if (communityName) {
            updateFields.communityName = communityName;
        }

        if (communityDescription) {
            const descLength = communityDescription.split(/\s+/).length;
            if (descLength > 500) {
                return res.status(406).json({
                    success: false,
                    message: "Community Description must not exceed 500 words"
                });
            }
            updateFields.communityDescription = communityDescription;
        }

        if (privacy) {
            if (!["Public", "Private"].includes(privacy)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid privacy setting"
                });
            }
            updateFields.privacy = privacy;
        }

        if (communityGenre) {
            updateFields.communityGenre = communityGenre;
        }

        // Check if image is provided, validate its format and size
        if (image) {
            const validFormats = ['image/jpeg', 'image/png'];
            const imageSize = fs.statSync(image).size;
            const imageFormat = req.file.mimetype;

            if (!validFormats.includes(imageFormat)) {
                return res.status(406).json({
                    success: false,
                    message: "Given format is not accepted, only JPG and PNG are allowed"
                });
            }

            if (imageSize > 50 * 1024 * 1024) { // Image size more than 50MB
                return res.status(406).json({
                    success: false,
                    message: "Image size must not exceed 50MB"
                });
            }

            updateFields.communityBanner = image;
        }

        // Update the community
        const updatedCommunity = await Community.findByIdAndUpdate(
            communityId,
            { $set: updateFields },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Community has been updated successfully",
            community: updatedCommunity
        });

    } catch (error) {
        console.log("Error while updating community: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }

}

export default updateCommunity;
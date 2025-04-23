const { StreamChat } = require("stream-chat");
const AppError = require("../utils/AppError")
const responseCode = require("../utils/responseCode")


const serverClient = StreamChat.getInstance(
    process.env.STREAM_CHAT_API,
    process.env.STREAM_CHAT_SECRET,
    { timeout: 10000 }
);

// Create A private Chat

const CreatePrivateChat = async (toUser, fromUser, connectionId) => {
    try {
        if (!toUser || !fromUser || !connectionId) {
            throw new AppError("User data not found!! while Creating private Chat", responseCode.ResourceNotFound, false);
        }

        const channelId = `${connectionId}`;

        const channel = serverClient.channel("messaging", channelId, {
            name: `${connectionId} - Private Chat`,
            members: [toUser._id, fromUser._id],
            created_by_id: fromUser._id.toString(),
            metadata: [
                {
                    username: fromUser.fullName,
                    profilePicture: fromUser.profilePicture,
                },
                {
                    username: toUser.fullName,
                    profilePicture: toUser.profilePicture,
                },
            ],
        });

        await channel.create();
        console.log(
            `Private chat created between ${fromUser.fullName} and ${toUser.fullName}`
        );

        return channel;
    } catch (err) {
        console.error("Error creating private chat:", err);
        throw err;
    }
};

// generateToken

const generateToken = async (user) => {
    try {
        if (!user) {
            throw new AppError("user not found while generating token", responseCode.ResourceNotFound, false);
        }
        await serverClient.upsertUser({
            id: user._id,
            name: user.fullName,
            username: user._userName,
            email: user.email,
            gender: user.gender,
            profileImage: user.profilePicture,
        });
        console.log("user successfully added to chat storage");
        const chattoken = serverClient.createToken(user._id.toString());
        if (!chattoken) {
            throw new AppError("failed to generate token", responseCode.InternalServer, false);
        }
        return chattoken;
    } catch (error) {
        console.log(error);
        throw error
    }
};

module.exports = { CreatePrivateChat, generateToken, serverClient };

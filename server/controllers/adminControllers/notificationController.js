require("dotenv").config();
const { models } = require("../../models");
const { notifications, users } = models;
const { Op } = require("sequelize");
const { pushNotification } = require("../../utils/pushNotification");
const emailTemplate = require("../../helper/emailTemplate");
const { mailSender } = require("../../utils/mailer");
module.exports = {
  sendNotification: async (req, res) => {
    try {
      let {
        user_ids,
        title,
        message,
        sendToAll,
        send_notification,
        send_email,
        order_id,
      } = req.body;
      if (!message || (!user_ids?.length && sendToAll != 1)) {
        return res.status(400).json({ message: "Missing users or message." });
      }
      // const truncateMessage = (msg) => {
      //     if (!msg) return "";
      //     return msg.length > 50 ? msg.substring(0, 50) + "..." : msg;
      // };
      const adminExists = await users.findOne({
        where: { role: 0 },
        attributes: ["id"],
        raw: true,
      });

      if (!adminExists) {
        return res.status(404).json({ message: "Admin not found." });
      }
      if (sendToAll == 1) {
        const allUsers = await users.findAll({
          where: { role: 2 },
          attributes: ["id"],
        });
        user_ids = allUsers.map((u) => u.id);
      }

      const receiverUsers = await users.findAll({
        where: { id: user_ids },
        attributes: ["id", "name", "email", "device_token"],
      });
      if (send_notification) {
        const notification = receiverUsers.map((user) => ({
          sender_id: adminExists.id,
          receiver_id: user.id,
          title,
          description: message,
          navigation_type: order_id ? 1 : 0,
        }));
        await notifications.bulkCreate(notification);
        io.emit("notification_count_refresh", {
          user_ids,
          count_refresh: true,
        });

        for (const user of receiverUsers) {
          if (user.device_token && user.device_token !== null) {
            const notificationData = {
              message: message,
              senderId: adminExists.id,
              senderName: "DFWerrands",
              senderImage: `https://admin.dfwerrands.com/${adminExists?.profile_picture}`,
              receiverId: user.id,
              type: order_id ? "order_notification" : "general_notification",
              title: title,
            };

            await pushNotification(user.device_token, notificationData);
          }
        }
      }

      if (send_email) {
        const logoImageLink = "https://app.dfwerrands.com/assets/logo.png";
        for (const user of receiverUsers) {
          await mailSender({
            to: user.email,
            subject: title,
            html: emailTemplate.adminEmailTemplate(logoImageLink, message),
          });
        }
      }

      return res.status(200).json({ message: "Notifications sent." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error", error });
    }
  },
};

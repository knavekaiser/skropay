app.get("/api/inviteUser", passport.authenticate("userPrivate"), (req, res) => {
  const { origin } = req.query;
  const messageBody = `${req.user.firstName} ${req.user.lastName} invites you to join Delivery Pay. Join Delivery Pay to make safe transactions. ${origin}/u/join?referer=${req.user._id}`;
  // send message here
  res.json({ code: "ok", message: "invitation sent" });
});

app.get("/api/getUsers", passport.authenticate("userPrivate"), (req, res) => {
  const { q } = req.query;
  const query = {
    _id: { $ne: req.user._id },
    $and: [
      ...req.user.blockList?.map((_id) => ({
        _id: { $not: { $eq: _id } },
      })),
      { _id: { $not: { $eq: req.user._id } } },
    ],
    blockList: { $not: { $in: [ObjectId(req.user._id)] } },
    ...(q && {
      $expr: {
        $regexMatch: {
          input: {
            $concat: [
              "$firstName",
              " ",
              "$lastName",
              " ",
              "$phone",
              " ",
              "$email",
              " ",
              "userId",
            ],
          },
          regex: new RegExp(q.replace(/[#-.]|[[-^]|[?|{}]/g, "\\$&")),
          options: "i",
        },
      },
    }),
  };
  User.aggregate([
    { $match: query },
    { $limit: 20 },
    {
      $project: {
        firstName: 1,
        lastName: 1,
        email: 1,
        phone: 1,
        profileImg: 1,
        address: 1,
      },
    },
  ])
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "something went wrong" });
    });
});
app.get("/api/getChat", passport.authenticate("userPrivate"), (req, res) => {
  Chat.aggregate([
    {
      $match: { user: req.user._id },
    },
    {
      $lookup: {
        from: "users",
        as: "clientProfile",
        let: {
          client: "$client",
        },
        pipeline: [
          { $match: { $expr: { $eq: ["$$client", "$_id"] } } },
          {
            $project: {
              firstName: 1,
              lastName: 1,
              phone: 1,
              email: 1,
              profileImg: 1,
              address: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "chats",
        as: "clientChat",
        let: { client: "$client", user: "$user" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$$client", "$user"] },
                  { $eq: ["$$user", "$client"] },
                ],
              },
            },
          },
          { $project: { lastSeen: 1 } },
        ],
      },
    },
    {
      $set: {
        client: {
          $mergeObjects: [{ $first: "$clientProfile" }, { _id: "$client" }],
        },
      },
    },
    {
      $set: {
        "client.lastSeen": { $first: "$clientChat.lastSeen" },
        messages: { $slice: ["$messages", -50, 50] },
      },
    },
    { $unset: ["clientProfile", "clientChat"] },
  ])
    .then((dbRes) => {
      const chats = dbRes.map((item) => ({
        ...item,
        userBlock: req.user.blockList?.some(
          (_id) => _id.toString() === item.client._id.toString()
        ),
        clientBlock: item.client.blockList?.some(
          (_id) => _id.toString() === req.user._id.toString()
        ),
      }));
      res.json(chats);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "something went wrong" });
    });
});

app.get(
  "/api/getMessages",
  passport.authenticate("userPrivate"),
  (req, res) => {
    Chat.aggregate([
      {
        $match: {
          user: req.user._id,
          client: ObjectId(req.query.client),
        },
      },
      {
        $project: {
          messages: { $slice: ["$messages", -(50 * (+req.query.page || 2))] },
          total: { $size: "$messages" },
        },
      },
    ])
      .then((contact) => {
        if (contact.length) {
          res.json({ code: "ok", contact: contact[0] });
        } else {
          res.status(400).json({ code: 400, message: "Chat does not exists." });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ code: 500, message: "Database error" });
      });
  }
);

app.post(
  "/api/sendContactRequest",
  passport.authenticate("userPrivate"),
  (req, res) => {
    Promise.all([
      User.findOneAndUpdate(
        {
          _id: req.user._id,
          contacts: { $not: { $elemMatch: { _id: req.body._id } } },
        },
        { $addToSet: { contacts: { _id: req.body._id } } }
      ),
      User.findOneAndUpdate(
        {
          _id: req.body._id,
          contacts: { $not: { $elemMatch: { _id: req.user._id } } },
        },
        { $addToSet: { contacts: { _id: req.user._id } } }
      ),
    ])
      .then(([user, target]) => {
        if (user && target) {
          res.json({ message: "request sent" });
          notify(
            target._id,
            JSON.stringify({
              title: "Contact Request",
              body: `${user.firstName} requested to contact.`,
            }),
            "User"
          );
        } else {
          res.status(400).json({ message: "bad request" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ message: "bad request" });
      });
  }
);
app.patch(
  "/api/acceptContactRequest",
  passport.authenticate("userPrivate"),
  async (req, res) => {
    const client = await User.findOne({
      _id: req.body._id,
      contacts: { $elemMatch: { _id: req.user._id, status: "pending" } },
    });
    if (client) {
      const userContacts = req.user.contacts.map((user) => {
        if (
          user._id.toString() === client._id.toString() &&
          user.status === "pending"
        ) {
          return {
            ...user._doc,
            status: "connected",
          };
        } else {
          return user;
        }
      });
      const clientContacts = client.contacts.map((user) => {
        if (
          user._id.toString() === req.user._id.toString() &&
          user.status === "pending"
        ) {
          return {
            ...user._doc,
            status: "connected",
          };
        } else {
          return user;
        }
      });
      Promise.all([
        User.findOneAndUpdate(
          { _id: req.user._id },
          { contacts: userContacts },
          { new: true }
        ),
        User.findOneAndUpdate(
          { _id: client._id },
          { contacts: clientContacts },
          { new: true }
        ),
      ])
        .then(([user, client]) => {
          res.json({ message: "request accepted" });
          notify(
            client._id,
            JSON.stringify({
              title: "Contact Request Accepted",
              body: `${user.firstName} accepted your contact request.`,
            }),
            "User"
          );
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ message: "something went wrong" });
        });
    } else {
      res.status(400).json({ message: "bad request" });
    }
  }
);

app.patch(
  "/api/updateLastSeen",
  passport.authenticate("userPrivate"),
  (req, res) => {
    if (req.body.rooms) {
      Chat.findOneAndUpdate(
        {
          $or: req.body.rooms.map((room) => ({ _id: room })),
          user: req.user._id,
        },
        { lastSeen: new Date() },
        { new: true }
      )
        .then((dbRes) => {
          res.json({ code: "ok", contact: dbRes });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ message: "something went wrong" });
        });
    } else {
      res.status(400).json({ code: 400, message: "rooms is required." });
    }
  }
);

app.patch(
  "/api/blockUser",
  passport.authenticate("userPrivate"),
  (req, res) => {
    if (req.body._id) {
      User.findOneAndUpdate(
        { _id: req.user._id },
        { $addToSet: { blockList: req.body._id } },
        { new: true }
      )
        .then((dbRes) => {
          if (dbRes) {
            res.json({ code: "ok", blockList: dbRes.blockList });
          } else {
            res.status(400).json({ code: 400, message: "Could not find user" });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ code: 500, message: "server error" });
        });
    } else {
      res.status(400).json({ code: 400, message: "_id is required" });
    }
  }
);
app.patch(
  "/api/unblockUser",
  passport.authenticate("userPrivate"),
  (req, res) => {
    if (req.body._id) {
      User.findOneAndUpdate(
        { _id: req.user._id },
        { $pull: { blockList: req.body._id } },
        { new: true }
      )
        .then((dbRes) => {
          if (dbRes) {
            res.json({ code: "ok", blockList: dbRes.blockList });
          } else {
            res.status(400).json({ code: 400, message: "Could not find user" });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ code: 500, message: "server error" });
        });
    } else {
      res.status(400).json({ code: 400, message: "_id is required" });
    }
  }
);

global.InitiateChat = async ({ user, client }) => {
  return Promise.all([
    new Chat({ user, client }).save().catch((err) => {
      if (err.code === 11000) {
        return Chat.findOne(
          { user, client },
          "createdAt updatedAt lastSeen user client _id"
        );
      }
    }),
    new Chat({ user: client, client: user }).save().catch((err) => {
      if (err.code === 11000) {
        return Chat.findOne(
          { user: client, client: user },
          "createdAt updatedAt lastSeen user client _id"
        );
      }
    }),
  ]);
};
global.SendMessage = async ({ rooms, message }) => {
  io.to(rooms[0].toString())
    .to(rooms[1].toString())
    .emit("messageToUser", { ...message });
  return Chat.updateMany(
    { $or: rooms.map((room) => ({ _id: room })) },
    { $push: { messages: message } },
    { new: true }
  ).then((data) => {
    return data;
  });
};

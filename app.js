const Express = require("express")
const Mongoose = require("mongoose")
const Cors = require("cors")
const Bcrypt = require("bcrypt")
const Jwt = require("jsonwebtoken")
const userModel = require("./models/users")
const postModel = require("./models/posts")

let app = Express()


app.use(Cors())
app.use(Express.json())

Mongoose.connect("mongodb+srv://a1r2j3u4n5:a1r2j3u4n5@cluster0.ck7ta.mongodb.net/blogAppDb?retryWrites=true&w=majority&appName=Cluster0")


//create a post
app.post("/create", async (req, res) => {

    let input = req.body

    let token = req.headers.token
    Jwt.verify(token, "BlogApp", async (error, decoded) => {
        if (decoded && decoded.email) {


            let result = new postModel(input)
            await result.save()
            res.json({ "status": "Success " })

        } else {

            res.json({ "status": "invalid Authentication" })

        }
    })


})

// View all posts
// View all posts
app.get("/viewall", (req, res) => {
    let token = req.headers.token;
    Jwt.verify(token, "BlogApp", (error, decoded) => {
      if (decoded && decoded.email) {
        let sortOption = {};
        const filter = req.query.filter || "Top";
        if (filter === "Top") {
          sortOption = { likes: -1 };
        } else if (filter === "Popular") {
          sortOption = { likes: -1 };
        } else if (filter === "Trending") {
          sortOption = { postedDate: -1 };
        } else if (filter === "Editor Choice") {
          sortOption = { postedDate: 1 };
        }
        postModel
          .find()
          .populate("userId", "name")
          .sort(sortOption)
          .then((items) => {
            res.json(items);
          })
          .catch((error) => {
            res.status(500).json({ status: "error", message: error.message });
          });
      } else {
        res.status(401).json({ status: "invalid Authentication" });
      }
    });
  });

// View my posts
app.get("/viewmypost", (req, res) => {
    let token = req.headers.token;
    Jwt.verify(token, "BlogApp", (error, decoded) => {
        if (decoded && decoded.email) {
            userModel
                .findOne({ email: decoded.email })
                .then((user) => {
                    if (!user) {
                        return res.status(404).json({ status: "user not found" });
                    }
                    postModel
                        .find({ userId: user._id })
                        .populate("userId", "name") // Populate the author's name
                        .then((items) => {
                            res.json(items);
                        })
                        .catch((error) => {
                            res.status(500).json({ status: "error", message: error.message });
                        });
                })
                .catch((error) => {
                    res.status(500).json({ status: "error", message: error.message });
                });
        } else {
            res.status(401).json({ status: "invalid Authentication" });
        }
    });
});




// View a single post by ID
app.get("/posts/:id", (req, res) => {
    let token = req.headers.token;
    Jwt.verify(token, "BlogApp", (error, decoded) => {
        if (decoded && decoded.email) {
            const userId = decoded.id; // Get the current user's ID from the token
            
            postModel
                .findById(req.params.id)
                .populate("userId", "name") // Populate the author's name
                .then((post) => {
                    if (!post) {
                        return res.status(404).json({ status: "post not found" });
                    }
                    
                    // Check if the current user has liked this post
                    const hasLiked = post.likedBy.includes(userId);
                    
                    // Add hasLiked property to the response
                    const postWithLikeStatus = {
                        ...post.toObject(),
                        hasLiked: hasLiked
                    };
                    
                    res.json(postWithLikeStatus);
                })
                .catch((error) => {
                    res.status(500).json({ status: "error", message: error.message });
                });
        } else {
            res.status(401).json({ status: "invalid Authentication" });
        }
    });
});

// Like a post
app.post("/posts/:id/like", (req, res) => {
    let token = req.headers.token;
    Jwt.verify(token, "BlogApp", (error, decoded) => {
        if (decoded && decoded.email) {
            const userId = decoded.id; // Get the current user's ID from the token
            
            postModel
                .findById(req.params.id)
                .then((post) => {
                    if (!post) {
                        return res.status(404).json({ status: "post not found" });
                    }
                    
                    // Check if user has already liked this post
                    if (post.likedBy.includes(userId)) {
                        return res.status(400).json({ 
                            status: "error", 
                            message: "You have already liked this post",
                            likes: post.likes,
                            hasLiked: true
                        });
                    }
                    
                    // Add user to likedBy array and increment likes
                    post.likedBy.push(userId);
                    post.likes += 1;
                    
                    post
                        .save()
                        .then(() => {
                            res.json({ 
                                status: "success", 
                                likes: post.likes,
                                hasLiked: true
                            });
                        })
                        .catch((error) => {
                            res.status(500).json({ status: "error", message: error.message });
                        });
                })
                .catch((error) => {
                    res.status(500).json({ status: "error", message: error.message });
                });
        } else {
            res.status(401).json({ status: "invalid Authentication" });
        }
    });
});





//sign in

app.post("/signIn", async (req, res) => {

    let input = req.body
    let result = userModel.find({ email: req.body.email }).then(
        (items) => {
            if (items.length > 0) {

                const passwordValidator = Bcrypt.compareSync(req.body.password, items[0].password)
                if (passwordValidator) {
                    Jwt.sign({ email: req.body.email }, "BlogApp", { expiresIn: "1d" },
                        (error, token) => {
                            if (error) {
                                res.json({ "status": "error", "errorMessage": error })
                            } else {
                                res.json({ "status": "success", "token": token, "userId": items[0]._id })

                            }
                        })


                } else {
                    res.json({ "status": "incorrect password" })
                }


            } else {
                res.json({ "status": "invalid id" })
            }
        }



    ).catch(

    )



})










// signup
app.post("/signup", async (req, res) => {

    let input = req.body
    let hashedPassword = Bcrypt.hashSync(req.body.password, 10)
    console.log(hashedPassword)
    req.body.password = hashedPassword

    userModel.find({ email: req.body.email }).then(
        (items) => {

            if (items.length > 0) {

                res.json({ "status": "email id allredy exist" })

            } else {

                let result = new userModel(input)
                result.save()
                res.json({ "status": "Success" })

            }

        }

    ).catch(
        (error) => { }

    )



})

app.listen(3030, () => {
    console.log("Server Started")
})



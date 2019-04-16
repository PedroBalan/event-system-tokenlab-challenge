const bcrypt = require("bcrypt");
const saltRounds = 10;
let NeDB = require("nedb");
let db = new NeDB({
    filename: "users.db",
    autoload: true
})

module.exports = (app)=>{

    app.get("/login", (req, res)=>{
        res.render("login", {data: {msg: ""}});
    });
    
    app.post("/login", (req, res)=>{

        db.find({email: req.body.loginEmail}).exec((err, data)=>{
            if(err){
                app.utils.error.send(err, req, res);
            } else {
                if(data.length == 0){
                    res.render("login", { data: {msg: "Usuário não cadastrado!"}});
                }else{
                    bcrypt.compare(req.body.loginPassword, data[0].password, function(err, result){
                        if(result == true){
                            res.statusCode = 200;
                            req.session.user = data[0];
                            res.redirect("/");
                        }else{
                            res.render("login", {data: { msg: "Senha incorreta! Tente novamente"}});
                        }
                    });
                }
            }
        });
    });

    app.post("/register", (req, res)=>{
        if(!app.utils.validator.user(app, req, res)){
            return false;
        }
        bcrypt.hash(req.body.registerPassword, saltRounds).then(function(hash){
            let newUser = {};
            newUser.email = req.body.registerEmail;
            newUser.name = req.body.registerName;
            newUser.password = hash;

            db.insert(newUser,(err, user)=>{
                if(err){
                    app.utils.error.send(err, req, res);
                }else{
                    res.status(200).redirect("login");
                }
            });
        });
    });

    app.get("/logout", (req, res)=>{
        req.session.destroy();
        res.redirect("login");
    });

};
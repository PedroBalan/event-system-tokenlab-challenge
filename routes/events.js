let NeDB = require("nedb");
let db = new NeDB({
    filename: "events.db",
    autoload: true
})

module.exports = (app)=>{

    var sessionChecker = (req, res, next)=>{
        if(req.cookies.user_sid && !req.session.user){
            res.clearCookie("user_sid");
        }
        if(req.session.user && req.cookies.user_sid){
            next();
        }else{
            res.redirect("login");
        }
    };

    app.get("/", sessionChecker,(req, res)=>{
        let msg;
        if(req.query.createEventSuccess == "true"){
            msg = "Evento criado com sucesso!"
        }else if(req.query.deleteEventSuccess == "true"){
            msg = "Evento excluído com sucesso!";
        }else if(req.query.editEventSuccess == "true"){
            msg = "Evento editado com sucesso!";
        }
        res.render("index", { data: {msg: msg}});
    });

    app.get("/events", sessionChecker,(req, res)=>{
        db.find({}).sort({beginDate:1}).exec((err, events)=>{
            if(err){
                app.utils.error.send(err, req, res);
            }else{
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({
                    events
                });
            }
        });
    });
    
    app.post("/events", sessionChecker, (req, res)=>{
        if(!app.utils.validator.event(app, req, res)){
            return false;
        }

        let beginTimeStamp = new Date(req.body.beginDate + " " + req.body.beginTime);
        let endTimeStamp = new Date(req.body.endDate + " " + req.body.endTime);
        if(beginTimeStamp > endTimeStamp){
            return false;
        }

        let beginTimeStampEvent;
        let endTimeStampEvent;

        db.find({}).sort({beginDate:1}).exec((err, events)=>{
            let canSchedule = true;
            if(err){
                app.utils.error.send(err, req, res);
            }else{
                if(events.length > 0){
                    for(event in events){
                        beginTimeStampEvent = new Date(events[event].beginDate + " " + events[event].beginTime).getTime();
                        endTimeStampEvent = new Date(events[event].endDate + " " + events[event].endTime).getTime();
    
                        if(!((endTimeStamp <= beginTimeStampEvent) || (endTimeStampEvent <= beginTimeStamp))){
                            canSchedule = false;
                            break;
                        }
                    }

                    if(canSchedule){
                        db.insert(req.body,(err, user)=>{
                            if(err){
                                app.utils.error.send(err, req, res);
                            }else{
                                res.status(200).json(user);
                            }
                        });
                    }
                }
            }
        });
    });

    app.put("/events/:id", sessionChecker, (req, res)=>{
        if(!app.utils.validator.event(app, req, res)){
            return false;
        }
        let beginTimeStamp = new Date(req.body.beginDate + " " + req.body.beginTime);
        let endTimeStamp = new Date(req.body.endDate + " " + req.body.endTime);
        if(beginTimeStamp > endTimeStamp){
            return false;
        }

        let beginTimeStampEvent;
        let endTimeStampEvent;

        db.find({}).sort({beginDate:1}).exec((err, events)=>{
            let canEdit = true;
            if(err){
                app.utils.error.send(err, req, res);
            }else{
                if(events.length > 0){
                    for(event in events){
                        if(events[event]._id != req.params.id){
                            beginTimeStampEvent = new Date(events[event].beginDate + " " + events[event].beginTime).getTime();
                            endTimeStampEvent = new Date(events[event].endDate + " " + events[event].endTime).getTime();
        
                            if(!((endTimeStamp <= beginTimeStampEvent) || (endTimeStampEvent <= beginTimeStamp))){
                                canEdit = false;
                                break;
                            }
                        }                            
                    }

                    if(canEdit){
                        db.update({_id: req.params.id}, req.body, err => {
                            if (err) {
                                app.utils.error.send(err, req, res);
                            } else {
                                res.status(200).json(Object.assign(req.params, req.body));
                            }
                        });
                    }
                }
            }
        });
    });

    app.delete("/events/:id", sessionChecker, (req, res)=>{
        db.remove({ _id: req.params.id }, {}, err=>{
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json(req.params);
            }
        });
    });

};
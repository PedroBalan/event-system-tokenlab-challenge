module.exports = {
    user: (app, req, res)=>{
        req.assert("registerName", "O nome é obrigatório.").notEmpty();
        req.assert("registerEmail", "O e-mail está inválido.").notEmpty().isEmail();
        req.assert("registerPassword", "A senha é obrigatória.").notEmpty();

        let errors = req.validationErrors();
        if(errors){
            app.utils.error.send(errors, req, res);
            return false;
        }else{
            return true;
        }
    },
    event: (app, req, res)=>{
        req.assert("name", "O nome é obrigatório.").notEmpty();
        req.assert("description", "A descrição do evento é obrigatória.").notEmpty();
        req.assert("beginDate", "A date de início é obrigatória.").notEmpty();
        req.assert("beginTime", "O horário de início é obrigatório.").notEmpty();
        req.assert("endDate", "A data de término é obrigatória.").notEmpty();
        req.assert("endTime", "O horário de término é obrigatório.").notEmpty();

        let errors = req.validationErrors();
        if(errors){
            app.utils.error.send(errors, req, res);
            return false;
        }else{
            return true;
        }
    }
}
const UsuarioMobile = require('../models/usuariomobile.model');
const jwt = require ('jsonwebtoken')
const secret = "mysecret";
const bcrypt = require("bcryptjs")
const authConfig = require('../auth/key.json');

module.exports = {
    async index(req, res){
        const user = await UsuarioMobile.find();
        return res.json(user);
    },
    async create(req,res){
        try {
            const { email_usuario } = req.body

            if(await UsuarioMobile.findOne({ email_usuario })) {
                return res.send({ error: "Usuario já cadastrado" })
            }
            const usermobile = await UsuarioMobile.create(req.body)
            return res.json(usermobile)
        }
        catch(err) {
            return res.send({ error: err.message })
        }
    },    
    async details(req,res){
        const {_id} = req.params;
        const user = await UsuarioMobile.findOne({_id});
        return res.json(user);
    },
    async delete(req, res){
        const {_id} = req.params;
        const user = await UsuarioMobile.findByIdAndDelete({_id});
        return res.json(user);
    },
    async update(req,res){
        const { id } = req.params
        const { saldo_usuario } = req.body
        const user = await UsuarioMobile.findByIdAndUpdate(id, { saldo_usuario }, { new: true });      
        return res.json(user);
    },
    
    async loginmobile(req, res) {
      try {
        const { email_usuario, senha_usuario } = req.body
  
        const user = await UsuarioMobile.findOne({ email_usuario })
        if(!user) {
            return res.send({ error: "Usuário não encontrado" })
        }
    
        if(!await bcrypt.compare(senha_usuario, user.senha_usuario)) {
            return res.send({ error: "Senha inválida" })
        }
    
        const token = jwt.sign({ id: user.id }, authConfig.secret, {
            expiresIn: 86400
        })
    
        return res.send({ user, token })
      }
      catch (err) {
          return res.send({ error: err.message })
      }
    }

}
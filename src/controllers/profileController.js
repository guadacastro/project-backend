const User = require('../models/user');

exports.showProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).lean();

    if (!user) {
      req.flash('error_msg', 'No se encontró el usuario.');
      return res.redirect('/login');
    }

    res.render('profile', { user });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Ocurrió un error al obtener la información del perfil.');
    return res.redirect('/');
  }
};
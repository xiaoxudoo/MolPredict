exports.deleteOrder = function (req, res, next) {
  const orderId = req.params.id;
  const Order = DB.get("Order");
  Order.get(orderId, function (err, result) {
    if (err) {
      next(err);
    } else {
      if(result.status != 5) {
        Order.remove(orderId, function (err, result) {
          if(err) {
            const msg = 'server error';
            res.render(`drug/pc/molopt/error.jade`, { 'error': msg });
            return false;
          } else {
            res.redirect('/home');
          }
        })
      } else {
        res.redirect('/home');
      }
    }
  })
}
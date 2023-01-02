const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const BadRequest = require('../errors/badRequest');
const ForbiddenError = require('../errors/forbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена.');
    })
    .then((card) => {
      if (req.user._id === card.owner.toString()) {
        Card.deleteOne(card)
          .then(() => {
            res.send(card);
          })
          .catch(next);
      } else {
        throw new ForbiddenError('Невозможно удалить карточку');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(() => {
      throw new NotFoundError('Передан несуществующий _id карточки');
    })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(() => {
      throw new NotFoundError('Переданы некорректные данные для снятия лайка.');
    })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

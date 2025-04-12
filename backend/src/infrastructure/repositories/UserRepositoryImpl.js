const UserRepository = require("../../domain/interfaces/UserRepository");
const User = require("../../domain/entities/User");
const { UserModel } = require("../datasources/models");

class UserRepositoryImpl extends UserRepository {
  async create(user) {
    const userModel = await UserModel.create({
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash
    });

    return this._mapToEntity(userModel);
  }

  async findById(id) {
    const userModel = await UserModel.findByPk(id);
    if (!userModel) return null;
    return this._mapToEntity(userModel);
  }

  async findByEmail(email) {
    const userModel = await UserModel.findOne({ where: { email } });
    if (!userModel) return null;
    return this._mapToEntity(userModel);
  }

  async findByUsername(username) {
    const userModel = await UserModel.findOne({ where: { username } });
    if (!userModel) return null;
    return this._mapToEntity(userModel);
  }

  async update(id, userData) {
    const [updated] = await UserModel.update(userData, { where: { id } });
    if (!updated) return null;

    const userModel = await UserModel.findByPk(id);
    return this._mapToEntity(userModel);
  }

  async delete(id) {
    const deleted = await UserModel.destroy({ where: { id } });
    return !!deleted;
  }

  _mapToEntity(userModel) {
    return new User(
      userModel.id,
      userModel.username,
      userModel.email,
      userModel.passwordHash,
      userModel.createdAt,
      userModel.updatedAt
    );
  }
}

module.exports = UserRepositoryImpl; 
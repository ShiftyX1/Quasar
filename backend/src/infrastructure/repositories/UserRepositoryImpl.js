const UserRepository = require("../../domain/interfaces/UserRepository");
const User = require("../../domain/entities/User");
const { UserModel } = require("../datasources/models");

class UserRepositoryImpl extends UserRepository {
  async create(user) {
    const userModel = await UserModel.create({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatarUrl: user.avatarUrl,
      passwordHash: user.passwordHash,
      authProvider: user.authProvider || 'local',
      externalId: user.externalId,
      metadata: user.metadata
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

  async findByExternalId(externalId) {
    const userModel = await UserModel.findOne({ 
      where: { 
        externalId: externalId,
        authProvider: 'keycloak'
      } 
    });
    if (!userModel) return null;
    return this._mapToEntity(userModel);
  }

  async findByEmailAndProvider(email, authProvider) {
    const userModel = await UserModel.findOne({ 
      where: { 
        email: email,
        authProvider: authProvider
      } 
    });
    if (!userModel) return null;
    return this._mapToEntity(userModel);
  }

  async update(user) {
    const [updated] = await UserModel.update({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatarUrl: user.avatarUrl,
      passwordHash: user.passwordHash,
      authProvider: user.authProvider,
      externalId: user.externalId,
      metadata: user.metadata
    }, { 
      where: { id: user.id } 
    });
    
    if (!updated) return null;

    const userModel = await UserModel.findByPk(user.id);
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
      userModel.firstName,
      userModel.lastName,
      userModel.email,
      userModel.avatarUrl,
      userModel.passwordHash,
      userModel.authProvider,
      userModel.externalId,
      userModel.metadata,
      userModel.createdAt,
      userModel.updatedAt
    );
  }
}

module.exports = UserRepositoryImpl; 
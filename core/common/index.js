// Generate UUID
const { v4: uuid } = require('uuid');

exports.GenerateUniqueId = () => {
	return uuid();
};

exports.GetUnixTimestamp = () => {
	return new Date().getTime();
}

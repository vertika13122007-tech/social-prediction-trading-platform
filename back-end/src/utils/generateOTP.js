const genrateOTP = () => {
    return Math.floor(1000 + Math.random()*900000).toString();
};

module.exports = genrateOTP;